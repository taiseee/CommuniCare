from firebase_functions import https_fn, options
from openai import OpenAI
import numpy as np

@https_fn.on_call(
    memory=512,
    timeout_sec=300,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def create_user_vector(req: https_fn.CallableRequest):
    if req.data['hobbies'] and req.data['interests']:
        hobbies = req.data['hobbies']
        interests = req.data['interests']
        openai = OpenAI()

        res_hobbies = openai.embeddings.create(
            model='text-embedding-ada-002',
            input=hobbies,
            encoding_format='float'
        )

        res_interests = openai.embeddings.create(
            model='text-embedding-ada-002',
            input=interests,
            encoding_format='float'
        )

        hob_vec = np.array(res_hobbies.data[0].embedding)
        inter_vec = np.array(res_interests.data[0].embedding)

        user_vec = ((hob_vec + inter_vec) / 2).tolist()

        return {"userVec": user_vec}
    else:
        return {"message": "hobbies and interests are required"}