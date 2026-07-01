import axios from "axios";
import type { QueryRequest, QueryResponse, UploadResponse } from "./types";

const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL ||"http://localhost:8083",
});

export async function uploadDocuments(files: File[]): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const { data } = await api.post<UploadResponse>("/api/v1/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function queryDocuments(question: string): Promise<QueryResponse> {
  const payload: QueryRequest = { question };
  const { data } = await api.post<QueryResponse>("/api/v1/query/", payload);
  return data;
}

export default api;
