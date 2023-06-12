import React from 'react';
import { configure as mobxConfig } from 'mobx';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import { App as AppPlugin } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar';
import { initAnalytics } from '@flumens';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import { setupIonicReact, isPlatform } from '@ionic/react';
import config from 'common/config';
import 'common/theme.scss';
import appModel from 'models/app';
import savedSamples from 'models/savedSamples';
import userModel from 'models/user';
import App from './App';

console.log('🚩 App starting.'); // eslint-disable-line

i18n.use(initReactI18next).init({ lng: 'en' });

mobxConfig({ enforceActions: 'never' });

const getDeviceVersion = async () => {
  const device = await Device.getInfo();

  config.deviceVersion = device.osVersion;
};

setupIonicReact({
  swipeBackEnabled: false,
});

async function init() {
  await appModel.ready;
  await userModel.ready;
  await savedSamples.ready;

  appModel.attrs.sendAnalytics &&
    initAnalytics({
      dsn: config.sentryDNS,
      environment: config.environment,
      build: config.build,
      release: config.version,
      userId: userModel.id,
      tags: {
        'app.appSession': appModel.attrs.appSession,
      },
    });

  await getDeviceVersion();

  appModel.attrs.appSession += 1;
  appModel.save();

  ReactDOM.render(<App />, document.getElementById('root'));

  if (isPlatform('hybrid')) {
    StatusBar.setStyle({
      style: StatusBarStyle.Dark,
    });

    SplashScreen.hide();

    AppPlugin.addListener('backButton', () => {
      /* disable android app exit using back button */
    });
  }
}

init();
