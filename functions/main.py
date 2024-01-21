import firebase_admin
from src.api import (
    get_events_from_pdf,
    create_group,
    create_user_vector,
    get_event_urls_from_asumin_on_schedule,
    get_events_on_created,
    recommend_event_on_schedule
)

if not firebase_admin._apps:
    firebase_admin.initialize_app()