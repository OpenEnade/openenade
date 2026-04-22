"""Transform raw ENADE data: normalize column names, select and rename columns."""

import re

import polars as pl


def _clean_column_name(name: str) -> str:
    """Convert raw INEP column name to snake_case.

    Strips asterisks, trailing spaces, special chars, and converts to lowercase.
    """
    name = name.strip()
    name = name.replace("*", "")
    name = re.sub(r"[ºª]+", "", name)
    name = name.lower()
    name = re.sub(r"[^a-z0-9áàâãéêíóôõúüç]+", "_", name)
    name = re.sub(r"_+", "_", name)
    name = name.strip("_")
    return name


def _fix_comma_decimal(series: pl.Series) -> pl.Series:
    """Convert string values with comma decimal separators to float."""
    return series.cast(pl.Utf8).str.replace(",", ".").cast(pl.Float64)


# Mapping from cleaned column names to output column names
_COLUMN_MAP = {
    "ano": "ano",
    "área_de_avaliação": "area_de_avaliacao",
    "grau_acadêmico": "grau_academico",
    "nome_da_ies": "nome_da_ies",
    "sigla_da_ies": "sigla_da_ies",
    "categoria_administrativa": "categoria_administrativa",
    "modalidade_de_ensino": "modalidade_de_ensino",
    "município_do_curso": "municipio_do_curso",
    "sigla_da_uf": "sigla_da_uf",
    "n_de_concluintes_participantes": "concluintes_participantes",
    "nota_bruta_fg": "nota_bruta_fg",
    "nota_bruta_ce": "nota_bruta_ce",
    "conceito_enade_contínuo": "enade_continuo",
    "conceito_enade_faixa": "conceito_enade",
}

# Columns that must be numeric (may have comma decimals in some years)
_NUMERIC_COLUMNS = {"nota_bruta_fg", "nota_bruta_ce", "enade_continuo"}


def transform(df: pl.DataFrame) -> pl.DataFrame:
    """Transform raw DataFrame: clean column names, select and rename columns.

    Handles comma decimal separators and rounds scores to 4 decimal places.
    """
    # Clean all column names
    clean_names = {old: _clean_column_name(old) for old in df.columns}
    df = df.rename(clean_names)

    # Select only the columns we need (using the cleaned names)
    available = set(df.columns)
    select_cols = {}
    for clean_name, output_name in _COLUMN_MAP.items():
        if clean_name in available:
            select_cols[clean_name] = output_name

    df = df.select(list(select_cols.keys()))
    df = df.rename(select_cols)

    # Fix comma decimals and ensure numeric types for score columns
    for col in _NUMERIC_COLUMNS:
        if col in df.columns:
            col_dtype = df[col].dtype
            if col_dtype == pl.Utf8 or col_dtype == pl.String:
                df = df.with_columns(_fix_comma_decimal(df[col]).alias(col))
            elif col_dtype != pl.Float64:
                df = df.with_columns(df[col].cast(pl.Float64).alias(col))

    # Round scores to 4 decimal places
    for col in _NUMERIC_COLUMNS:
        if col in df.columns:
            df = df.with_columns(df[col].round(4).alias(col))

    return df
