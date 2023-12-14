import json
from src.service import TextEmbedder, EventExtractor, get_webtxt

class OutputDB:
    def __init__(self) -> None:
        self.text_embedder = TextEmbedder()
        self.event_extractor = EventExtractor()
    
    def output_db(self, urls: list) -> None:
        all_embeddings = []

        for url in urls:
            webtxt = get_webtxt(url)
            events = self.event_extractor.get_events(webtxt)
            events2json = json.loads(events)
            host = events2json["events"][0]["host"]
            title = events2json["events"][0]["title"]
            embedding = self.text_embedder.embed_text(events2json["events"][0]["body"])
            all_embeddings.append(
                {
                    "host": host,
                    "title": title,
                    "embedding": embedding
                }
            )

        with open('db.json', 'w', encoding='utf-8') as f:
            json.dump(all_embeddings, f, ensure_ascii=False)

urls = [
    "https://www.fnvc.jp/event/detail/2179",
    "https://www.fnvc.jp/event/detail/2177",
    "https://www.fnvc.jp/event/detail/2173",
    "https://www.fnvc.jp/event/detail/2170",
    "https://www.fnvc.jp/event/detail/2163",
    "https://www.fnvc.jp/event/detail/2155",
    "https://www.fnvc.jp/event/detail/2151",
    "https://www.fnvc.jp/event/detail/2142",
    "https://www.fnvc.jp/event/detail/2139",
    "https://www.fnvc.jp/event/detail/2135"
]

output_db = OutputDB()
output_db.output_db(urls)