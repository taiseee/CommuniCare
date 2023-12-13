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

query = input("query: ")
for index, rec in enumerate(recommend(query), start=1):
    print(f"{index}. {rec}")
