# OpenEnade ETL

Pipeline ETL que processa os XLSX de Conceito Enade publicados pelo INEP/MEC e gera JSON estático por curso/ano para consumo do frontend.

## Execução

```bash
uv sync --dev
uv run python -m src.pipeline data/raw/conceito_enade_2023.xlsx data/output
```

## Pipeline

```
XLSX (INEP) -> ingest -> transform -> normalize -> rank -> export -> JSON
```

| Etapa | Módulo | Entrada | Saída |
|-------|--------|---------|-------|
| Ingest | `src/ingest.py` | Arquivo XLSX | DataFrame bruto com todas as colunas originais |
| Transform | `src/transform.py` | DataFrame bruto | DataFrame com colunas normalizadas e tipos corretos |
| Normalize | `src/normalize.py` | DataFrame transformado | DataFrame com regras de domínio aplicadas |
| Rank | `src/rank.py` | DataFrame normalizado | DataFrame com coluna `posicao` (ranking nacional) |
| Export | `src/export.py` | DataFrame rankeado | Arquivos JSON por curso/ano + índice |

## Garantias de corretude

Cada etapa do pipeline tem testes que verificam cenários reais encontrados nos dados do INEP. Os testes não são genéricos: eles reproduzem problemas específicos que existem nos datasets de 2019 a 2023.

### Ingest (3 testes)

O INEP muda o nome da planilha principal entre anos. Sem detecção automática, o pipeline quebraria silenciosamente ao processar um novo ano.

| Teste | O que valida | Por que importa |
|-------|-------------|-----------------|
| `test_read_enade_xlsx_returns_dataframe` | Lê XLSX com planilha `PLANILHA_ENADE` e retorna DataFrame com todas as linhas | Formato usado em 2021-2023. Se falhar, zero dados são processados. |
| `test_read_enade_xlsx_finds_planilha1` | Detecta planilha `Planilha1` como fonte de dados | Formato usado em anos anteriores. Sem esse fallback, dados antigos seriam ignorados. |
| `test_read_enade_xlsx_raises_on_no_data_sheet` | Levanta `ValueError` se nenhuma planilha conhecida for encontrada | Protege contra XLSX corrompido ou com estrutura inesperada. Falha explícita em vez de dados vazios. |

### Transform (5 testes)

Os XLSX do INEP têm inconsistências entre anos: asteriscos nos nomes de colunas, espaços extras, separadores decimais misturados. Sem normalização, os dados de anos diferentes teriam schemas incompatíveis.

| Teste | O que valida | Por que importa |
|-------|-------------|-----------------|
| `test_transform_strips_asterisks_from_column_names` | `Nome da IES*` vira `nome_da_ies` | Datasets de 2021+ adicionam `*` em algumas colunas. Sem strip, o mapeamento de colunas falha. |
| `test_transform_strips_double_asterisks_and_spaces` | `Sigla da UF** ` (com espaço trailing) vira `sigla_da_uf` | Datasets de 2021+ usam `**` e espaços em UF e Município. |
| `test_transform_selects_required_columns` | Output contém exatamente 14 colunas necessárias, nenhuma extra | Garante que colunas irrelevantes (Código da Área, Organização Acadêmica, etc.) são descartadas. Reduz tamanho do JSON final. |
| `test_transform_renames_score_columns` | `Conceito Enade (Contínuo)` vira `enade_continuo`, `Nota Bruta - FG` vira `nota_bruta_fg` | Nomes amigáveis para o frontend. Se errar, as notas aparecem como `null` no site. |
| `test_transform_handles_comma_decimals` | `"76,33"` (string com vírgula) é convertido para `76.33` (float) | **Bug real do dataset 2022.** Algumas colunas numéricas usam vírgula como separador decimal. Sem esse fix, as notas viram `NaN` ou causam erro de tipo. |

### Normalize (6 testes)

Regras de domínio que mapeiam valores brutos do INEP para categorias padronizadas. Cada regra existe porque o INEP usa valores diferentes entre anos ou que são detalhados demais para o frontend.

