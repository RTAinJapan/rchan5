# Rちゃん5号

TwitchチャットのBAN記録を取るよ

## config
- config/default.json

```json
{
  "twitch": {
    "broadcasterUsername": "配信者のusername",
    "moderatorUsername": "このツールを動かす自分のusername"
  }
}
```

- data/oauthtoken.txt
  - ログイン中のユーザのCookieからauth-tokenを記載
  - moderatorUsernameと対応が取れてること

## 実行

```
npm run start
```

## 出力ファイル

- data/banlog.csv
  - BANやTIMEOUTを食らった時の状況のCSV

  | 項目 |
  |--- |
  | BAN実行時のtimestamp |
  | BANされたusername |
  | タイムアウトかBANか |
  | タイムアウトの秒数 |
  | 直前のメッセージ送信のtimestamp |
  | 直前のメッセージ |
  | BANを実行したモデレーターのusername |
