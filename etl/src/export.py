"""Export processed ENADE data to JSON files."""

import json
import re
from pathlib import Path

import polars as pl


def _slugify(text: str) -> str:
    """Convert course name to URL-safe slug."""
    slug = text.lower().strip()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")
    return slug


def export_course_json(
    df: pl.DataFrame, curso: str, ano: int, output_dir: Path
) -> None:
    """Write a single course JSON file."""
    course_df = df.filter((pl.col("curso") == curso) & (pl.col("ano") == ano))
    course_df = course_df.sort("posicao")

    avaliacoes = []
    for row in course_df.iter_rows(named=True):
        avaliacoes.append(
            {
                "posicao": row["posicao"],
                "ies": row["ies"],
                "ies_nome": row["ies_nome"],
                "uf": row["uf"],
                "municipio": row["municipio"],
                "rede": row["rede"],
                "grau": row["grau"],
                "modalidade": row["modalidade"],
                "concluintes_participantes": row["concluintes_participantes"],
                "nota_fg": row["nota_fg"],
                "nota_ce": row["nota_ce"],
                "enade_continuo": row["enade_continuo"],
                "conceito_enade": row["conceito_enade"],
            }
        )

    output = {
        "curso": curso,
        "ano": ano,
        "total": len(avaliacoes),
        "avaliacoes": avaliacoes,
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    slug = _slugify(curso)
    filepath = output_dir / f"{slug}-{ano}.json"
    filepath.write_text(json.dumps(output, ensure_ascii=False, indent=2))


def export_courses_index(df: pl.DataFrame, output_dir: Path) -> None:
    """Write courses.json search index with one entry per unique (curso, ano)."""
    groups = df.group_by("curso", "ano").agg(pl.len().alias("total"))
    groups = groups.sort("curso")

    index = []
    for row in groups.iter_rows(named=True):
        index.append(
            {
                "slug": _slugify(row["curso"]),
                "nome": row["curso"],
                "ano": row["ano"],
                "total": row["total"],
            }
        )

    output_dir.mkdir(parents=True, exist_ok=True)
    filepath = output_dir / "courses.json"
    filepath.write_text(json.dumps(index, ensure_ascii=False, indent=2))
