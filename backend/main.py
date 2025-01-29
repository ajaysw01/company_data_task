from fastapi import FastAPI
from app.api.routes import processing_csv
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(processing_csv.router)

@app.get("/")
async def health():
    return {"message": "App is running fine..."}
