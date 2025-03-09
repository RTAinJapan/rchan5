type Config = {
  clientId: string;
  clientSecret: string;
  twitchInitAccessToken: string;
  twitchInitRefreshToken: string;
  moderateLogEndpoint: string;

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
type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer P> ? P : never;
