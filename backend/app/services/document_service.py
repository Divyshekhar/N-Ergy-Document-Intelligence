from pathlib import Path
from typing import List
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from app.schemas.upload import UploadedDocument


class DocumentService:
    ALLOWED_EXTENSION = ".pdf"
    
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    def validate_pdf(self, file: UploadFile) -> None:
        if not file.filename:
            raise HTTPException(
                status_code = 400,
                detail= "File must have a file name"
            )
        if not file.filename.lower().endswith(self.ALLOWED_EXTENSION):
            raise HTTPException(
                status_code=400,
                detail= f"{file.filename} is not a PDF",
            ) 
    
    async def save_documents(self, files: List[UploadFile]) -> List[UploadedDocument]:
        saved_documents: List[UploadedDocument] = []
        for file in files:
            self.validate_pdf(file)
            unique_name = f"{uuid4()}_{file.filename}"
            destination = self.upload_dir / unique_name
            content = await file.read()
            destination.write_bytes(content)
            saved_documents.append(
                UploadedDocument(
                    document_id=str(uuid4()),
                    original_filename= str(file.filename),
                    store_filename= unique_name,
                    file_size= len(content),
                    path= str(destination)
                )
            )
        return saved_documents