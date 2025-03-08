const getConfig = (): Config => {
  const data: Config = {
    broadcasterUsername: process.env.BROADCASTTER_USERNAME as string,
    moderatorUsername: process.env.MODERATOR_USERNAME as string,
  };

  if (!data.broadcasterUsername) {
    throw new Error('The environment variable BROADCASTTER_USERNAME is not specified.');
  }

  if (!data.moderatorUsername) {
    throw new Error('The environment variable MODERATOR_USERNAME is not specified.');
  }

  return data;
};

export default getConfig();
