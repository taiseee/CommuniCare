import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from src.service import TextEmbedder

def recommend(query: str) -> list:
    text_embedder = TextEmbedder()

    with open('db.json', 'r', encoding='utf-8') as f:
        db = json.load(f)

    query_embedding = text_embedder.embed_text(query)[0].embedding
    similarities = [cosine_similarity([query_embedding], [item['embedding']])[0][0] for item in db]
    sorted_indices = np.argsort(similarities)[::-1]

    return [db[i]['title'] for i in sorted_indices]

def compare_cosine_similarity(query1: str, query2: str) -> None:
    text_embedder = TextEmbedder()

    with open('db.json', 'r', encoding='utf-8') as f:
        db = json.load(f)

    query1_embedding = text_embedder.embed_text(query1)[0].embedding
    query2_embedding = text_embedder.embed_text(query2)[0].embedding
    similarity = cosine_similarity([query1_embedding], [query2_embedding])[0][0]

    print(f"similarity: {similarity}")

if __name__ == "__main__":
    query1 = input("query1: ")
    query2 = input("query2: ")
    compare_cosine_similarity(query1, query2)

# query = input("query: ")
# for index, rec in enumerate(recommend(query), start=1):
#     print(f"{index}. {rec}")
