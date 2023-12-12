from openai import OpenAI
import requests
from bs4 import BeautifulSoup
from langchain.output_parsers import PydanticOutputParser
from .schema import EventList

class EventExtractor:
    def __init__(self, model="gpt-3.5-turbo-1106"):
        self.client = OpenAI()
        self.model = model

    def get_events(self, text):
        parser = PydanticOutputParser(pydantic_object=EventList)
        res = self.client.chat.completions.create(
            model=self.model,
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
                {"role": "system", "content": parser.get_format_instructions()},
                {"role": "system", "content": "If there are multiple events, return multiple events. If you don't understand, return  {'events': []}"},
                {"role": "user", "content": "以下のwebサイトからイベント情報を取得してください。"},
                {"role": "user", "content": text}
            ]
        )
        events = res.choices[0].message.content
        return events

def get_webtxt(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    webtxt = soup.get_text()
    return webtxt

class TextEmbedder:
    def __init__(self, model="text-embedding-ada-002"):
        self.client = OpenAI()
        self.model = model

    def embed_text(self, text):
        res = self.client.embeddings.create(
            model=self.model,
            input=text
        )
        vec = res.data
        return vec