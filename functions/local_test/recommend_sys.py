import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from src.service import TextEmbedder

class RecommendSys:
    def __init__(self) -> None:
        with open('db.json', 'r', encoding='utf-8') as f:
            self.db = json.load(f)        
        self.text_embedder = TextEmbedder()

    def recom_1(self, query: str) -> list:
        query_embedding = self.text_embedder.embed_text(query)
        similarities = [cosine_similarity([query_embedding], [item['embedding']])[0][0] for item in self.db]
        sorted_indices = np.argsort(similarities)[::-1]

        return [self.db[i]['title'] for i in sorted_indices]
    
    def recom_2(self, query: str, mood: str) -> list:
        # 1段階目: moodに対してcos類似度を計算して上位5組に候補を絞る
        mood_embeddings = self.text_embedder.embed_text(mood)
        norms = [cosine_similarity([mood_embeddings], [item['embedding']])[0][0] for item in self.db]
        candidate_indices = np.argsort(norms)[::-1][:5]
        candidates = [self.db[i] for i in candidate_indices]

        # 2段階目: 候補に対してcos類似度を計算してソート
        query_embedding = self.text_embedder.embed_text(query)
        similarities = [cosine_similarity([query_embedding], [item['embedding']])[0][0] for item in candidates]
        sorted_indices = np.argsort(similarities)[::-1]

        return [candidates[i]['title'] for i in sorted_indices]
    

recommend_sys = RecommendSys()
query = input("query: ")
for index, rec in enumerate(recommend_sys.recom_1(query), start=1):
    print(f"{index}. {rec}")

query2 = input("query2: ")
mood = input("mood: ")
for index, rec in enumerate(recommend_sys.recom_2(query2, mood), start=1):
    print(f"{index}. {rec}")
