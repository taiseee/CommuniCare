### テーブル設計

1. **users（ユーザー）**

   | Field Name         | Description             | Data Type |
   |--------------------|-------------------------|-----------|
   | id                 | ユーザーID（主キー）       | integer   |
   | UID                | UID                     | string    |
   | name               | 名前                     | string    |
   | age                | 年齢                     | integer   |
   | gender             | 性別                     | integer   |
   | interests          | 興味のあるもの             | string    |
   | hobbies            | 趣味                     | string    |
   | selfIntroduction   | 自己紹介                  | string    |

2. **groups（グループ）**

   | Field Name | Description             | Data Type |
   |------------|-------------------------|-----------|
   | id         | グループID（主キー）       | integer   |
   | name       | グループ名               | string    |

3. **userGroups（ユーザーグループ）**

   | Field Name | Description             | Data Type |
   |------------|-------------------------|-----------|
   | id         | ユーザーグループID（主キー） | integer   |
   | userId     | ユーザーID（外部キー）     | integer   |
   | groupId    | グループID（外部キー）     | integer   |

4. **events（イベント）**

   | Field Name     | Description             | Data Type |
   |----------------|-------------------------|-----------|
   | id             | イベントID（主キー）     | integer   |
   | title          | タイトル               | string    |
   | description    | 説明                   | string    |
   | location       | 場所                   | string    |
   | dateTime       | 開始日時               | datetime  |
   | category       | カテゴリ               | string    |
   | contact        | 連絡先                 | string    |

5. **groupEvents（ユーザー参加イベント）**

   | Field Name | Description             | Data Type |
   |------------|-------------------------|-----------|
   | id         | ユーザーイベントID（主キー） | integer   |
   | groupId     | グループID（外部キー）     | integer   |
   | eventId    | イベントID（外部キー）     | integer   |

6. **userVectors**

   | Field Name | Description             | Data Type |
   |------------|-------------------------|-----------|
   | id         | ユーザーベクトルID（主キー） | integer   |
   | userId     | ユーザーID（外部キー）     | integer   |
   | vector     | ベクトル               | list      |

7. **eventBallots**

   | Field Name | Description             | Data Type |
   |------------|-------------------------|-----------|
   | id         | イベント投票ID（主キー）   | integer   |
   | groupId     | グループID（外部キー）     | integer   |
   | startDateTime | 開始日時               | datetime  |
   | endDateTime | 終了日時               | datetime  |

8. **evntBallotChoices**

   | Field Name | Description             | Data Type |
   |------------|-------------------------|-----------|
   | id         | 投票選択肢ID（主キー）     | integer   |
   | eventBallotId   | イベント投票ID（外部キー）   | integer   |
   | eventId     | イベントID                 | integer   |

9. **userBallots**
   | Field Name | Description             | Data Type |
   |------------|-------------------------|-----------|
   | id         | ユーザー投票ID（主キー）   | integer   |
   | userId     | ユーザーID（外部キー）     | integer   |
   | eventBallotId   | イベント投票ID（外部キー）   | integer   |
   | eventId     | イベントID                 | integer   |
   | isParticipant | 参加する         | boolean   |

~~5. **reviews(振り返り)**~~

   | Field Name       | Description             | Data Type |
   |------------------|-------------------------|-----------|
   | id               | 振り返りID（主キー）       | integer   |
   | usereventId      | イベントID（外部キー）     | integer   |
   | content          | 振り返り内容           | string    |
   | eventLiveliness  | イベント活発度         | float     |
   | eventScale       | イベント規模           | float     |
   | eventAgeRange    | イベント年齢層         | float     |
   | eventFatigue     | イベント疲労度         | float     |
   | eventSatisfaction| イベント満足度         | float     |

~~6.  **eventVectors**~~

   | Field Name | Description             | Data Type |
   |------------|-------------------------|-----------|
   | id         | イベントベクトルID（主キー） | integer   |
   | eventId    | イベントID（外部キー）     | integer   |
   | vector     | ベクトル               | list      |

~~6. **hosts（イベント主催団体）**~~

   | Field Name | Description             | Data Type |
   |------------|-------------------------|-----------|
   | id         | 主催者ID（主キー）         | integer   |
   | name       | 主催団体者名             | string    |