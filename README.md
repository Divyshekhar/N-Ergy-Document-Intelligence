# N-ERGY Document Intelligence System

**Submitted by:** Divyshekhar Sinha

## Overview

A Retrieval-Augmented Generation (RAG) application that allows users to upload one or more PDF documents, index them into a vector database, and ask natural language questions. The system retrieves relevant document chunks using semantic search and generates grounded answers using Google's Gemini models along with citations.

---

## Features

- Upload multiple PDF documents
- Automatic PDF parsing
- Recursive text chunking
- Semantic embeddings with Gemini Embedding 001
- ChromaDB vector storage
- Context-aware question answering using Gemini 2.5 Flash
- Page-level citations
- Modern React frontend

---

## Tech Stack

### Backend
- FastAPI
- ChromaDB
- Gemini API
- LangChain Text Splitter
- PyPDF

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios

---

## Project Structure

backend/
frontend/

---

## Getting Started

See the README inside the backend and frontend folders.

Backend:
`cd backend`

Frontend:
`cd frontend`