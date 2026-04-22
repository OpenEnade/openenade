"""Compute national rankings within (ano, curso) groups."""

import polars as pl


def compute_rankings(df: pl.DataFrame) -> pl.DataFrame:
    """Add a 'posicao' column: national rank within each (ano, curso) group.

    Ranked by descending enade_continuo, then nota_ce, then nota_fg.
    """
    return (
        df.sort(
            ["ano", "curso", "enade_continuo", "nota_ce", "nota_fg"],
            descending=[False, False, True, True, True],
        )
        .with_columns(
            pl.col("enade_continuo")
            .rank(method="ordinal", descending=True)
            .over("ano", "curso")
            .alias("posicao")
            .cast(pl.Int64)
        )
    )
