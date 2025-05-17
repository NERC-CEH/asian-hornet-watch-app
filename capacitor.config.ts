import { CapacitorConfig } from '@capacitor/cli';

// eslint-disable-line

const config: CapacitorConfig = {
  appId: 'uk.ac.ceh.hornets',
  appName: 'Asian Hornet Watch',
  webDir: 'build',
  android: {
    adjustMarginsForEdgeToEdge: 'force',
  },
};

export default config;
