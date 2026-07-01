from locale import strcoll

from pydantic import BaseModel


class UploadedDocument(BaseModel):
    document_id: str
    original_filename: str
    store_filename: str
    file_size: int
    path: str

class UploadResponse(BaseModel):
    message: str
    documents_processed: int