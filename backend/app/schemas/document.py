from pydantic import BaseModel


class ParsedPage(BaseModel):
    page_number: int
    text: str
    
class DocumentChunk(BaseModel):
    chunk_id: str
    document_id: str
    document_name: str
    page_number: int
    text: str
    
class RetrievedChunk(BaseModel):
    chunk_id: str
    content: str
    document_id: str
    document_name: str
    page_number: int
    score: float