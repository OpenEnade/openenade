import polars as pl
import pytest


@pytest.fixture
def sample_raw_row() -> dict:
    """A single raw row as it comes from the XLSX, with 2021+ column names."""
    return {
        "Ano": 2023,
        "Código da Área": 23,
        "Área de Avaliação": "MEDICINA",
        "Grau Acadêmico": "Bacharelado",
        "Código da IES": 1,
        "Nome da IES*": "UNIVERSIDADE FEDERAL DE MATO GROSSO",
        "Sigla da IES*": "UFMT",
        "Organização Acadêmica": "Universidade",
        "Categoria Administrativa": "Pública Federal",
        "Código do Curso": 37,
        "Modalidade de Ensino": "Educação Presencial",
        "Código do Município**": 5103403,
        "Município do Curso**": "Cuiabá",
        "Sigla da UF** ": "MT",
        "Nº de Concluintes Inscritos": 23,
        "Nº  de Concluintes Participantes": 20,
        "Nota Bruta - FG": 42.815,
        "Nota Padronizada - FG": 2.7573,
        "Nota Bruta - CE": 57.8,
        "Nota Padronizada - CE": 3.1363,
        "Conceito Enade (Contínuo)": 3.0415,
        "Conceito Enade (Faixa)": "4",
        "Entidade Beneficiente de Assistência Social (CEBAS)": "-",
    }


@pytest.fixture
def sample_raw_df(sample_raw_row: dict) -> pl.DataFrame:
    """A DataFrame with a few raw rows for testing."""
    rows = [sample_raw_row]

    row2 = sample_raw_row.copy()
    row2["Sigla da IES*"] = "USP"
    row2["Nome da IES*"] = "UNIVERSIDADE DE SAO PAULO"
    row2["Conceito Enade (Contínuo)"] = 4.5
    row2["Conceito Enade (Faixa)"] = "5"
    row2["Nota Bruta - FG"] = 55.0
    row2["Nota Bruta - CE"] = 60.0
    rows.append(row2)

    row3 = sample_raw_row.copy()
    row3["Conceito Enade (Faixa)"] = "SC"
    rows.append(row3)

    return pl.DataFrame(rows)


@pytest.fixture
def sample_transformed_df() -> pl.DataFrame:
    """A DataFrame after transform step (clean column names, selected columns)."""
    return pl.DataFrame(
        {
            "ano": [2023, 2023],
            "area_de_avaliacao": ["MEDICINA", "MEDICINA"],
            "grau_academico": ["Bacharelado", "Bacharelado"],
            "nome_da_ies": [
                "UNIVERSIDADE FEDERAL DE MATO GROSSO",
                "UNIVERSIDADE DE SAO PAULO",
            ],
            "sigla_da_ies": ["UFMT", "USP"],
            "categoria_administrativa": ["Pública Federal", "Pública Federal"],
            "modalidade_de_ensino": ["Educação Presencial", "Educação Presencial"],
            "municipio_do_curso": ["Cuiabá", "São Paulo"],
            "sigla_da_uf": ["MT", "SP"],
            "concluintes_participantes": [20, 150],
            "nota_bruta_fg": [42.815, 55.0],
            "nota_bruta_ce": [57.8, 60.0],
            "enade_continuo": [3.0415, 4.5],
            "conceito_enade": ["4", "5"],
        }
    )
