from firebase_functions.firestore_fn import (
    on_document_updated,
    Event,
    DocumentSnapshot,
    Change
)
from firebase_admin import firestore
from ..service import EventExtractor

@on_document_updated(
    document="eventUrls/{id}",
    memory=512,
    timeout_sec=300,
)
def get_events_on_updated(event_on_updated: Event[Change[DocumentSnapshot | None]]) -> None:
    if event_on_updated.data is None:
        return None

    event_url = event_on_updated.data.after.to_dict()["url"] # type: ignore
    event_extractor = EventExtractor()
    webtxt = event_extractor.get_webtxt(event_url)
    events = event_extractor.get_events(webtxt)
    if len(events) == 0:
        return None
    event = events[0]

    db = firestore.client()
    events_ref = db.collection("events")
    event_docs = events_ref.where("url", "==", event_url).select(field_paths=["id"]).get()
    for event_doc in event_docs:
        events_ref.document(event_doc.id).set(
            {
                "title": event.get("title"),
                "host": event.get("host"),
                "category": event.get("category"),
                "dateTime": event.get("dateTime"),
                "location": event.get("location"),
                "description": event.get("description"),
                "url": event_url,
                "contact": event.get("contact"),
                "updatedAt": firestore.SERVER_TIMESTAMP,
            },
            merge=True
        )
    return None