from firebase_functions import scheduler_fn
from firebase_admin import firestore
import requests
from bs4 import BeautifulSoup
from datetime import datetime

@scheduler_fn.on_schedule(
    schedule="every day 23:59",
    timezone=scheduler_fn.Timezone("Asia/Tokyo"),
    region="asia-northeast1",
    memory=512,
)
def get_event_urls_from_jmty_on_schedule(schedule_event: scheduler_fn.ScheduledEvent) -> None:
    date = datetime.now().date()
    
    current_year = datetime.now().year
    
    response = requests.get("https://jmty.jp/fukuoka/com-npo/g-all/a-730-fukuoka")
    content = response.content

    soup = BeautifulSoup(content, "html.parser")
    
    # 最後の要素はイベントではないので除外
    events = soup.select(".p-articles-list ul li")[:-1]
    
    if len(events) == 0:
        print("No events")
        return None
    for event in events:
        update_date_str = event.select(".p-item-history > div")[0].text # type: ignore
        update_date_str = update_date_str.replace("更新", "")
        update_date_str = update_date_str.replace("\n", "")
        
        # 文字列から日付を解析
        update_date = datetime.strptime(f"{current_year}年{update_date_str}", "%Y年%m月%d日").date()
        
        if update_date == date:
            jmty_id = event.find("a").get("href").split("/")[-1] # type: ignore
            event_url = "https://jmty.jp/fukuoka/com-npo/" + jmty_id
            db = firestore.client()
            event_urls_ref = db.collection("eventUrls").document("jmty_" + jmty_id)
            if event_urls_ref.get().exists:
                event_urls_ref.set(
                    {
                        "url": event_url,
                        "updatedAt": firestore.SERVER_TIMESTAMP,
                    },
                    merge=True
                )
                print("updated: " + update_date_str)
            else:
                event_urls_ref.set(
                    {
                        "url": event_url,
                        "createdAt": firestore.SERVER_TIMESTAMP,
                        "updatedAt": firestore.SERVER_TIMESTAMP,
                    }
                )
                print("added: " + update_date_str)
        else:
            print("not added: " + update_date_str)
    return None
