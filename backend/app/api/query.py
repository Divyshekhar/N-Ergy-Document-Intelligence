from fastapi import APIRouter, HTTPException

from app.schemas.query import Citation, QueryRequest, QueryResponse
from app.services.llm_service import LLMService
from app.services.vector_service import VectorService


router = APIRouter()
vector_service = VectorService()
llm_service = LLMService()
    
@router.post("/", response_model=QueryResponse, status_code=200)
async def query_documents(request: QueryRequest):
    try:
        retrieved_chunks = vector_service.similarity_search(request.question)
        if not retrieved_chunks:
            raise HTTPException(
                status_code = 404,
                detail="No relevant documents found"
            )
        answer = llm_service.generate_answer(
            question=request.question,
            context = retrieved_chunks
        )
        
        citations = []
        seen = set()
        
        for chunk in retrieved_chunks:
            key = (chunk.document_name, chunk.page_number)
            if key not in seen:
                seen.add(key)
                citations.append(
                    Citation(
                        document_name= chunk.document_name,
                        page_number = chunk.page_number
                    )
                )
        return QueryResponse(
            answer = answer,
            citations=citations
        )
        
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code = 500,
            detail=f"Failed to answer query: {str(e)}",
        )
        
        
