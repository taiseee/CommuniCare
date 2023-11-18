from firebase_functions import https_fn
from langchain.document_loaders import PyPDFLoader
from .service import EventExtractor, get_webtxt

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
    webtxt = get_webtxt("https://www.fnvc.jp/event/detail/2155")
    event_extractor = EventExtractor()
    events = event_extractor.get_events(webtxt)
    print(events)
    return https_fn.Response("success", status=200)