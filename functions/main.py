from firebase_functions import https_fn
import firebase_admin
from firebase_admin import firestore
import json
from datetime import datetime, date

# Application Default credentials are automatically created.
app = firebase_admin.initialize_app()
db = firestore.client()

def json_serial(obj):
    # 日付型の場合には、文字列に変換する
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    # 上記以外はサポート対象外.
    raise TypeError ("Type %s not serializable" % type(obj))

@https_fn.on_request()
def get_activities(req: https_fn.Request) -> https_fn.Response:
    activities = db.collection("activities").stream()
    selected_activities = db.collection("activities").where("name", "==", "介護施設でお話し").stream()
    activities_list = []
    for activity in selected_activities:
        activities_list.append(activity.to_dict())
    return_json = json.dumps({"users": activities_list}, default=json_serial, ensure_ascii=False)
    return https_fn.Response(return_json, status=200)

@https_fn.on_request()
def add_activity(req: https_fn.Request) -> https_fn.Response:
    # demo
    activity = {
        "name": "お祭り",
        "start_date_and_time": datetime.now(),
        "end_date_and_time": datetime.now(),
        "location": "東京都",
        "description": "毎年恒例のお祭りです。",
        "type": "地域活動"
    }
    db.collection("activities").add(activity)
    return https_fn.Response("added", status=200)

@https_fn.on_request()
def delete_activity(req: https_fn.Request) -> https_fn.Response:
    # demo
    db.collection("activities").document("NV0hWL7hqd1RqNHZqKoq").delete()
    return https_fn.Response("deleted", status=200)

@https_fn.on_request()
def update_activity(req: https_fn.Request) -> https_fn.Response:
    # demo
    db.collection("activities").document("NV0hWL7hqd1RqNHZqKoq").update({"name": "新お祭り"})
    return https_fn.Response("updated", status=200)