| Teste | O que valida | Por que importa |
|-------|-------------|-----------------|
| `test_normalize_maps_rede` | `Pública Federal` vira `PUBLICA` | O INEP tem 10+ variações (Pública Federal, Pública Estadual, Pública Municipal, Especial, etc.). O site precisa de só 2 categorias: PUBLICA e PRIVADA. |
| `test_normalize_maps_privada` | `Privada com fins lucrativos` vira `PRIVADA` | Complemento do teste anterior. Qualquer categoria que não é pública vira PRIVADA. |
| `test_normalize_maps_modalidade` | `Educação Presencial` vira `Presencial` | O INEP usa o nome completo. O site precisa do valor curto para caber nos badges. |
| `test_normalize_uppercases_text_fields` | Nomes de IES e municípios ficam em UPPERCASE | Padronização para busca e comparação. `Universidade de São Paulo` e `UNIVERSIDADE DE SAO PAULO` devem ser tratadas igual. Também remove acentos para uniformidade. |
| `test_normalize_filters_sc_rows` | Linhas com Conceito `SC` (Sem Conceito) são removidas | Cursos sem conceito não participam do ranking. Se incluídas, distorceriam a posição de todos os outros. Verificamos que a contagem de linhas diminui e a IES removida não aparece no output. |
| `test_normalize_renames_output_columns` | Colunas finais têm nomes curtos e padronizados | Garante o contrato com o frontend: `ies`, `ies_nome`, `curso`, `uf`, `municipio`, `rede`, `modalidade`, `nota_fg`, `nota_ce`, `enade_continuo`, `conceito_enade`. |

### Rank (3 testes)

O ranking é a feature principal do site. Qualquer erro aqui mostra posições erradas para milhares de instituições.

| Teste | O que valida | Por que importa |
|-------|-------------|-----------------|
| `test_rank_assigns_position_by_enade_continuo` | IES com nota 4.5 fica em #1, nota 3.0 em #2, nota 2.0 em #3 | Ordem descendente por nota contínua. Se invertida, a pior IES apareceria em primeiro. |
| `test_rank_breaks_ties_by_nota_ce_then_nota_fg` | Com nota contínua igual (3.5 vs 3.5), a IES com maior nota CE ganha | Desempate determinístico. Sem critério de desempate, a ordem seria aleatória entre IES empatadas. Usamos nota CE (componente específico) primeiro, depois FG (formação geral). |
| `test_rank_is_independent_per_curso` | Medicina e Direito têm rankings separados, ambos começando em #1 | Cada curso tem seu ranking independente. Sem essa separação, uma IES de Direito poderia aparecer no ranking de Medicina. |

### Export (3 testes)

Valida o formato final do JSON que o frontend consome. Qualquer mudança de schema aqui quebra o site.

| Teste | O que valida | Por que importa |
|-------|-------------|-----------------|
| `test_export_course_json_creates_file` | Cria `medicina-2023.json` com campos `curso`, `ano`, `total` e array `avaliacoes` ordenado por posição | Verifica que o arquivo é criado, nomeado corretamente (slug + ano), e que os dados estão na ordem certa (posição 1 primeiro). |
| `test_export_course_json_schema` | Cada avaliação tem exatamente 13 campos obrigatórios | Contrato com o frontend. Se faltar um campo (ex: `concluintes_participantes`), o componente React quebra. Se sobrar um campo, aumenta o tamanho do JSON sem necessidade. |
| `test_export_courses_index` | `courses.json` tem uma entrada com `slug`, `nome`, `ano` e `total` | Índice usado pela busca do frontend. Sem ele, nenhum curso aparece na tela inicial. |

## Rodando os testes

```bash
uv sync --dev
uv run pytest -v                    # 31 testes
uv run pytest --cov=src -v          # com relatório de cobertura (95%)
```

Todos os testes rodam sem acesso a rede ou arquivos reais do INEP. Usam fixtures com dados sintéticos que reproduzem as características dos datasets reais (nomes de colunas com asteriscos, vírgulas como separador decimal, valores SC, planilhas com nomes variados, linhas de rodapé, etc.).

Os 5% restantes sem cobertura são o bloco `if __name__ == "__main__"` do CLI (parsing de argumentos) e um branch de casting de tipo extremamente raro.
