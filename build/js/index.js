"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const ws_1 = tslib_1.__importDefault(require("ws"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const config_1 = tslib_1.__importDefault(require("config"));
const config = config_1.default.util.toObject(config_1.default);
const FILENAME = {
    OAUTH_TOKEN: 'data/oauthtoken.txt',
    BAN_LOG: 'data/banlog.csv',
};
let oauthAccessToken = '';
let isBeforeJoinIrcChannel = true;
const InvalidTokens = [];
// gqlにはcookieのauth-tokenが必要
const main = async () => {
    console.log(config);
    if (!config.twitch.broadcasterUsername || !config.twitch.moderatorUsername) {
        throw new Error('Invalid Config Error.');
    }
    checkOAuthToken();
    await connectEventWs();
};
const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
const connectEventWs = async () => {
    console.log('[connectEventWs] start');
    const url = 'wss://irc-ws.chat.twitch.tv/';
    // トークンが無い、または無効なトークンがセットされている
    while (!oauthAccessToken || InvalidTokens.includes(oauthAccessToken)) {
        console.log(`waiting oauth access token. Please write down to ${FILENAME.OAUTH_TOKEN}.`);
        await sleep(5000);
    }
    const ws = new ws_1.default(url);
    ws.on('open', () => {
        console.log('twitch irc WebSocket connected');
        // サーバ入室初期処理
        ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        ws.send(`PASS oauth:${oauthAccessToken}`);
        ws.send(`NICK ${config.twitch.moderatorUsername}`);
        ws.send(`USER ${config.twitch.moderatorUsername} 8 * :${config.twitch.moderatorUsername}`);
    });
    ws.on('message', (messageBuf, isBinary) => {
        // console.log('[ws] message received');
        try {
            const message = messageBuf.toString();
            // console.log(message);
            if (message.includes('PING :tmi.twitch.tv')) {
                console.log('[ws] send PONG');
                ws.send('PONG');
                return;
            }
            if (message.includes('Login authentication failed')) {
                InvalidTokens.push(oauthAccessToken);
                console.error(`有効なトークンを配置してください。10秒後にリトライします。 message=${message}`);
                sleep(10000).then(() => {
                    ws.close();
                });
            }
            if (isBeforeJoinIrcChannel && message.includes(`tmi.twitch.tv 001 ${config.twitch.moderatorUsername}`)) {
                // チャンネル入室
                ws.send(`JOIN #${config.twitch.broadcasterUsername}`);
                isBeforeJoinIrcChannel = false;
                console.log('[ws] channel joined');
                return;
            }
            messageHandler(message);
        }
        catch (e) {
            console.error(e);
        }
    });
    ws.on('close', () => {
        connectEventWs();
    });
};
const messageHandler = async (message) => {
    // console.log(message);
    // 10秒禁止
    // @ban-duration=10;room-id=43594253;target-user-id=19264788;tmi-sent-ts=1691639507335 :tmi.twitch.tv CLEARCHAT #pastan04 :nightbot
    // BAN
    // @room-id=43594253;target-user-id=19264788;tmi-sent-ts=1691639802554 :tmi.twitch.tv CLEARCHAT #pastan04 :nightbot
    if (!message.includes('CLEARCHAT')) {
        // console.log(message);
        return;
    }
    // 現状CLEARCHATの処理が起きるのがBanイベントの時っぽいので、その時の情報を使う
    const list = message.split(';');
    const target_user_id = list.find((item) => item.includes('target-user-id'))?.split('=')[1];
    const target_user_login = list[list.length - 1].match(new RegExp(`#${config.twitch.broadcasterUsername}.*`))[0].split(':')[1];
    // console.log(`[ws][BanEvent] user_id=${target_user_id} user_name=${target_user_login}`);
    if (!target_user_id) {
        console.warn(`${target_user_login}のID取得に失敗`);
        return;
    }
    // BANされたユーザの情報を取得する
    const edges = await viewerCardModLogsMessagesBySender(target_user_id, config.twitch.broadcasterUserId);
    if (!edges) {
        console.warn(`${target_user_id} - ${target_user_login}のgraphqlの取得に失敗`);
        return;
    }
    let banObj = null;
    let msgObj = null;
    let isContinue = true;
    for (const edge of edges) {
        if (!isContinue)
            continue;
        switch (edge.node.__typename) {
            case 'ViewerCardModLogsChatMessage': {
                if (banObj && isContinue) {
                    msgObj = edge.node;
                    isContinue = false;
                }
                break;
            }
            case 'ViewerCardModLogsModActionsMessage': {
                if (!banObj) {
                    banObj = edge.node;
                }
                break;
            }
        }
    }
    if (!banObj || !msgObj) {
        console.warn(`${target_user_id} - ${target_user_login}にメッセージ情報が無い. banObj=${JSON.stringify(banObj)} msgObj=${JSON.stringify(msgObj)}`);
        return;
    }
    // ファイル出力
    const banAction = banObj.content.fallbackString;
    const banSec = banAction.includes('追放') ? '-' : banObj.content.localizedStringFragments[4].token.text;
    const modName = banObj.content.localizedStringFragments[0].token.displayName;
    const data = `"${banObj.timestamp}","${target_user_login}","${banAction}","${banSec}","${msgObj.sentAt}","${msgObj.content.text.replace(/"/g, '""')}","${modName}"`;
    console.log(data);
    fs_1.default.appendFile(FILENAME.BAN_LOG, `${data}\n`, (e) => {
        //
    });
};
const viewerCardModLogsMessagesBySender = async (target_user_id, channelId) => {
    const body = [
        {
            operationName: 'ViewerCardModLogsMessagesBySender',
            variables: {
                senderID: `${target_user_id}`,
                channelID: channelId,
                // channelLogin: config.twitch.broadcasterUsername,
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: 'c634d7fadf4453103f4047a102ca2c4b0da4ada0330741bd80ae527c2c958513', // このクエリで固定値
                },
            },
        },
    ];
    const response = await postGraphQl(body);
    if (!response)
        return null;
    if (!response[0].data) {
        console.warn(JSON.stringify(response));
        return null;
    }
    return response[0].data.viewerCardModLogs.messages.edges;
};
const postGraphQl = async (body) => {
    try {
        console.log('[postGraphQl] start');
        if (!oauthAccessToken)
            return null;
        const url = 'https://gql.twitch.tv/gql';
        const options = {
            headers: {
                Authorization: `OAuth ${oauthAccessToken}`,
                'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
                'Content-Type': 'application/json',
            },
        };
        // console.log(options);
        const res = await axios_1.default.post(url, body, options);
        return res.data;
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
/**
 * data/oauthtoken.txtからOAuthトークンを取得する
 */
const checkOAuthToken = () => {
    try {
        const filename = FILENAME.OAUTH_TOKEN;
        const data = fs_1.default.readFileSync(filename);
        const txt = data.toString();
        if (txt) {
            oauthAccessToken = txt.trim();
        }
    }
    catch (e) {
        if (process.env.OAUTHTOKEN) {
            oauthAccessToken = process.env.OAUTHTOKEN;
        }
        else {
            console.log('oauth token skip');
        }
    }
};
setInterval(async () => {
    checkOAuthToken();
}, 5000);
main();
