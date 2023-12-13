from pydantic import BaseModel, Field, validator

class Event(BaseModel):
    title: str = Field(..., description="イベントタイトル")
    datetime: str = Field(description="開催日時")
    place: str = Field(description="開催場所")
    host: str = Field(description="主催団体")
    body: str = Field(description="内容")
    contact: str = Field(description="連絡先")

class EventList(BaseModel):
    events: list[Event] = Field(..., description="イベントリスト")