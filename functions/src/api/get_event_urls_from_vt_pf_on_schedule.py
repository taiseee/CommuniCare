from firebase_functions import scheduler_fn
from firebase_admin import firestore
import requests
from bs4 import BeautifulSoup
from datetime import datetime

@scheduler_fn.on_schedule(
    schedule="every day 23:59",
    timezone=scheduler_fn.Timezone("Asia/Tokyo"),
    memory=512,
)
def get_event_urls_from_vt_pf_on_schedule(schedule_event: scheduler_fn.ScheduledEvent) -> None:

    # イベントの要素を取得
    response = requests.get("https://b.volunteer-platform.org/fukuoka/")
    content = response.content
    soup = BeautifulSoup(content, 'html.parser')
    events = soup.select(".vt_list")

    # イベントが存在しない場合は終了
    if len(events) == 0:
        return None

    date = date = datetime.now()
    for event in events:
        # 現在イベントの募集期間中なら処理を続行
        period = event.find('th', text='募集期間').find_next_sibling('td').text.strip()
        _, end_date_str = period.split("～")
        end_date = datetime.strptime(end_date_str, "%Y/%m/%d")
        if end_date < date:
            continue

        # イベントurl追加
        vt_pf_id: str = event.select(".top_title > a")[0].get("href").split("/")[2] # type: ignore
        event_url = "https://b.volunteer-platform.org/fukuoka/" + vt_pf_id
        db = firestore.client()
        event_urls_ref = db.collection("eventUrls").document("vt_pf_" + vt_pf_id)
        if event_urls_ref.get().exists:
            continue

        event_urls_ref.set(
            {
                "url": event_url,
                "createdAt": firestore.SERVER_TIMESTAMP,
                "updatedAt": firestore.SERVER_TIMESTAMP,
            }
        )
    return None
