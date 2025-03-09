# Rちゃん5号

Twitch チャットの BAN 記録を取るよ

## config

```json
BROADCASTTER_USERNAME=配信者のusername
MODERATOR_USERNAME=このツールを動かす自分のusername
TWITCH_CLIENT_ID=Client ID
TWITCH_CLIENT_SECRET=Client Secret
TWITCH_INIT_ACCESS_TOKEN=User Access Token
TWITCH_INIT_REFRESH_TOKEN=User Refresh Token
TWITCH_MODERATE_LOG_POSTGREST=PostgREST Endpoint URL
```

- INIT系トークンについて
  - `GET https://id.twitch.tv/oauth2/authorize?xxxx` でブラウザ経由で認証
  - `POST https://id.twitch.tv/oauth2/token?client_id=xxxx&xxx...` でAPI経由で初期値のトークンを取得。以降はリフレッシュされる。

## 実行

```
npm run start
```

## 記録内容

- PostgREST経由でDBに登録。スキーマはSQL参照。
