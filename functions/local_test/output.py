import json
from src.service import TextEmbedder, EventExtractor, get_webtxt

def output_db(url_and_atmospheres: list[tuple]) -> None:
    all_embeddings = []
    text_embedder = TextEmbedder()
    event_extractor = EventExtractor()

    for url_and_atmosphere in url_and_atmospheres:
        url = url_and_atmosphere[0]
        atmosphere = url_and_atmosphere[1]
        webtxt = get_webtxt(url)
        events = event_extractor.get_events(webtxt)
        events2json = json.loads(events)
        title = events2json["events"][0]["title"]
        embedding = text_embedder.embed_text(title + "\n" + events2json["events"][0]["body"] + "\n" + atmosphere)[0].embedding
        all_embeddings.append(
            {
                "title": title,
                "embedding": embedding
            }
        )

    with open('db_with_atmosphere.json', 'w', encoding='utf-8') as f:
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

url_and_atmospheres = [
    ("https://www.fnvc.jp/event/detail/2179", "雰囲気: 交流少なめ、幅広い年代", "うみなかキャンドルナイトボランティア募集"),
    ("https://www.fnvc.jp/event/detail/2177", "雰囲気: 賑やか、交流が多い、笑顔", "サンタクロースボランティア募集中！"),
    ("https://www.fnvc.jp/event/detail/2173", "雰囲気: 静か、交流少なめ", "12月警固公園クリーンアップ"),
    ("https://www.fnvc.jp/event/detail/2170", "雰囲気: 交流が多い、幅広い年代、自然豊か、静か", "12月の和白干潟クリーン作戦と自然観察"),
    ("https://www.fnvc.jp/event/detail/2163", "雰囲気: 静か、交流少なめ", "11月福浜海岸ビーチクリーン"),
    ("https://www.fnvc.jp/event/detail/2155", "雰囲気: 交流が多い、自然豊か、体を動かす、静か", "１月の長谷活動"),
    ("https://www.fnvc.jp/event/detail/2151", "雰囲気: 交流が多い、優しい気持ちになる、年齢層高め", "セラピューティック・ケア入門講座"),
    ("https://www.fnvc.jp/event/detail/2142", "雰囲気: 交流が多い、幅広い年代、自然豊か、静か", "11月の和白干潟クリーン作戦と自然観察"),
    ("https://www.fnvc.jp/event/detail/2139", "雰囲気: 静か、交流少なめ", "ハロウィン後の早朝ゴミ拾い"),
    ("https://www.fnvc.jp/event/detail/2135", "雰囲気: 異国間交流、交流が多い", "普段着で外国人旅行者をガイド")
]
output_db(url_and_atmospheres)