import polars as pl

from src.transform import transform


def test_transform_strips_asterisks_from_column_names(sample_raw_df: pl.DataFrame):
    """Column names like 'Nome da IES*' should become 'nome_da_ies'."""
    result = transform(sample_raw_df)
    assert "nome_da_ies" in result.columns
    assert "sigla_da_ies" in result.columns
    assert "Nome da IES*" not in result.columns


def test_transform_strips_double_asterisks_and_spaces(sample_raw_df: pl.DataFrame):
    """'Sigla da UF** ' should become 'sigla_da_uf'."""
    result = transform(sample_raw_df)
    assert "sigla_da_uf" in result.columns


def test_transform_selects_required_columns(sample_raw_df: pl.DataFrame):
    """Output should contain only the columns needed for the pipeline."""
    result = transform(sample_raw_df)
    expected_cols = {
        "ano",
        "area_de_avaliacao",
        "grau_academico",
        "nome_da_ies",
        "sigla_da_ies",
        "categoria_administrativa",
        "modalidade_de_ensino",
        "municipio_do_curso",
        "sigla_da_uf",
        "concluintes_participantes",
        "nota_bruta_fg",
        "nota_bruta_ce",
        "enade_continuo",
        "conceito_enade",
    }
    assert set(result.columns) == expected_cols


def test_transform_renames_score_columns(sample_raw_df: pl.DataFrame):
    """'Conceito Enade (Contínuo)' -> 'enade_continuo', etc."""
    result = transform(sample_raw_df)
    assert "enade_continuo" in result.columns
    assert "conceito_enade" in result.columns
    assert "nota_bruta_fg" in result.columns
    assert "nota_bruta_ce" in result.columns


def test_transform_handles_comma_decimals():
    """2022 data uses comma as decimal separator in some columns."""
    df = pl.DataFrame(
        {
            "Ano": [2022],
            "Área de Avaliação": ["DIREITO"],
            "Grau Acadêmico": ["Bacharelado"],
            "Nome da IES*": ["TEST"],
            "Sigla da IES*": ["TST"],
            "Categoria Administrativa": ["Pública Federal"],
            "Modalidade de Ensino": ["Educação Presencial"],
            "Município do Curso**": ["Brasília"],
            "Sigla da UF** ": ["DF"],
            "Nº  de Concluintes Participantes": [10],
            "Nota Bruta - FG": ["76,33"],
            "Nota Bruta - CE": [59.004],
            "Conceito Enade (Contínuo)": [4.788],
            "Conceito Enade (Faixa)": ["5"],
            "Código da Área": [2],
            "Código da IES": [1],
            "Organização Acadêmica": ["Universidade"],
            "Código do Curso": [1],
            "Nº de Concluintes Inscritos": [91],
            "Nota Padronizada - FG": ["4,686"],
            "Nota Padronizada - CE": ["4,823"],
            "Entidade Beneficiente de Assistência Social (CEBAS)": ["-"],
        }
    )
    result = transform(df)
    fg_val = result["nota_bruta_fg"][0]
    assert isinstance(fg_val, float)
    assert abs(fg_val - 76.33) < 0.01
