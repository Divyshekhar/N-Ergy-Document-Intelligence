from pathlib import Path
from typing import List

from pypdf import PdfReader

from app.schemas.document import ParsedPage


class ParserService:
    def parse_pdf(self, pdf_path: Path) -> List[ParsedPage]:
        try:
            reader = PdfReader(pdf_path)
            pages: List[ParsedPage] = []
            
            for index, page in enumerate(reader.pages, start = 1):
                text = page.extract_text()
                if not text:
                    text = ""
                
                pages.append(
                    ParsedPage(
                        page_number=index,
                        text= text
                    )
                ) 
            return pages
        except Exception as e:
            raise ValueError(f"Unable to parse pdf, {str(e)}")