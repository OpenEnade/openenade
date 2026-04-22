# OpenEnade

Ranking real das universidades brasileiras com base na nota contínua do ENADE.

O MEC publica o Conceito Enade como nota inteira de 1 a 5. Isso esconde diferenças enormes: dois cursos com notas 2.95 e 3.94 recebem o mesmo Conceito 4. O OpenEnade expõe a nota contínua real, permitindo comparações justas entre instituições.

## Dados

- **78 cursos** em 4 ciclos avaliativos (2019, 2021, 2022, 2023)
- **34 mil+ avaliações** institucionais
- Fonte: [INEP/MEC](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/indicadores-de-qualidade-da-educacao-superior) (dados públicos)

## Estrutura

```
openenade/
  etl/          Pipeline Python/Polars (XLSX -> JSON)
  web/          Frontend React 19 + Vite + TypeScript
```

### ETL (`etl/`)

Pipeline ETL que processa os XLSX do INEP e gera JSON estático por curso/ano.

```bash
cd etl
uv sync --dev
uv run pytest -v                    # 20 testes
uv run python -m src.pipeline \
  data/raw/conceito_enade_2023.xlsx \
  data/output
```

**Etapas:** ingest (XLSX) -> transform (normalização de colunas) -> normalize (rede, modalidade, texto) -> rank (posição nacional) -> export (JSON por curso).

**Por que ETL e não ELT:** os dados do INEP têm inconsistências entre anos (nomes de colunas, separadores decimais, nomes de planilhas). Transformamos antes de disponibilizar para garantir dados limpos desde o primeiro acesso.

### Web (`web/`)

SPA estática que consome os JSON gerados pelo ETL.

```bash
cd web
npm install
npm run dev                          # http://localhost:5173
npm run build                        # dist/
npm run lint
```

**Stack:** React 19, Vite 7, TypeScript 5.9, Tailwind 4, i18next (PT/EN), Recharts, [@joivo/design-system](https://github.com/joivo/design-system).

**Páginas:**
- `/` - Busca de cursos + ranking com filtros (UF, rede, faixa) + comparação entre IES
- `/comparar` - Comparação lado a lado com métricas e gráfico de evolução
- `/sobre` - Projeto, história, time
- `/metodologia` - Ciclo avaliativo, pipeline de dados, links para datasets originais

## CI

GitHub Actions (`ci.yml`) roda em push/PR para `main`:

| Job | O que faz |
|-----|-----------|
| ETL Tests | `uv sync --dev && uv run pytest -v` |
| Web Build | `npm ci && npm run build` (tsc + vite) |
| Web Lint | `npm ci && npm run lint` (eslint) |
| i18n Parity | Verifica que `pt.json` e `en.json` têm as mesmas chaves |

## Deploy

Cloudflare Pages com `wrangler.jsonc`:

```bash
cd web
npm run build
npx wrangler pages deploy dist/ --project-name openenade
```

Configuração SPA: `not_found_handling: "single-page-application"` redireciona rotas desconhecidas para `index.html`, onde o React Router renderiza a página 404 ou a rota correta.

## Origem

Projeto final da disciplina de Engenharia de Software, Ciência da Computação, UFCG (2019). Originalmente chamado RUE (Ranking Universitário Enade). Ressuscitado em abril de 2026 por [@joivo](https://github.com/joivo) com arquitetura nova.

## Licença

Código: [MIT](LICENSE). Dados: INEP/MEC (domínio público).
