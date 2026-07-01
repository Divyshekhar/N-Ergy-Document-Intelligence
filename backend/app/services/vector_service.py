import os
from typing import List, cast

import chromadb
from google import genai
from chromadb.config import Settings
from chromadb.api.types import Embedding
from app.schemas.document import DocumentChunk, RetrievedChunk

class VectorService:
    
    def __init__(self):
        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY") or "<fallback key>"
        )
        self.chroma = chromadb.PersistentClient(
            path="vector_store",
            settings = Settings(
                anonymized_telemetry=False
            )
        )
        self.collection = self.chroma.get_or_create_collection(name="documents")
    
    def _generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        response = self.client.models.embed_content(
            model="gemini-embedding-001",
            contents = texts,
        )
        if response.embeddings is None:
            raise RuntimeError("gemini returned no embeddings.")
        embeddings : List[List[float]] = []
        for embedding in response.embeddings:
            if embedding.values is None:
                raise RuntimeError("Embedding vector is empty.")
            embeddings.append(list(embedding.values))
        return embeddings
        
       
       
    def add_documents(self, chunks: List[DocumentChunk]) -> None:
        texts = [chunk.text for chunk in chunks]
        embeddings = cast(List[Embedding], self._generate_embeddings(texts))
        self.collection.add(
            ids=[chunk.chunk_id for chunk in chunks],
            documents = texts,
            embeddings = embeddings,
            metadatas=[
                {
                    "document_id": chunk.document_id,
                    "document_name": chunk.document_name,
                    "page_number": chunk.page_number,
                }
                for chunk in chunks
            ],
        )
    def similarity_search(self, query: str, k: int = 5) -> List[RetrievedChunk]:
        query_embedding = self._generate_embeddings([query])[0]
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=k,
        )
        if(
            results["documents"] is None
            or results["metadatas"] is None
            or results["distances"] is None
            or results["ids"] is None
        ): return []
        
        retrieved_chunks : List[RetrievedChunk] = []
        
        documents = results["documents"][0]
        metadatas = results["metadatas"][0]
        distances = results["distances"][0]
        ids = results["ids"][0]
        for document_id, document, metadata, distance in zip(
                ids,
                documents,
                metadatas,
                distances,
            ):

                retrieved_chunks.append(
                    RetrievedChunk(
                        chunk_id=document_id,
                        document_id=str(metadata["document_id"]),
                        document_name=str(metadata["document_name"]),
                        page_number= cast(int, metadata["page_number"]),
                        content=document,
                        score=1 - distance,
                    )
                )

        return retrieved_chunks
                