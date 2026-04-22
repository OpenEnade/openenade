import json
from pathlib import Path

import openpyxl

from src.pipeline import run


def _create_test_xlsx(tmp_path: Path) -> Path:
    """Create a minimal but realistic XLSX for pipeline integration tests."""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "PLANILHA_ENADE"
    ws.append([
        "Ano", "Código da Área", "Área de Avaliação", "Grau Acadêmico",
        "Código da IES", "Nome da IES*", "Sigla da IES*",
        "Organização Acadêmica", "Categoria Administrativa",
        "Código do Curso", "Modalidade de Ensino",
        "Código do Município**", "Município do Curso**", "Sigla da UF** ",
        "Nº de Concluintes Inscritos", "Nº  de Concluintes Participantes",
        "Nota Bruta - FG", "Nota Padronizada - FG",
        "Nota Bruta - CE", "Nota Padronizada - CE",
        "Conceito Enade (Contínuo)", "Conceito Enade (Faixa)",
        "Entidade Beneficiente de Assistência Social (CEBAS)",
    ])
    ws.append([
        2023, 23, "MEDICINA", "Bacharelado",
        1, "UNIVERSIDADE FEDERAL DE MATO GROSSO", "UFMT",
        "Universidade", "Pública Federal",
        37, "Educação Presencial",
        5103403, "Cuiabá", "MT",
        23, 20,
        42.815, 2.7573,
        57.8, 3.1363,
        3.0415, "4",
        "-",
    ])
    ws.append([
        2023, 23, "MEDICINA", "Bacharelado",
        2, "UNIVERSIDADE DE SAO PAULO", "USP",
        "Universidade", "Privada com fins lucrativos",
        38, "Educação Presencial",
        3550308, "São Paulo", "SP",
        200, 150,
        55.0, 3.5,
        60.0, 4.0,
        4.5, "5",
        "-",
    ])
    # SC row (should be filtered out)
    ws.append([
        2023, 23, "MEDICINA", "Bacharelado",
        3, "FACULDADE SEM CONCEITO", "FSC",
        "Faculdade", "Privada com fins lucrativos",
        39, "Educação Presencial",
        1234567, "Nowhere", "XX",
        5, 3,
        0.0, 0.0,
        0.0, 0.0,
        0.0, "SC",
        "-",
    ])

    xlsx_path = tmp_path / "conceito_enade_2023.xlsx"
    wb.save(xlsx_path)
    return xlsx_path


def test_pipeline_end_to_end(tmp_path: Path):
    """Full pipeline: XLSX with 3 rows (2 valid + 1 SC) produces correct JSON."""
    xlsx_path = _create_test_xlsx(tmp_path)
    output_dir = tmp_path / "output"

    run(xlsx_path, output_dir)

    # Course JSON should exist
    course_file = output_dir / "medicina-2023.json"
    assert course_file.exists()

    data = json.loads(course_file.read_text())
    assert data["curso"] == "MEDICINA"
    assert data["ano"] == 2023
    assert data["total"] == 2  # SC row filtered out
    assert len(data["avaliacoes"]) == 2


def test_pipeline_ranking_order(tmp_path: Path):
    """Pipeline output should be ranked by enade_continuo descending."""
    xlsx_path = _create_test_xlsx(tmp_path)
    output_dir = tmp_path / "output"

    run(xlsx_path, output_dir)

    data = json.loads((output_dir / "medicina-2023.json").read_text())
    avaliacoes = data["avaliacoes"]

    # USP (4.5) should be #1, UFMT (3.0415) should be #2
    assert avaliacoes[0]["posicao"] == 1
    assert avaliacoes[0]["ies"] == "USP"
    assert avaliacoes[0]["enade_continuo"] == 4.5

    assert avaliacoes[1]["posicao"] == 2
    assert avaliacoes[1]["ies"] == "UFMT"


def test_pipeline_sc_filtered(tmp_path: Path):
    """SC (Sem Conceito) rows must not appear in output."""
    xlsx_path = _create_test_xlsx(tmp_path)
    output_dir = tmp_path / "output"

    run(xlsx_path, output_dir)

    data = json.loads((output_dir / "medicina-2023.json").read_text())
    siglas = [a["ies"] for a in data["avaliacoes"]]
    assert "FSC" not in siglas


def test_pipeline_rede_mapping(tmp_path: Path):
    """Pública Federal -> PUBLICA, Privada -> PRIVADA."""
    xlsx_path = _create_test_xlsx(tmp_path)
    output_dir = tmp_path / "output"

    run(xlsx_path, output_dir)

    data = json.loads((output_dir / "medicina-2023.json").read_text())
    by_ies = {a["ies"]: a for a in data["avaliacoes"]}

    assert by_ies["UFMT"]["rede"] == "PUBLICA"
    assert by_ies["USP"]["rede"] == "PRIVADA"


def test_pipeline_courses_index(tmp_path: Path):
    """courses.json should list the processed course."""
    xlsx_path = _create_test_xlsx(tmp_path)
    output_dir = tmp_path / "output"

    run(xlsx_path, output_dir)

    index = json.loads((output_dir / "courses.json").read_text())
    assert len(index) == 1
    assert index[0]["slug"] == "medicina"
    assert index[0]["total"] == 2


def test_pipeline_output_schema(tmp_path: Path):
    """Each avaliacao in output must have all required fields."""
    xlsx_path = _create_test_xlsx(tmp_path)
    output_dir = tmp_path / "output"

    run(xlsx_path, output_dir)

    data = json.loads((output_dir / "medicina-2023.json").read_text())
    required = {
        "posicao", "ies", "ies_nome", "uf", "municipio", "rede",
        "grau", "modalidade", "concluintes_participantes",
        "nota_fg", "nota_ce", "enade_continuo", "conceito_enade",
    }
    for avaliacao in data["avaliacoes"]:
        assert set(avaliacao.keys()) == required
