import json
from src.service import TextEmbedder, EventExtractor, get_webtxt

def output_db(urls: list) -> None:
    all_embeddings = []
    text_embedder = TextEmbedder()
    event_extractor = EventExtractor()

    for url in urls:
        webtxt = get_webtxt(url)
        events = event_extractor.get_events(webtxt)
        events2json = json.loads(events)
        title = events2json["events"][0]["title"]
        embedding = text_embedder.embed_text(events2json["events"][0]["body"])[0].embedding
        all_embeddings.append(
            {
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

output_db(urls)