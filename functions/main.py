import firebase_admin
from src.api import (
    get_events_from_pdf,
    get_events_from_html,
    create_group,
    get_event_urls_from_asumin_on_schedule,
    get_events_on_created
)

if not firebase_admin._apps:
    firebase_admin.initialize_app()