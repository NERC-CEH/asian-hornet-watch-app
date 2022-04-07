const backendUrl = process.env.APP_BACKEND_URL || 'https://TODO:';

const isTestEnv = process.env.NODE_ENV === 'test';

const CONFIG = {
  environment: process.env.NODE_ENV,
  version: process.env.APP_VERSION,
  build: process.env.APP_BUILD,

  log: !isTestEnv,

  sentryDNS: !isTestEnv && process.env.APP_SENTRY_KEY,

  backend: {
    url: backendUrl,
  },
};

export default CONFIG;
