
from firebase_functions import https_fn, options
from firebase_admin import firestore
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from ..service import first_recommend_events

# ユーザーの居住区の緯度経度をベクトルに追加する
def add_location_to_userVec(userVec, area):
    area_location = {
        # 参考: https://www.geocoding.jp/
        "東区": [33.659239, 130.390461],
        "博多区": [33.574402, 130.440766],
        "中央区": [33.583832, 130.386348],
        "南区": [33.540948, 130.408402],
        "城南区": [33.548689, 130.369533],
        "早良区": [33.510704, 130.338233],
        "西区": [33.690042, 130.188521],
    }

    latitude, longitude = area_location.get(area, [0, 0])
    userVec_with_location = np.append(userVec, [latitude, longitude])

    return userVec_with_location

@https_fn.on_call(
    region="asia-northeast1",
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

        if len(all_users_list) < 4:
            return {"message": "user is not enough"}

        userVec = add_location_to_userVec(
            np.array(user.to_dict()['userVec']),
            user.to_dict()['area']
        )
        all_userVecs = np.array(
            [
                add_location_to_userVec(
                    np.array(user.to_dict()['userVec']),
                    user.to_dict()['area']
                )
                for user in all_users_list
            ]
        )

        cos_sim = cosine_similarity(userVec.reshape(1, -1), all_userVecs)

        users_grouped_index = np.argsort(cos_sim[0])[-4:]
        users_grouped = [all_users_list[i] for i in users_grouped_index]

        new_group_name = ' '.join([user.to_dict()['name'] for user in users_grouped])
        new_group = db.collection("groups").add(
            {
                "name": new_group_name,
            }
        )
        
        for user in users_grouped:
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