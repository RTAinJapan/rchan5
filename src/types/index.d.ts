type Config = {
  twitch: {
    /**
     * モデレーションしてるチャンネルのusername
     * @example "rtainjapan"
     */
    broadcasterUsername: string;
    broadcasterUserId: string;
    /**
     * モデレーター自身のusername。このユーザのoauthtokenが別途要る
     */
    moderatorUsername: string;
  };
};
type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer P> ? P : never;

type ModLogsMessage = {
  id: string;
  /** @example '2023-04-12T15:04:21.596582669Z' */
  sentAt: string;
  content: {
    /** @example 'わぁいわぁい' */
    text: string;
    fragments: [
      {
        /** @example 'わぁいわぁい' */
        text: string;
        content: null;
        __typename: 'ModLogsMessageFragment';
      }
    ];
    __typename: 'ModLogsMessageContent';
  };
  sender: {
    /** @example '1234567 */
    id: string;
    /** @example 'username */
    login: string;
    chatColor: null;
    /** @example 'DisplayName' */
    displayName: string;
    displayBadges: any[];
    __typename: 'User';
  };
  __typename: 'ModLogsMessage';
};

type ModLogsTargetedModActionsEntry = {
  id: string;
  action: 'TIMEOUT_USER' | 'BAN_USER';
  /** @example '2023-04-12T15:04:29.691361448Z' */
  timestamp: string;
  channel: {
    /** @example '123456' */
    id: string;
    /** @example 'username' */
    login: string;
    __typename: 'User';
  };
  /** BANされた人 */
  target: {
    /** @example '123456' */
    id: string;
    /** @example 'username' */
    login: string;
    __typename: 'User';
  };
  /** BANを実行したモデレーター。BANされた当人は誰にBANされたかわからないようにnullになる */
  user: {
    /** @example '123456' */
    id: string;
    /** @example 'username' */
    login: string;
    __typename: 'User';
  } | null;
  details: {
    /** @example '2023-04-12T15:04:29.691361448Z' */
    bannedAt: string;
    /** 追放の時はnull */
    durationSeconds: number | null;
    /** @example '2023-04-12T15:14:29.691361448Z' */
    expiresAt: string | null;
    reason: string | null;
    __typename: 'TargetedModActionDetails';
  };
  __typename: 'ModLogsTargetedModActionsEntry';
};

type GetUserID = {
  data: {
    user: {
      id: string;
      __typename: 'User';
    };
  };
  extensions: {
    durationMilliseconds: number;
    operationName: 'GetUserID';
    requestID: string;
  };
};

type ViewerCardModLogsMessagesBySender = {
  data: {
    viewerCardModLogs: {
      messages: {
        edges: ViewerCardModLogsMessagesEdge[];
        pageInfo: {
          hasNextPage: boolean;
          __typename: 'PageInfo';
        };
        __typename: 'ViewerCardModLogsMessagesConnection';
      };
      __typename: 'ViewerCardModLogs';
    };
  };
  extensions: {
    durationMilliseconds: number;
    operationName: 'ViewerCardModLogsMessagesBySender';
    requestID: string;
  };
};

/** Banしたときのログ */
type ViewerCardModLogsMessagesEdge = {
  __typename: 'ViewerCardModLogsMessagesEdge';
  node: ViewerCardModLogsModActionsMessage | ViewerCardModLogsChatMessage;
  cursor: string;
};

/** タイムアウト */
type ViewerCardModLogsModActionsMessage = {
  /** @example '2023-08-10T14:53:26.970531978Z' */
  timestamp: string;
  content: {
    fallbackString: '発言禁止されました';
    localizedStringFragments: [
      {
        token: {
          displayName: string;
          login: string;
          id: string;
          __typename: 'User';
        };
        __typename: 'ModActionsLocalizedTextFragment';
      },
      {
        token: {
          text: 'さんが';
          __typename: 'ModActionsLocalizedTextToken';
        };
        __typename: 'ModActionsLocalizedTextFragment';
      },
      {
        token: {
          displayName: string;
          login: string;
          id: string;
          __typename: 'User';
        };
        __typename: 'ModActionsLocalizedTextFragment';
      },
      {
        token: {
          text: 'さんを';
          __typename: 'ModActionsLocalizedTextToken';
        };
        __typename: 'ModActionsLocalizedTextFragment';
      },
      {
        token: {
          /** @example '10' */
          text: string;
          __typename: 'ModActionsLocalizedTextToken';
        };
        __typename: 'ModActionsLocalizedTextFragment';
      },
      {
        token: {
          text: '秒間、発言禁止にしました';
          __typename: 'ModActionsLocalizedTextToken';
        };
        __typename: 'ModActionsLocalizedTextFragment';
      }
    ];
    __typename: 'ModActionsLocalizedText';
  };
  __typename: 'ViewerCardModLogsModActionsMessage';
};

// BAN
// type ViewerCardModLogsModActionsMessage = {
//   timestamp: '2023-08-10T15:26:14.759937043Z';
//   content: {
//     fallbackString: '追放済み';
//     localizedStringFragments: [
//       {
//         token: {
//           displayName: 'ぱすた';
//           login: 'pastan04';
//           id: '43594253';
//           __typename: 'User';
//         };
//         __typename: 'ModActionsLocalizedTextFragment';
//       },
//       {
//         token: {
//           text: 'が';
//           __typename: 'ModActionsLocalizedTextToken';
//         };
//         __typename: 'ModActionsLocalizedTextFragment';
//       },
//       {
//         token: {
//           displayName: 'hogehoge';
//           login: 'hogehoge';
//           id: '12345678';
//           __typename: 'User';
//         };
//         __typename: 'ModActionsLocalizedTextFragment';
//       },
//       {
//         token: {
//           text: 'を追放しました';
//           __typename: 'ModActionsLocalizedTextToken';
//         };
//         __typename: 'ModActionsLocalizedTextFragment';
//       }
//     ];
//     __typename: 'ModActionsLocalizedText';
//   };
//   __typename: 'ViewerCardModLogsModActionsMessage';
// };

type ViewerCardModLogsChatMessage = {
  id: string;
  sender: {
    id: string;
    login: string;
    chatColor: null;
    displayName: string;
    displayBadges: [];
    __typename: 'User';
  };
  /** @example '2023-08-10T14:53:17.438997051Z' */
  sentAt: string;
  content: {
    /** @example 'test' */
    text: string;
    fragments: [
      {
        /** @example 'test' */
        text: string;
        content: null;
        __typename: 'ViewerCardModLogsMessageFragment';
      }
    ];
    __typename: 'ViewerCardModLogsMessageContent';
  };
  __typename: 'ViewerCardModLogsChatMessage';
};
