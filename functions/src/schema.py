from pydantic import BaseModel, Field, validator

class Event(BaseModel):
    title: str = Field(..., description="イベントタイトル")
    host: str = Field(description="主催団体")
    category: bool = Field(description="ボランティアならtrue, それ以外ならfalse")
    dateTime: str = Field(description="開催日時")
    location: str = Field(description="開催場所")
    description: str = Field(description="内容")
    contact: str = Field(description="連絡先")

class EventList(BaseModel):
    events: list[Event] = Field(..., description="イベントリスト")