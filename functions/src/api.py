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


from firebase_admin import firestore

@https_fn.on_request(timeout_sec=300)
def create_group(req: https_fn.Request) -> https_fn.Response:
    userId = req.args.get('userId') if (req.args and 'userId' in req.args) else ''
    db = firestore.client()

    # user = db.collection("users").document(userId).get()
    # userVec = user.to_dict()['userVec']

    # TODO: グループの名前を決める
    new_group = db.collection("groups").add(
        {
            "name": "テストグループ",
        }
    )

    # TODO: 今は全ユーザーをグループに追加してるが変更する
    all_users = db.collection("users").get()
    all_users_id_list = [user.id for user in all_users]
    
    for userId in all_users_id_list:
        db.collection("userGroups").add(
            {
                "userId": userId,
                "groupId": new_group[1].id,
            }
        )

    return https_fn.Response("success", status=200)