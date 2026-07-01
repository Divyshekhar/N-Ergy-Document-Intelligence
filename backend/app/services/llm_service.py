import os
from typing import List

from google import genai

from app.schemas.document import RetrievedChunk
from app.schemas.query import LLMResponse


class LLMService:
    
    def __init__(self):
        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY") or "<fallback key>"
        )
        self.model = "gemini-2.5-flash"
    
    def _build_prompt(self, question: str, context: List[RetrievedChunk]) -> str:
        context_text = "\n\n".join(
            [
                f"[Document: {chunk.document_name}, Page: {chunk.page_number}]\n {chunk.content}"
                for chunk in context
            ]
        )
        return f"""
            You are a helpful AI assistant that answers questions using ONLY the provided document context.
            Instructions:
            - Answer only from the supplied context.
            - Do not make up information.
            - If the answer cannot be found in the context, reply exactly:
            "I couldn't find the answer in the uploaded documents."
            - Keep the answer concise and factual.  

            Context:
            {context_text}

            Question:
            {question}

            Answer:
            """
        
    def generate_answer(self, question: str, context: List[RetrievedChunk]) -> str:
        prompt = self._build_prompt(question, context)
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )
        if response.text is None:
            raise RuntimeError("Gemini returned an empty response.")
        
        return response.text