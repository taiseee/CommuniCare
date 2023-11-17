from pydantic import BaseModel
from datetime import datetime

class Activity(BaseModel):
    name: str
    start_date_and_time: datetime
    end_date_and_time: datetime
    location: str
    description: str
    type: str