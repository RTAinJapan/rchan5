# Rちゃん5号

Twitch チャットの BAN 記録を取るよ

## config

```json
BROADCASTTER_USERNAME=配信者のusername
MODERATOR_USERNAME=このツールを動かす自分のusername
```

- data/oauthtoken.txt
  - ログイン中のユーザの Cookie から auth-token を記載
  - moderatorUsername と対応が取れてること

## 実行

```
npm run start
```

## 出力ファイル

- data/banlog.csv

  - BAN や TIMEOUT を食らった時の状況の CSV

  | 項目                                  |
  | ------------------------------------- |
  | BAN 実行時の timestamp                |
  | BAN された username                   |
  | タイムアウトか BAN か                 |
  | タイムアウトの秒数                    |
  | 直前のメッセージ送信の timestamp      |
  | 直前のメッセージ                      |
  | BAN を実行したモデレーターの username |
