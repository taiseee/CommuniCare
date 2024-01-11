from openai import OpenAI
import requests
from bs4 import BeautifulSoup
from langchain.output_parsers import PydanticOutputParser
from .schema import EventList
from firebase_admin import firestore
import random
import json

class EventExtractor:
    def __init__(self, model="gpt-3.5-turbo-1106"):
        self.client = OpenAI()
        self.model = model

    def get_events(self, text) -> dict:
        parser = PydanticOutputParser(pydantic_object=EventList)
        res = self.client.chat.completions.create(
            model=self.model,
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
                {"role": "system", "content": parser.get_format_instructions()},
                {"role": "system", "content": "If there are multiple events, return multiple events. If you don't understand, return  {'events': []}"},
                {"role": "user", "content": "以下のwebサイトからイベント情報を取得してください。"},
                {"role": "user", "content": text}
            ]
        )
        events = res.choices[0].message.content
        return json.loads(events)["events"]

    def get_webtxt(self, url):
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        webtxt = soup.get_text()
        return webtxt

def first_recommend_events(group_id: str):
    db = firestore.client()

    events_ref = db.collection('events')
    events = events_ref.order_by('createdAt', direction=firestore.Query.DESCENDING).limit(20).get()
    event_ids = []
    for event in events:
        event_ids.append(event.id)

    if len(event_ids) == 0:
        return

    group_events_ref = db.collection('groupEvents')

    # イベントidをランダムに1件取得
    event_id = random.choice(event_ids)
    # グループイベントを作成
    group_events_ref.add({
        'groupId': group_id,
        'eventId': event_id,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP
    })