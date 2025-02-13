from fastapi import Depends
from fastapi import HTTPException, APIRouter
from src.api.services.csv_service import  process_csv_file_v2
from src.api.auth.oauth2 import get_current_user

import os
import logging

router = APIRouter()
logger = logging.getLogger("Process Csv Routes")

#new file
@router.get("/process_csv_v2")
async def process_csv_v2(current_user: dict=Depends(get_current_user)):
    try:
        logger.info("Starting process_csv_v2 route")

        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
        file_path = os.path.join(project_root, 'backend', 'data', '20k Financial Data.csv')

        logger.info(f"Checking file existence: {file_path}")

        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            raise HTTPException(status_code=404, detail=f"File not found at location: {file_path}")

        logger.info("Calling process_csv_file_v2 service")
        processed_data = await process_csv_file_v2(file_path)

        logger.info("Returning processed data successfully")
        return {
            "status": "success",
            "data": processed_data
        }

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unexpected error occurred: {str(e)}")





# @router.get("/process_csv")
# async def process_csv():
#     try:
#         project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
#         data_dir = os.path.join(project_root, 'backend', 'data')
#         file_path = os.path.join(data_dir, '20k Financial Data.csv')
#
#         logger.info(f"Processing file at: {file_path}")
#
#         if not os.path.exists(file_path):
#             logger.error(f"File not found: {file_path}")
#             raise HTTPException(
#                 status_code=404,
#                 detail=f"File not found at location: {file_path}"
#             )
#
#         output_file = await process_csv_file(file_path)
#
#         with open(output_file, "r") as f:
#             data = json.load(f)
#
#         return JSONResponse(
#             content={
#                 "status": "success",
#                 "data": data,
#                 "file_processed": os.path.basename(file_path)
#             }
#         )
#
#     except ValueError as e:
#         logger.error(f"Validation error: {str(e)}")
#         raise HTTPException(status_code=400, detail=str(e))
#     except Exception as e:
#         logger.error(f"Unexpected error: {str(e)}")
#         raise HTTPException(
#             status_code=500,
#             detail=f"Unexpected error occurred: {str(e)}"
#         )
