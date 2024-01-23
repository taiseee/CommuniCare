from firebase_functions import scheduler_fn
from firebase_admin import firestore
from firebase_admin import firestore
import random

@scheduler_fn.on_schedule(
    schedule="every friday 16:00",
    timezone=scheduler_fn.Timezone("Asia/Tokyo"),
    region="asia-northeast1",
    memory=512,
)
def recommend_event_on_schedule(schedule_event: scheduler_fn.ScheduledEvent) -> None:
    db = firestore.client()

    events_ref = db.collection('events')
    events = events_ref.order_by('createdAt', direction=firestore.Query.DESCENDING).limit(20).get()
    event_ids = []
    for event in events:
        event_ids.append(event.id)

    if len(event_ids) == 0:
        return None

    groups = db.collection('groups').get()

    group_events_ref = db.collection('groupEvents')

    if len(groups) == 0:
        return None

    for group in groups:
        group_id = group.id
        # イベントidをランダムに1件取得
        event_id = random.choice(event_ids)
        # グループイベントを作成
        group_events_ref.add({
            'groupId': group_id,
            'eventId': event_id,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        })

    return None