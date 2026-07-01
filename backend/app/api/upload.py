from pathlib import Path
from typing import List

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from app.schemas.upload import UploadResponse
from app.services.document_service import DocumentService
from app.services.parser_service import ParserService
from app.services.chunk_service import ChunkService
from app.services.vector_service import VectorService
router = APIRouter()

document_service = DocumentService()
parser_service = ParserService()
chunk_service = ChunkService()
vector_service = VectorService()
@router.get("/")
async def upload_root():
    return {
        "message": "Upload endpoint"
    }

@router.post("/", response_model=UploadResponse, status_code=201)
async def upload_documents(files: List[UploadFile] = File(...)):
    try:
        uploaded_documents = await document_service.save_documents(files)
        for document in uploaded_documents:
            pages = parser_service.parse_pdf(Path(document.path))
            chunks = chunk_service.create_chunks(
                document_id=document.document_id,
                document_name=document.original_filename,
                pages=pages,
            )
            vector_service.add_documents(chunks)
        return UploadResponse(
                    message="Documents uploaded and indexed successfully.",
                    documents_processed=len(uploaded_documents),
                )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code = 500,
            detail=f"Failed to process uploaded documents:{str(e)}"
        )

