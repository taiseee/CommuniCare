from firebase_functions.firestore_fn import (
    on_document_created,
    Event,
    DocumentSnapshot,
)
from firebase_admin import firestore
from ..service import EventExtractor
from firebase_admin import firestore

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
                "url": event_url,
                "contact": event.get("contact"),
                "createdAt": firestore.SERVER_TIMESTAMP,
                "updatedAt": firestore.SERVER_TIMESTAMP,
            }
        )
    return None