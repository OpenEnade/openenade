"""Normalize ENADE data: domain-specific mapping rules."""

import unicodedata

import polars as pl

_PUBLIC_CATEGORIES = {
    "Pública Federal",
    "Pública Estadual",
    "Pública Municipal",
    "Especial",
    "Federal",
    "Estadual",
    "Municipal",
    "Pessoa Jurídica de Direito Público - Federal",
    "Pessoa Jurídica de Direito Público - Estadual",
    "Pessoa Jurídica de Direito Público - Municipal",
}

_MODALIDADE_MAP = {
    "Educação Presencial": "Presencial",
    "Educação a Distância": "A Distancia",
}


def _to_ascii(text: str) -> str:
    """Transliterate to ASCII (remove accents)."""
    nfkd = unicodedata.normalize("NFKD", text)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def normalize(df: pl.DataFrame) -> pl.DataFrame:
    """Apply domain normalization rules to transformed ENADE data."""
    # Filter out SC rows
    df = df.filter(pl.col("conceito_enade") != "SC")
    df = df.filter(pl.col("conceito_enade") != "")

    # Map rede
    df = df.with_columns(
        pl.col("categoria_administrativa")
        .map_elements(
            lambda x: "PUBLICA" if x in _PUBLIC_CATEGORIES else "PRIVADA",
            return_dtype=pl.Utf8,
        )
        .alias("rede")
    )

    # Map modalidade
    df = df.with_columns(
        pl.col("modalidade_de_ensino")
        .map_elements(
            lambda x: _MODALIDADE_MAP.get(x, x),
            return_dtype=pl.Utf8,
        )
        .alias("modalidade")
    )

    # Uppercase + ASCII transliterate text fields
    text_fields = [
        "nome_da_ies",
        "sigla_da_ies",
        "municipio_do_curso",
        "area_de_avaliacao",
    ]
    for field in text_fields:
        if field in df.columns:
            df = df.with_columns(
                pl.col(field)
                .map_elements(
                    lambda x: _to_ascii(str(x).upper().strip()) if x else "",
                    return_dtype=pl.Utf8,
                )
                .alias(field)
            )

    # Cast conceito_enade to integer
    df = df.with_columns(pl.col("conceito_enade").cast(pl.Int64).alias("conceito_enade"))

    # Add grau column with default if missing (pre-2021 data)
    if "grau_academico" not in df.columns:
        df = df.with_columns(pl.lit("Bacharelado").alias("grau_academico"))

    # Rename to final output names
    rename_map = {
        "area_de_avaliacao": "curso",
        "grau_academico": "grau",
        "sigla_da_ies": "ies",
        "nome_da_ies": "ies_nome",
        "sigla_da_uf": "uf",
        "municipio_do_curso": "municipio",
        "nota_bruta_fg": "nota_fg",
        "nota_bruta_ce": "nota_ce",
    }
    df = df.rename({k: v for k, v in rename_map.items() if k in df.columns})

    # Select final columns in order
    output_columns = [
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
    ]
    df = df.select([c for c in output_columns if c in df.columns])

    return df
