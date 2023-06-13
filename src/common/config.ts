import {
  Filesystem,
  Directory as FilesystemDirectory,
} from '@capacitor/filesystem';
import { isPlatform } from '@ionic/react';

const backendUrl = process.env.APP_BACKEND_URL || 'https://irecord.org.uk';

const indiciaUrl =
  process.env.APP_BACKEND_INDICIA_URL || 'https://warehouse1.indicia.org.uk';

const CONFIG = {
  environment: process.env.NODE_ENV as string,
  version: process.env.APP_VERSION as string,
  build: process.env.APP_BUILD as string,

  sentryDNS: process.env.APP_SENTRY_KEY as string,

  map: {
    mapboxApiKey: process.env.APP_MAPBOX_MAP_KEY,
  },

  backend: {
    websiteId: 23,
    url: backendUrl,
    clientId: process.env.APP_BACKEND_CLIENT_ID as string,
    clientPass: process.env.APP_BACKEND_CLIENT_PASS as string,

    anonymousToken: process.env.APP_BACKEND_ANONYMOUS_TOKEN as string,

    mediaUrl: `${indiciaUrl}/upload/`,

    indicia: {
      url: indiciaUrl,
    },
  },

  dataPath: '',

  deviceVersion: undefined as string | undefined,
};

(async function getMediaDirectory() {
  if (isPlatform('hybrid')) {
    const { uri } = await Filesystem.getUri({
      path: '',
      directory: FilesystemDirectory.Data,
    });
    CONFIG.dataPath = uri;
  }
})();

export default CONFIG;
