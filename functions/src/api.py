from firebase_functions import https_fn, options, scheduler_fn
from firebase_functions.firestore_fn import (
    on_document_created,
    Event,
    Change,
    DocumentSnapshot,
)
from firebase_admin import firestore
from langchain.document_loaders import PyPDFLoader
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from .service import EventExtractor, first_recommend_events
from firebase_admin import firestore
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from google.cloud.firestore_v1.transaction import Transaction

@https_fn.on_request(timeout_sec=300)
def get_events_from_pdf(req: https_fn.Request) -> https_fn.Response:
    loader = PyPDFLoader("./boshu-nishiku.pdf")
    pages = loader.load_and_split()
    event_extractor = EventExtractor()
    events = event_extractor.get_events(pages[2].page_content)
    print(events)
    return https_fn.Response("success", status=200)

@https_fn.on_request(timeout_sec=300)
def get_events_from_html(req: https_fn.Request) -> https_fn.Response:
    event_extractor = EventExtractor()
    webtxt = event_extractor.get_webtxt("https://www.fnvc.jp/event/detail/2155")
    events = event_extractor.get_events(webtxt)
    print(events)
    return https_fn.Response("success", status=200)

@https_fn.on_call(
    memory=512,
    timeout_sec=300,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def create_group(req: https_fn.CallableRequest):
    if req.data['userId']:
        userId = req.data['userId']
        db = firestore.client()
        user = db.collection("users").document(userId).get()

        if not user.exists:
            return {"message": "user not found"}

        all_users = db.collection("users").get()
        all_users_list = [user for user in all_users]

        userVec = np.array(user.to_dict()['userVec'])
        all_userVecs = np.array([user.to_dict()['userVec'] for user in all_users_list])
        if len(all_userVecs) == 0:
            return {"message": "No users found"}

        cos_sim = cosine_similarity(userVec.reshape(1, -1), all_userVecs)
        if len(cos_sim[0]) < 5:
            return {"message": "Not enough users for comparison"}

        top5_users_index = np.argsort(cos_sim[0])[-5:]

        top5_users = [all_users_list[i] for i in top5_users_index]

        new_group_name = ' '.join([user.to_dict()['name'] for user in top5_users])
        new_group = db.collection("groups").add(
            {
                "name": new_group_name,
            }
        )
        
        for user in top5_users:
            db.collection("userGroups").add(
                {
                    "userId": user.id,
                    "groupId": new_group[1].id,
                }
            )
        
        # 作成されたグループにイベントをレコメンドする
        first_recommend_events(new_group[1].id)
    else:
        return {"message": "userId is required"}

    return {"message": "success"}

@scheduler_fn.on_schedule(
    schedule="every day 21:40",
    timezone=scheduler_fn.Timezone("Asia/Tokyo"),
    memory=512,
)
def get_event_urls_from_asumin_on_schedule(schedule_event: scheduler_fn.ScheduledEvent) -> None:
    date = datetime.now().strftime("%Y.%m.%d")

    response = requests.get("https://www.fnvc.jp/event/result/2")
    content = response.content

    soup = BeautifulSoup(content, "html.parser")
    events_ul = soup.select(".news-block ul")[0]
    events = events_ul.select("li")
    if len(events) == 0:
        return None

    for event in events:
        posted_date = event.find("span", class_="date").text # type: ignore
        if posted_date == date:
            event_url = "https://www.fnvc.jp" + event.find("a").get("href") # type: ignore
            db = firestore.client()
            event_ref = db.collection("eventUrls")
            event_ref.add(
                {
                    "url": event_url,
                    "createdAt": firestore.SERVER_TIMESTAMP,
                    "updatedAt": firestore.SERVER_TIMESTAMP,
                }
            )
    return None

@on_document_created(
    document="eventUrls/{id}",
    memory=512,
    timeout_sec=300,
)
def get_events_on_created(event_on_created: Event[DocumentSnapshot | None]) -> None:
    if event_on_created.data is None:
        return None

    event_url = event_on_created.data.to_dict()["url"] # type: ignore
    event_extractor = EventExtractor()
    webtxt = event_extractor.get_webtxt(event_url)
    events = event_extractor.get_events(webtxt)
    print(events)
    db = firestore.client()
    events_ref = db.collection("events")
    for event in events:
        events_ref.add(
            {
                "title": event.get("title"),
                "host": event.get("host"),
                "category": event.get("category"),
                "dateTime": event.get("dateTime"),
                "location": event.get("location"),
                "description": event.get("description"),
                "contact": event.get("contact"),
                "createdAt": firestore.SERVER_TIMESTAMP,
                "updatedAt": firestore.SERVER_TIMESTAMP,
            }
        )
    return None