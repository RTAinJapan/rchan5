import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import fs from 'fs';
import { rawDataSymbol } from '@twurple/common';
import axios from 'axios';
import config from './config';

const main = async () => {
  /** userIdごとに最新1個のチャットだけ保持する */
  const chatLog = new Map<string, string>();

  // リフレッシュトークン
  const TOKEN_FILE = './data/tokens.json';
  let tokenData: any = {};
  if (fs.existsSync(TOKEN_FILE)) {
    tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
  } else {
    tokenData = {
      accessToken: config.twitchInitAccessToken,
      refreshToken: config.twitchInitRefreshToken,
      expiresIn: 12000,
      obtainmentTimestamp: 0,
    };
  }
  // console.log(tokenData);

  const authProvider = new RefreshingAuthProvider({ clientId: config.clientId, clientSecret: config.clientSecret });
  authProvider.onRefresh(async (userId, newTokenData) => fs.writeFileSync(TOKEN_FILE, JSON.stringify(newTokenData, null, 2)));
  await authProvider.addUserForToken(tokenData);

  const apiClient = new ApiClient({ authProvider });

  const listener = new EventSubWsListener({ apiClient });
  listener.start();

  const broadcaster = await apiClient.users.getUserByName(config.broadcasterUsername);
  if (!broadcaster) throw new Error(`broadcaster ${config.broadcasterUsername} is not found`);

  const moderator = await apiClient.users.getUserByName(config.moderatorUsername);
  if (!moderator) throw new Error(`moderator ${config.moderatorUsername} is not found`);

  // scope
  // https://dev.twitch.tv/docs/authentication/scopes/

  // broadcasterのチャット上でTimeoutやBANが発生したときのイベント
  // /node_modules/@twurple/api/lib/endpoints/eventSub/HelixEventSubApi.jsで呼んでる
  // https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelmoderate
  // v1からv2でscopeにmoderator:read:warningsが増えてるのに注意
  listener.onChannelModerate(broadcaster.id, moderator.id, async (e) => {
    console.log('-------------onChannelModerate----------------------');
    const moderatorName = e.moderatorName;
    const action = e.moderationAction;
    const actionData = e[rawDataSymbol][action] ?? '';
    let message: string = '';
    if (actionData && actionData.user_id) {
      const target_user_id = actionData.user_id as string;
      // 最後のメッセージを取得
      const temp = chatLog.get(target_user_id);
      if (temp) {
        message = temp;
      }
    }
    console.log(`${moderatorName}\t${action}\t${message}\t${JSON.stringify(actionData)}`);

    const body = {
      moderator_name: moderatorName,
      action: action,
      last_message: message,
      moderate_target: JSON.stringify(actionData),
    };
    await axios.post(`${config.moderateLogEndpoint}/moderate`, body);
  });

  // https://twurple.js.org/reference/eventsub-base/classes/EventSubChannelChatMessageEvent.html
  listener.onChannelChatMessage(broadcaster.id, moderator.id, async (e) => {
    // console.log('-------------onChannelChatMessage------------------');
    // console.log(`[${e.chatterName}] [${e.chatterId}] [${e.messageType}] ${e.messageText}`);
    if (e.messageType !== 'text') return;

    const body = {
      user_id: e.chatterId,
      user_name: e.chatterName,
      message_type: e.messageType,
      message_text: e.messageText,
    };
    // await axios.post('http://db:3000/chat', body);
    chatLog.set(e.chatterId, JSON.stringify(body));
  });

  // listener.onChannelChatNotification(broadcaster, userId, (e) => {
  //   console.log('-------------onChannelChatNotification------------------');
  //   console.log(e);
  //   console.log(e.messageText);
  // });

  // https://twurple.js.org/reference/eventsub-base/classes/EventSubChannelChatClearUserMessagesEvent.html
  // listener.onChannelChatClearUserMessages(broadcaster, userId, (e) => {
  //   console.log('-------------onChannelChatClearUserMessages------------------');
  //   console.log(e);
  //   console.log(`broadcasterId=${e.broadcasterId} userId=${e.userId} username=${e.userName}`);
  // });

  console.log('listened...');
};

main();
