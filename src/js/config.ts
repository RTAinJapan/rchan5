const getConfig = (): Config => {
  const data: Config = {
    clientId: process.env.TWITCH_CLIENT_ID as string,
    clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
    broadcasterUsername: process.env.BROADCASTTER_USERNAME as string,
    moderatorUsername: process.env.MODERATOR_USERNAME as string,
    twitchInitAccessToken: process.env.TWITCH_INIT_ACCESS_TOKEN as string,
    twitchInitRefreshToken: process.env.TWITCH_INIT_REFRESH_TOKEN as string,
    moderateLogEndpoint: (process.env.TWITCH_MODERATE_LOG_POSTGREST as string) ?? 'http://db:3000',
  };

  if (!data.clientId) {
    throw new Error('The environment variable TWITCH_CLIENT_ID is not specified.');
  }

  if (!data.clientSecret) {
    throw new Error('The environment variable TWITCH_CLIENT_SECRET is not specified.');
  }

  if (!data.broadcasterUsername) {
    throw new Error('The environment variable BROADCASTTER_USERNAME is not specified.');
  }

  if (!data.moderatorUsername) {
    throw new Error('The environment variable MODERATOR_USERNAME is not specified.');
  }

  return data;
};

export default getConfig();
