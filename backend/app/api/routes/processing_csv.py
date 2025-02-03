import os
import json
from fastapi import HTTPException, APIRouter
from fastapi.responses import JSONResponse
import logging
from ..services.processing_csv import process_csv_file, process_csv_file_v2

logger = logging.getLogger("Process Csv Routes")

router = APIRouter()

@router.get("/process_csv")
async def process_csv():
    try:
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
        data_dir = os.path.join(project_root, 'backend', 'data')
        file_path = os.path.join(data_dir, '20k Financial Data.csv')

        logger.info(f"Processing file at: {file_path}")

        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            raise HTTPException(
                status_code=404,
                detail=f"File not found at location: {file_path}"
            )

        output_file = await process_csv_file(file_path)

        with open(output_file, "r") as f:
            data = json.load(f)

        return JSONResponse(
            content={
                "status": "success",
                "data": data,
                "file_processed": os.path.basename(file_path)
            }
        )

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error occurred: {str(e)}"
        )


#new file
@router.get("/process_csv_v2")
async def process_csv_v2():
    try:
        logger.info("Starting process_csv_v2 route")

        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
        data_dir = os.path.join(project_root, 'backend', 'data')
        file_path = os.path.join(data_dir, '20k Financial Data.csv')

        logger.info(f"Processing file at: {file_path}")

        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            raise HTTPException(
                status_code=404,
                detail=f"File not found at location: {file_path}"
            )

        logger.info("Calling process_csv_file_v2 service")
        processed_data = await process_csv_file_v2(file_path)

        logger.info("Collecting processed data")
        company_data = processed_data["company_data"].collect().to_dicts()
        country_stats = processed_data["country_stats"].collect().to_dicts()

        logger.info("Returning processed data successfully")
        return {
            "status": "success",
            "data": {
                "company_data": company_data,
                "country_stats": country_stats
            }
        }
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error occurred: {str(e)}"
        )
