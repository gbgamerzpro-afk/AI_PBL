
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.recommendation import (
    recommend_books,
    books
)

# =========================================================
# LIBRA AI - FASTAPI BACKEND
# =========================================================

app = FastAPI(
    title="LibraAI Digital Library API",
    description="AI-based Digital Library Recommendation System",
    version="1.0.0"
)

# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://aipbl-frontend.vercel.app"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

# =========================================================
# REQUEST MODEL
# =========================================================

class RecommendationRequest(BaseModel):
    interests: str
    number_of_recommendations: int = 5

# =========================================================
# HOME API
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to LibraAI Digital Library API",
        "status": "running",
        "version": "1.0.0"
    }

# =========================================================
# HEALTH CHECK API
# =========================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "dataset_resources": len(books)
    }

# =========================================================
# RECOMMENDATION API
# =========================================================

@app.post("/recommend")
def get_recommendations(request: RecommendationRequest):

    results = recommend_books(
        request.interests,
        request.number_of_recommendations
    )

    return {
        "success": True,
        "interests": request.interests,
        "count": len(results),
        "recommendations": results
    }

# =========================================================
# GET ALL BOOKS API
# =========================================================

@app.get("/books")
def get_all_books():

    resources = []

    for _, book in books.iterrows():
        resources.append({
            "resource_id": str(book["resource_id"]),
            "title": book["title"],
            "author": book["author"],
            "category": book["category"],
            "description": book["description"]
        })

    return {
        "success": True,
        "count": len(resources),
        "books": resources
    }
