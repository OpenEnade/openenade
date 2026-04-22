import json
from pathlib import Path

import polars as pl

from src.export import export_course_json, export_courses_index


def _make_ranked_df() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "ano": [2023, 2023],
            "curso": ["MEDICINA", "MEDICINA"],
            "grau": ["Bacharelado", "Bacharelado"],
            "ies": ["FAMERP", "USP"],
            "ies_nome": ["FAC MED SJR PRETO", "UNIV SAO PAULO"],
            "rede": ["PUBLICA", "PUBLICA"],
            "modalidade": ["Presencial", "Presencial"],
            "municipio": ["SAO JOSE DO RIO PRETO", "SAO PAULO"],
            "uf": ["SP", "SP"],
            "concluintes_participantes": [20, 150],
            "nota_fg": [50.55, 55.0],
            "nota_ce": [42.75, 60.0],
            "enade_continuo": [4.9703, 4.5],
            "conceito_enade": [5, 5],
            "posicao": [1, 2],
        }
    )


def test_export_course_json_creates_file(tmp_path: Path):
    df = _make_ranked_df()
    export_course_json(df, "MEDICINA", 2023, tmp_path)

    output = tmp_path / "medicina-2023.json"
    assert output.exists()

    data = json.loads(output.read_text())
    assert data["curso"] == "MEDICINA"
    assert data["ano"] == 2023
    assert data["total"] == 2
    assert len(data["avaliacoes"]) == 2
    assert data["avaliacoes"][0]["posicao"] == 1
    assert data["avaliacoes"][0]["ies"] == "FAMERP"


def test_export_course_json_schema(tmp_path: Path):
    df = _make_ranked_df()
    export_course_json(df, "MEDICINA", 2023, tmp_path)

    data = json.loads((tmp_path / "medicina-2023.json").read_text())
    avaliacao = data["avaliacoes"][0]

    required_keys = {
        "posicao",
        "ies",
        "ies_nome",
        "uf",
        "municipio",
        "rede",
        "grau",
        "modalidade",
        "concluintes_participantes",
        "nota_fg",
        "nota_ce",
        "enade_continuo",
        "conceito_enade",
    }
    assert set(avaliacao.keys()) == required_keys


def test_export_courses_index(tmp_path: Path):
    df = _make_ranked_df()
    export_courses_index(df, tmp_path)

    index = json.loads((tmp_path / "courses.json").read_text())
    assert len(index) == 1
    assert index[0]["slug"] == "medicina"
    assert index[0]["nome"] == "MEDICINA"
    assert index[0]["ano"] == 2023
    assert index[0]["total"] == 2
