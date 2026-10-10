import pandas as pd
import re
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

DATASET_PATH = BASE_DIR / "dataset" / "books.csv"

TEST_CASE_PATH = BASE_DIR / "tests" / "test_cases.csv"


# =========================================================
# LOAD DATA
# =========================================================

books = pd.read_csv(DATASET_PATH)

test_cases = pd.read_csv(TEST_CASE_PATH)


# =========================================================
# TEXT CLEANING
# =========================================================

def clean_text(text):

    text = str(text)

    text = text.lower()

    text = re.sub(
        r"[^a-zA-Z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# =========================================================
# CLEAN DATASET
# =========================================================

books["clean_title"] = books["title"].apply(clean_text)

books["clean_category"] = books["category"].apply(clean_text)

books["clean_description"] = books["description"].apply(clean_text)

books["clean_author"] = books["author"].apply(clean_text)


# =========================================================
# RECOMMENDATION
# =========================================================

def recommend(query):

    query = clean_text(query)

    keywords = query.split()

    results = []


    for index, book in books.iterrows():

        score = 0

        title = book["clean_title"]

        category = book["clean_category"]

        description = book["clean_description"]

        author = book["clean_author"]


        for keyword in keywords:

            if keyword in title.split():
                score += 5

            if keyword in category.split():
                score += 4

            if keyword in description.split():
                score += 2

            if keyword in author.split():
                score += 1


        results.append({
            "index": index,
            "score": score
        })


    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )


    return results


# =========================================================
# EVALUATION
# =========================================================

total_tests = 0

successful_tests = 0

failed_tests = 0


print()

print("=" * 60)

print("LIBRA AI RECOMMENDATION EVALUATION")

print("=" * 60)

print()


for _, test in test_cases.iterrows():

    total_tests += 1

    query = test["query"]

    expected_category = test["expected_category"]


    recommendations = recommend(query)


    if len(recommendations) == 0:

        failed_tests += 1

        print(
            f"❌ {query} -> No recommendation"
        )

        continue


    top_index = recommendations[0]["index"]

    predicted_category = books.iloc[
        top_index
    ]["category"]


    if (
        str(predicted_category).lower()
        ==
        str(expected_category).lower()
    ):

        successful_tests += 1

        print(
            f"✅ {query} -> {predicted_category}"
        )

    else:

        failed_tests += 1

        print(
            f"❌ {query} -> "
            f"Expected: {expected_category} | "
            f"Got: {predicted_category}"
        )


# =========================================================
# HIT RATE
# =========================================================

if total_tests > 0:

    hit_rate = (
        successful_tests /
        total_tests
    ) * 100

else:

    hit_rate = 0


# =========================================================
# FINAL REPORT
# =========================================================

print()

print("=" * 60)

print(
    f"Total Test Cases        : {total_tests}"
)

print(
    f"Successful Tests        : {successful_tests}"
)

print(
    f"Failed Tests            : {failed_tests}"
)

print(
    f"Recommendation Hit Rate : {hit_rate:.2f}%"
)

print("=" * 60)

print()