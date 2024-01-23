import firebase_admin
from src.api import (
    create_group,
    create_user_vector,
    get_event_urls_from_asumin_on_schedule,
    get_event_urls_from_jmty_on_schedule,
    get_event_urls_from_vt_pf_on_schedule,
    get_events_on_created,
    get_events_on_updated,
    recommend_event_on_schedule
)

if not firebase_admin._apps:
    firebase_admin.initialize_app()