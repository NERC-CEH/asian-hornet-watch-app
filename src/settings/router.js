/** ****************************************************************************
 * Settings router.
 *****************************************************************************/
import Marionette from 'marionette';
import App from 'app';
import { Log } from 'helpers';
import CommonController from '../common/controller';
import MenuController from './menu/controller';


App.settings = {};

const Router = Marionette.AppRouter.extend({
  routes: {
    'settings(/)': MenuController.show,
    'settings/*path': function () { App.trigger('404:show'); },
  },
});

App.on('settings', () => {
  App.navigate('settings/menu');
  CommonController.show({
    title: 'Settings', App, route: 'settings/menu',
  });
});

App.on('before:start', () => {
  Log('Settings:router: initializing');
  App.settings.router = new Router();
});
