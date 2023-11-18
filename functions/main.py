import firebase_admin
from src.api import get_events_from_pdf, get_events_from_html

if not firebase_admin._apps:
    firebase_admin.initialize_app()