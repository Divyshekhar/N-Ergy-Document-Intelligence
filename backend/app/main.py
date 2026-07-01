from dotenv import load_dotenv
from fastapi import FastAPI
from app.api.upload import router as upload_router
from app.api.query import router as query_router
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(
    title="N-ERGY Document Intelligence API",
    description="Backend API for PDF document ingestion and question answering.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy"
    }
    

app.include_router(upload_router, prefix="/api/v1/upload", tags=["Upload"])
app.include_router(query_router, prefix="/api/v1/query", tags=["Query"])