from firebase_functions import https_fn, options
from firebase_admin import firestore
from langchain.document_loaders import PyPDFLoader
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from .service import EventExtractor, get_webtxt, first_recommend_events
from firebase_admin import firestore
import random
import os
from google.cloud.firestore_v1.transaction import Transaction

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

@https_fn.on_call(
        memory=512,
        timeout_sec=300,
        cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
    )
def create_group(req: https_fn.CallableRequest):
    if req.data['userId']:
        userId = req.data['userId']
        db = firestore.client()
        user = db.collection("users").document(userId).get()

        if not user.exists:
            return {"message": "user not found"}

        all_users = db.collection("users").get()
        all_users_list = [user for user in all_users]

        userVec = np.array(user.to_dict()['userVec'])
        all_userVecs = np.array([user.to_dict()['userVec'] for user in all_users_list])
        if len(all_userVecs) == 0:
            return {"message": "No users found"}

        cos_sim = cosine_similarity(userVec.reshape(1, -1), all_userVecs)
        if len(cos_sim[0]) < 5:
            return {"message": "Not enough users for comparison"}

        top5_users_index = np.argsort(cos_sim[0])[-5:]

        top5_users = [all_users_list[i] for i in top5_users_index]

        new_group_name = ' '.join([user.to_dict()['name'] for user in top5_users])
        new_group = db.collection("groups").add(
            {
                "name": new_group_name,
            }
        )
        
        for user in top5_users:
            db.collection("userGroups").add(
                {
                    "userId": user.id,
                    "groupId": new_group[1].id,
                }
            )
        
        # 作成されたグループにイベントをレコメンドする
        first_recommend_events(new_group[1].id)
    else:
        return {"message": "userId is required"}

    return {"message": "success"}
