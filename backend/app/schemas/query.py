from pydantic import BaseModel


class QueryRequest(BaseModel):
    question: str

class Citation(BaseModel):
    document_name: str
    page_number: int
    
class LLMResponse(BaseModel):
    answer: str

class QueryResponse(BaseModel):
    answer: str
    citations: list[Citation]
    
