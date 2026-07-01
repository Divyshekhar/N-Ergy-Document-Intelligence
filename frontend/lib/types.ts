export interface UploadResponse {
  message: string;
  documents_processed: number;
}

export interface QueryRequest {
  question: string;
}

export interface Citation {
  document_name: string;
  page_number: number;
}

export interface QueryResponse {
  answer: string;
  citations: Citation[];
}
