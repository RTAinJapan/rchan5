// import axios from 'axios';
// import fs from 'fs';
// import configModule from 'config';
// const config: Config = configModule.util.toObject(configModule);

// const FILENAME = {
//   OAUTH_TOKEN: 'data/oauthtoken.txt',
//   BAN_LOG: 'data/banlog.csv',
// };

// let oauthAccessToken = '';

// const userlist = [];

// // gqlにはcookieのauth-tokenが必要
// const main = async () => {
//   console.log(config);
//   if (!config.twitch.broadcasterUsername || !config.twitch.moderatorUsername) {
//     throw new Error('Invalid Config Error.');
//   }
//   checkOAuthToken();

//   for (const username of userlist) {
//     console.log(`${username} start`);
//     const userId = await getUserID(username);
//     if (!userId) {
//       console.warn(`${username} のuserIDが取得できませんでした`);
//       continue;
//     }
//     let list = `"username","userid","sendAt","text"\n`;

//     let hasNextPage = false;
//     let cursor = undefined;
//     let textLen = 0;
//     do {
//       const res = await viewerCardModLogsMessagesBySender(userId, cursor);
//       if (!res) break;
//       hasNextPage = res.pageInfo.hasNextPage;

//       for (const item of res.edges) {
//         if ((item.node as any).content) {
//           const node = item.node as ModLogsMessage;
//           const text = node.content.text;
//           const sentAt = node.sentAt;

//           list += `"${username}","${userId}","${sentAt}","${text}"\n`;
//           textLen++;

//           cursor = (item as any).cursor;
//         }
//       }
//       // console.trace(`${username} list = ${textLen}`);
//     } while (hasNextPage && textLen < 1000);

//     fs.writeFileSync(`data/${username}.csv`, list);
//     console.log(`${username} end`);
//   }
// };

// // const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

// const viewerCardModLogsMessagesBySender = async (target_user_id: string, cursor?: string) => {
//   const body = [
//     {
//       operationName: 'ViewerCardModLogsMessagesBySender',
//       variables: {
//         senderID: `${target_user_id}`, // 取得対象のユーザID(数字)
//         channelLogin: config.twitch.broadcasterUsername,
//         cursor: cursor,
//       },
//       extensions: {
//         persistedQuery: {
//           version: 1,
//           sha256Hash: '437f209626e6536555a08930f910274528a8dea7e6ccfbef0ce76d6721c5d0e7', // このクエリで固定値
//         },
//       },
//     },
//   ];

//   const response: ViewerCardModLogsMessagesBySender[] = await postGraphQl(body);
//   if (!response) return null;
//   return response[0].data.channel.modLogs.messagesBySender;
// };

// const getUserID = async (username: string) => {
//   // console.trace(`getUserID username=${username}`);
//   const body = [
//     {
//       operationName: 'GetUserID',
//       variables: {
//         login: username,
//         lookupType: 'ACTIVE',
//       },
//       extensions: {
//         persistedQuery: {
//           version: 1,
//           sha256Hash: 'bf6c594605caa0c63522f690156aa04bd434870bf963deb76668c381d16fcaa5',
//         },
//       },
//     },
//   ];

//   const response: GetUserID[] = await postGraphQl(body);
//   // console.trace(JSON.stringify(response, null, '  '));
//   const user = response[0].data.user;
//   if (!user) return null;
//   const userId = user.id;

//   return userId;
// };

// const postGraphQl = async (body: object) => {
//   try {
//     // console.trace('[postGraphQl] start');

//     if (!oauthAccessToken) return null;

//     const url = 'https://gql.twitch.tv/gql';
//     const options = {
//       headers: {
//         Authorization: `OAuth ${oauthAccessToken}`,
//         'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko', // Twitchの固定値,
//         'Content-Type': 'application/json',
//         // 以下はhasNextPageで要る
//         'Client-Integrity':
//           'v4.public.eyJjbGllbnRfaWQiOiJraW1uZTc4a3gzbmN4NmJyZ280bXY2d2tpNWgxa28iLCJjbGllbnRfaXAiOiIxMjMuMjIwLjIyNi4yMTEiLCJkZXZpY2VfaWQiOiJjNjAzNTE1YjM2MTQ4MTQyIiwiZXhwIjoiMjAyMy0wNS0xMFQwNjo0Njo0OFoiLCJpYXQiOiIyMDIzLTA1LTA5VDE0OjQ2OjQ4WiIsImlzX2JhZF9ib3QiOiJmYWxzZSIsImlzcyI6IlR3aXRjaCBDbGllbnQgSW50ZWdyaXR5IiwibmJmIjoiMjAyMy0wNS0wOVQxNDo0Njo0OFoiLCJ1c2VyX2lkIjoiNDM1OTQyNTMifZ8pNYvInY8Jm5RUCCwDCZ3WiYH9kmvNQGuLOd37xApPR7Zg49VtPad6ePfOlgj3L5fH6G9bBzUqZk1SjmrxCQE',
//         'X-Device-Id': 'c603515b36148142',
//       },
//     };
//     // console.log(options);
//     const res = await axios.post(url, body, options);
//     // console.trace('[postGraphQl] end');
//     return res.data;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// };

// /**
//  * data/oauthtoken.txtからOAuthトークンを取得する
//  */
// const checkOAuthToken = () => {
//   try {
//     const filename = FILENAME.OAUTH_TOKEN;
//     const data = fs.readFileSync(filename);
//     const txt = data.toString();
//     if (txt) {
//       oauthAccessToken = txt.trim();
//     }
//   } catch (e) {
//     if (process.env.OAUTHTOKEN) {
//       oauthAccessToken = process.env.OAUTHTOKEN;
//     } else {
//       console.log('oauth token skip');
//     }
//   }
// };

// setInterval(async () => {
//   checkOAuthToken();
// }, 5000);

// main();
