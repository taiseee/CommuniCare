import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from src.service import TextEmbedder

def recommend(query: str) -> list:
    text_embedder = TextEmbedder()

    with open('db.json', 'r', encoding='utf-8') as f:
        db = json.load(f)

    query_embedding = text_embedder.embed_text(query)
    similarities = [cosine_similarity([query_embedding], [item['embedding']])[0][0] for item in db]
    sorted_indices = np.argsort(similarities)[::-1]

    return [db[i]['title'] for i in sorted_indices]

query = input("query: ")
for index, rec in enumerate(recommend(query), start=1):
    print(f"{index}. {rec}")

def recommend2(query: str, mood: str) -> list:
    text_embedder = TextEmbedder()

    with open('db.json', 'r', encoding='utf-8') as f:
        db = json.load(f)

    # 1段階目: moodに対してcos類似度を計算して上位5組に候補を絞る
    mood_embeddings = text_embedder.embed_text(mood)
    norms = [cosine_similarity([mood_embeddings], [item['embedding']])[0][0] for item in db]
    candidate_indices = np.argsort(norms)[::-1][:5]
    candidates = [db[i] for i in candidate_indices]

    # 2段階目: 候補に対してcos類似度を計算してソート
    query_embedding = text_embedder.embed_text(query)
    similarities = [cosine_similarity([query_embedding], [item['embedding']])[0][0] for item in candidates]
    sorted_indices = np.argsort(similarities)[::-1]

    return [candidates[i]['title'] for i in sorted_indices]

query2 = input("query2: ")
mood = input("mood: ")
for index, rec in enumerate(recommend2(query2, mood), start=1):
    print(f"{index}. {rec}")
