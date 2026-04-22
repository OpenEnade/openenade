"""Orchestrate the full ETL pipeline: ingest -> transform -> normalize -> rank -> export."""

from pathlib import Path

from src.export import export_course_json, export_courses_index
from src.ingest import read_enade_xlsx
from src.normalize import normalize
from src.rank import compute_rankings
from src.transform import transform


def run(input_path: Path, output_dir: Path) -> None:
    """Run the full ETL pipeline on a single XLSX file."""
    print(f"[ingest] Reading {input_path.name}...")
    raw_df = read_enade_xlsx(input_path)
    print(f"  {len(raw_df)} rows loaded")

    print("[transform] Normalizing columns...")
    transformed_df = transform(raw_df)
    print(f"  {len(transformed_df)} rows, {len(transformed_df.columns)} columns")

    print("[normalize] Applying domain rules...")
    normalized_df = normalize(transformed_df)
    print(f"  {len(normalized_df)} rows after filtering SC")

    print("[rank] Computing rankings...")
    ranked_df = compute_rankings(normalized_df)

    courses = ranked_df["curso"].unique().to_list()
    years = ranked_df["ano"].unique().to_list()

    print(f"[export] Writing {len(courses)} course files to {output_dir}...")
    for curso in courses:
        for ano in years:
            export_course_json(ranked_df, curso, ano, output_dir)

    export_courses_index(ranked_df, output_dir)
    print("[done]")


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python -m src.pipeline <input.xlsx> [output_dir]")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("data/output")
    run(input_path, output_dir)
