import pandas as pd
import re
from pathlib import Path


# =========================================================
# LIBRA AI
# Recommendation Engine
# Content-Based Weighted Keyword Matching
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATASET_PATH = BASE_DIR / "dataset" / "books.csv"


# ---------------------------------------------------------
# LOAD DATASET
# ---------------------------------------------------------

books = pd.read_csv(DATASET_PATH)


# ---------------------------------------------------------
# TEXT CLEANING
# ---------------------------------------------------------

def clean_text(text):
    """
    Converts text into a clean lowercase format.
    """

    text = str(text)

    text = text.lower()

    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)

    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ---------------------------------------------------------
# CREATE CLEAN COLUMNS
# ---------------------------------------------------------

books["clean_title"] = books["title"].apply(clean_text)

books["clean_category"] = books["category"].apply(clean_text)

books["clean_description"] = books["description"].apply(clean_text)

books["clean_author"] = books["author"].apply(clean_text)


# ---------------------------------------------------------
# RECOMMENDATION FUNCTION
# ---------------------------------------------------------

def recommend_books(user_input, number_of_recommendations=5):

    user_input = clean_text(user_input)

    user_keywords = user_input.split()

    recommendations = []


    # -----------------------------------------------------
    # CALCULATE MATCH SCORE
    # -----------------------------------------------------

    for index, book in books.iterrows():

        score = 0

        title = book["clean_title"]

        category = book["clean_category"]

        description = book["clean_description"]

        author = book["clean_author"]


        for keyword in user_keywords:

            # Title match
            if keyword in title.split():
                score += 5


            # Category match
            if keyword in category.split():
                score += 4


            # Description match
            if keyword in description.split():
                score += 2


            # Author match
            if keyword in author.split():
                score += 1


        recommendations.append({
            "index": index,
            "score": score
        })


    # -----------------------------------------------------
    # SORT BY SCORE
    # -----------------------------------------------------

    recommendations.sort(
        key=lambda x: x["score"],
        reverse=True
    )


    # -----------------------------------------------------
    # CREATE FINAL RESULTS
    # -----------------------------------------------------

    results = []

    rank = 1


    for recommendation in recommendations:

        index = recommendation["index"]

        score = recommendation["score"]


        # Only return matching resources
        if score > 0:

            results.append({

                "rank": rank,

                "resource_id": str(
                    books.iloc[index]["resource_id"]
                ),

                "title": books.iloc[index]["title"],

                "author": books.iloc[index]["author"],

                "category": books.iloc[index]["category"],

                "description": books.iloc[index]["description"],

                "score": score

            })

            rank += 1


        if len(results) >= number_of_recommendations:

            break


    return results