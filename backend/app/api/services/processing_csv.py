import os
import json
import polars as pl
import logging
from datetime import datetime

logger = logging.getLogger("Process Csv Service")
# old code
async def process_csv_file(file_path: str) -> str:
    try:
        logger.info(f"Starting CSV processing for file: {file_path}")

        df = pl.scan_csv(
            file_path,
            schema_overrides={
                "credit_score": pl.Int64,
                "credit_limit": pl.Int64,
                "is_active": pl.Boolean,
            },
            infer_schema_length=20000
        )

        logger.info("Applying classifications")

        classified_df = df.with_columns([
            pl.col("credit_score").fill_null(0),
            pl.col("credit_limit").fill_null(0),
            pl.col("estimated_revenue").fill_null(0),
            pl.col("is_active").fill_null(False),

            # Credit Score Classification
            pl.when(pl.col("credit_score") >= 85).then(pl.lit("A"))
            .when(pl.col("credit_score").is_between(50, 85)).then(pl.lit("B"))
            .when(pl.col("credit_score").is_between(35, 50)).then(pl.lit("C"))
            .when(pl.col("credit_score").is_between(0, 35)).then(pl.lit("D"))
            .otherwise(pl.lit("E")).alias("credit_score_type"),

            # Credit Limit Classification
            pl.when(pl.col("credit_limit") >= 250000).then(pl.lit("A"))
            .when(pl.col("credit_limit").is_between(100000, 250000)).then(pl.lit("B"))
            .when(pl.col("credit_limit").is_between(50000, 100000)).then(pl.lit("C"))
            .when(pl.col("credit_limit") < 50000).then(pl.lit("D"))
            .otherwise(pl.lit("E")).alias("credit_limit_type"),

            # Turnover Classification
            pl.when(pl.col("estimated_revenue") >= 100000).then(pl.lit("A"))
            .when(pl.col("estimated_revenue").is_between(50000, 100000)).then(pl.lit("B"))
            .when(pl.col("estimated_revenue").is_between(0, 50000)).then(pl.lit("C"))
            .otherwise(pl.lit("D")).alias("turnover_type"),

            # Active/Inactive Status
            pl.when(pl.col("is_active") == True).then(pl.lit("Active"))
            .otherwise(pl.lit("Inactive")).alias("status")
        ])

        classified_df = classified_df.collect()

        logger.info("Calculating country statistics...")
        country_stats = (
            classified_df
            .group_by("country_code")
            .agg([
                pl.count().alias("total_companies"),
                pl.col("is_active").sum().cast(pl.Int64).alias("active_companies"),
            ])
            .with_columns([
                (pl.col("total_companies") - pl.col("active_companies")).alias("inactive_companies")
            ])
            .to_dicts()
        )

        company_data = (
            classified_df
            .select([
                pl.col("cs_company_id").alias("safeNumber"),
                "matched_name",
                "credit_score_type",
                "credit_limit_type",
                "turnover_type",
                "status",
                "country_code",
                "sector"
            ])
            .to_dicts()
        )

        type_stats = (
            classified_df
            .group_by([
                "credit_score_type",
                "credit_limit_type",
                "turnover_type"
            ])
            .agg([pl.count().alias("count")])
            .to_dicts()
        )

        current_timestamp = datetime.now().isoformat()

        output = {
            "company_data": company_data,
            "country_stats": country_stats,
            "type_distributions": type_stats,
            "metadata": {
                "total_companies": len(company_data),
                "total_countries": len(country_stats),
                "processing_timestamp": current_timestamp  
            }
        }

        output_file = "app/output/processed_data.json"
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        logger.info(f"Writing output to {output_file}...")
        with open(output_file, "w") as f:
            json.dump(output, f, indent=4)

        return output_file

    except Exception as e:
        logger.error(f"Error in process_csv_file: {str(e)}")
        raise

# new code
def classify_credit_score(score):
    if score is None:
        return "Unknown"
    if score >= 85:
        return "A"
    elif 50 <= score < 85:
        return "B"
    elif 35 <= score < 50:
        return "C"
    elif score < 35:
        return "D"
    return "E"

def classify_credit_limit(limit):
    if limit is None:
        return "Unknown"
    if limit >= 250000:
        return "A"
    elif 100000 <= limit < 250000:
        return "B"
    elif 50000 <= limit < 100000:
        return "C"
    elif limit >= 0:
        return "D"
    return "E"

def classify_turnover(revenue):
    if revenue is None:
        return "Unknown"
    if revenue >= 100000:
        return "A"
    elif 50000 <= revenue < 100000:
        return "B"
    elif revenue < 50000:
        return "C"
    return "D"

def classify_status(is_active):
    return "Active" if is_active else "Inactive"

async def process_csv_file_v2(file_path: str) -> dict:
    logger.info(f"Processing CSV file: {file_path}")

    df = pl.scan_csv(file_path)

    classified_df = df.with_columns([
        pl.col("credit_score").fill_null(0).map_elements(classify_credit_score, return_dtype=pl.Utf8).alias("credit_score_type"),
        pl.col("credit_limit").fill_null(0).map_elements(classify_credit_limit, return_dtype=pl.Utf8).alias("credit_limit_type"),
        pl.col("estimated_revenue").fill_null(0).map_elements(classify_turnover, return_dtype=pl.Utf8).alias("turnover_type"),
        pl.col("is_active").fill_null(False).map_elements(classify_status, return_dtype=pl.Utf8).alias("status")
    ])

    country_stats = classified_df.group_by("country_code").agg([
                pl.count().alias("Total Companies"),
                pl.col("status").filter(pl.col("status") == "Active").count().alias("Active Companies"),
                pl.col("status").filter(pl.col("status") == "Inactive").count().alias("Inactive Companies"),
            ])

    company_data = classified_df.select([
        pl.col("cs_company_id").alias("safeNumber"),
        "matched_name",
        "credit_score_type",
        "credit_limit_type",
        "turnover_type",
        "status",
        "country_code",
        "sector"
    ])

    return {
        "company_data": company_data.collect().to_dicts(),
        "country_stats": country_stats.collect().to_dicts()
    }
