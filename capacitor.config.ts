import { CapacitorConfig } from '@capacitor/cli'; // eslint-disable-line

const config: CapacitorConfig = {
  appId: 'uk.ac.ceh.hornets',
  appName: 'Asian Hornet Watch',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      androidScaleType: 'CENTER_CROP',
    },
  },
};

export default config;
