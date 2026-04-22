import polars as pl

from src.normalize import normalize


def test_normalize_maps_rede(sample_transformed_df: pl.DataFrame):
    """'Pública Federal' -> 'PUBLICA'."""
    result = normalize(sample_transformed_df)
    assert "rede" in result.columns
    assert result["rede"][0] == "PUBLICA"


def test_normalize_maps_privada():
    df = pl.DataFrame(
        {
            "ano": [2023],
            "area_de_avaliacao": ["MEDICINA"],
            "grau_academico": ["Bacharelado"],
            "nome_da_ies": ["INST PRIVADA"],
            "sigla_da_ies": ["IP"],
            "categoria_administrativa": ["Privada com fins lucrativos"],
            "modalidade_de_ensino": ["Educação Presencial"],
            "municipio_do_curso": ["São Paulo"],
            "sigla_da_uf": ["SP"],
            "concluintes_participantes": [10],
            "nota_bruta_fg": [40.0],
            "nota_bruta_ce": [35.0],
            "enade_continuo": [2.5],
            "conceito_enade": ["3"],
        }
    )
    result = normalize(df)
    assert result["rede"][0] == "PRIVADA"


def test_normalize_maps_modalidade(sample_transformed_df: pl.DataFrame):
    """'Educação Presencial' -> 'Presencial'."""
    result = normalize(sample_transformed_df)
    assert "modalidade" in result.columns
    assert result["modalidade"][0] == "Presencial"


def test_normalize_uppercases_text_fields(sample_transformed_df: pl.DataFrame):
    result = normalize(sample_transformed_df)
    assert result["ies_nome"][0] == result["ies_nome"][0].upper()
    assert result["municipio"][0] == result["municipio"][0].upper()


def test_normalize_filters_sc_rows(sample_transformed_df: pl.DataFrame):
    df_with_sc = sample_transformed_df.vstack(
        pl.DataFrame(
            {
                "ano": [2023],
                "area_de_avaliacao": ["MEDICINA"],
                "grau_academico": ["Bacharelado"],
                "nome_da_ies": ["REMOVED"],
                "sigla_da_ies": ["RMV"],
                "categoria_administrativa": ["Pública Federal"],
                "modalidade_de_ensino": ["Educação Presencial"],
                "municipio_do_curso": ["Nowhere"],
                "sigla_da_uf": ["XX"],
                "concluintes_participantes": [5],
                "nota_bruta_fg": [0.0],
                "nota_bruta_ce": [0.0],
                "enade_continuo": [0.0],
                "conceito_enade": ["SC"],
            }
        )
    )
    result = normalize(df_with_sc)
    assert len(result) == len(sample_transformed_df)
    assert "RMV" not in result["ies"].to_list()


def test_normalize_adds_default_grau_when_missing():
    """Pre-2021 data has no grau_academico column. Should default to 'Bacharelado'."""
    df = pl.DataFrame(
        {
            "ano": [2019],
            "area_de_avaliacao": ["MEDICINA"],
            "nome_da_ies": ["UFCG"],
            "sigla_da_ies": ["UFCG"],
            "categoria_administrativa": ["Pública Federal"],
            "modalidade_de_ensino": ["Educação Presencial"],
            "municipio_do_curso": ["Campina Grande"],
            "sigla_da_uf": ["PB"],
            "concluintes_participantes": [30],
            "nota_bruta_fg": [45.0],
            "nota_bruta_ce": [50.0],
            "enade_continuo": [3.8],
            "conceito_enade": ["4"],
        }
    )
    result = normalize(df)
    assert "grau" in result.columns
    assert result["grau"][0] == "Bacharelado"


def test_normalize_renames_output_columns(sample_transformed_df: pl.DataFrame):
    result = normalize(sample_transformed_df)
    expected = {
        "ano",
        "curso",
        "grau",
        "ies",
        "ies_nome",
        "rede",
        "modalidade",
        "municipio",
        "uf",
        "concluintes_participantes",
        "nota_fg",
        "nota_ce",
        "enade_continuo",
        "conceito_enade",
    }
    assert set(result.columns) == expected
