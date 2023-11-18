from firebase_functions import https_fn
import firebase_admin
from firebase_admin import firestore
import json
from datetime import datetime, date
import os
import openai
import langchain
from openai import OpenAI
# from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain.document_loaders import PyPDFLoader
import requests
from bs4 import BeautifulSoup
from pydantic import BaseModel, Field, validator

# Application Default credentials are automatically created.
if not firebase_admin._apps:
    firebase_admin.initialize_app()

def json_serial(obj):
    # 日付型の場合には、文字列に変換する
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    # 上記以外はサポート対象外.
    raise TypeError ("Type %s not serializable" % type(obj))

@https_fn.on_request()
def get_events_from_pdf(req: https_fn.Request) -> https_fn.Response:
    # llm = OpenAI()
    # text = "こんにちは"
    # llm.invoke(text)
    loader = PyPDFLoader("https://fukuoka-shakyo.or.jp/user/media/fukuoka-shakyo/page/support/volunteeroffer/boshu-nishiku.pdf")
    pages = loader.load_and_split()
    print(pages)
    return https_fn.Response("success", status=200)


class Event(BaseModel):
    title: str = Field(..., description="イベントタイトル")
    datetime: str = Field(description="開催日")
    place: str = Field(description="開催場所")
    host: str = Field(description="主催団体")
    body: str = Field(description="内容")
    contact: str = Field(description="連絡先")

@https_fn.on_request()
def get_events_from_html(req: https_fn.Request) -> https_fn.Response:
    webtxt = get_webtxt("https://www.fnvc.jp/event/detail/2155")
    client = OpenAI()
    parser = PydanticOutputParser(pydantic_object=Event)
    res = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
            {"role": "system", "content": parser.get_format_instructions()},
            {"role": "user", "content": "以下のwebサイトからイベント情報を取得してください。"},
            {"role": "user", "content": webtxt}
        ]
    )
    event = res.choices[0].message.content
    print(event)
    return https_fn.Response("success", status=200)

def get_webtxt(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    webtxt = soup.get_text()
    return webtxt