type Config = {
  twitch: {
    /**
     * モデレーションしてるチャンネルのusername
     * @example "rtainjapan"
     */
    broadcasterUsername: string;
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
