import os
import json
from fastapi import HTTPException, APIRouter
from fastapi.responses import JSONResponse
import logging
from  ..services.processing_csv import process_csv_file

router = APIRouter()
logger = logging.getLogger(__name__)

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

# @router.get("/process_csv")
# async def process_csv_route():
#     project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')) 
#     data_dir = os.path.join(project_root, 'app', 'api', 'data')  
    
#     # Define file paths
#     file_paths = [
#         os.path.join(data_dir, '20k Financial Data.csv'),
#         os.path.join(data_dir, '30k Financial Data.csv')
#     ]


#     for file_path in file_paths:
#         if not os.path.exists(file_path):
#             raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

#     try:
       
#         output_file = process_csv(file_paths)
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))

#     with open(output_file, "r") as f:
#         data = json.load(f) 

#     return JSONResponse(content=data)