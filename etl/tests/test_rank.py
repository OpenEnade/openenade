import polars as pl

from src.rank import compute_rankings


def test_rank_assigns_position_by_enade_continuo():
    df = pl.DataFrame(
        {
            "ano": [2023, 2023, 2023],
            "curso": ["MEDICINA", "MEDICINA", "MEDICINA"],
            "ies": ["C", "A", "B"],
            "enade_continuo": [2.0, 4.5, 3.0],
            "nota_ce": [30.0, 50.0, 40.0],
            "nota_fg": [25.0, 45.0, 35.0],
        }
    )
    result = compute_rankings(df)
    assert "posicao" in result.columns
    ranked = result.sort("posicao")
    assert ranked["ies"][0] == "A"
    assert ranked["ies"][1] == "B"
    assert ranked["ies"][2] == "C"


def test_rank_breaks_ties_by_nota_ce_then_nota_fg():
    df = pl.DataFrame(
        {
            "ano": [2023, 2023],
            "curso": ["MEDICINA", "MEDICINA"],
            "ies": ["LOSER", "WINNER"],
            "enade_continuo": [3.5, 3.5],
            "nota_ce": [40.0, 50.0],
            "nota_fg": [30.0, 30.0],
        }
    )
    result = compute_rankings(df)
    ranked = result.sort("posicao")
    assert ranked["ies"][0] == "WINNER"
    assert ranked["ies"][1] == "LOSER"


def test_rank_is_independent_per_curso():
    df = pl.DataFrame(
        {
            "ano": [2023, 2023, 2023, 2023],
            "curso": ["MEDICINA", "MEDICINA", "DIREITO", "DIREITO"],
            "ies": ["A", "B", "C", "D"],
            "enade_continuo": [4.0, 3.0, 2.0, 5.0],
            "nota_ce": [50.0, 40.0, 30.0, 60.0],
            "nota_fg": [45.0, 35.0, 25.0, 55.0],
        }
    )
    result = compute_rankings(df)
    med = result.filter(pl.col("curso") == "MEDICINA").sort("posicao")
    assert med["ies"][0] == "A"
    assert med["posicao"][0] == 1
    dir_ = result.filter(pl.col("curso") == "DIREITO").sort("posicao")
    assert dir_["ies"][0] == "D"
    assert dir_["posicao"][0] == 1
