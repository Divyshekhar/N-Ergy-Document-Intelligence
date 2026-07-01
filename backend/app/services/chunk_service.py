from typing import List
from uuid import uuid4

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.schemas.document import DocumentChunk, ParsedPage


class ChunkService:
    
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int= 200):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size = chunk_size,
            chunk_overlap = chunk_overlap
        )
        
    def create_chunks(self, document_id: str, document_name: str, pages: List[ParsedPage]) -> List[DocumentChunk]:
        chunk: List[DocumentChunk] = []
        for page in pages:
            page_chunks = self.text_splitter.split_text(page.text)
            for text in page_chunks:
                chunk.append(
                    DocumentChunk(
                        chunk_id = str(uuid4()),
                        document_id = document_id,
                        document_name = document_name,
                        page_number = page.page_number,
                        text = text,
                    )
                )
        return chunk