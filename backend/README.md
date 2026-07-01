# Backend

## Requirements

Python 3.13+

uv

Gemini API Key

---

## Installation

`uv pip install -r requirement.txt`

---

## Environment Variables

Create a .env

`GEMINI_API_KEY= <YOUR_GEMINI_API_KEY>`

---

## Run

`uv run uvicorn app.main:app --reload --port 8083`

---

## API

GET /health

POST /api/v1/upload

POST /api/v1/query

---

## Architecture

Upload

↓

Parser

↓

Chunk

↓

Embeddings

↓

ChromaDB

↓

Similarity Search

↓

Gemini

↓

Answer

---

## Folder Structure

app/

api/

services/

schemas/

uploads/

vector_store/