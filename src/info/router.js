/** ****************************************************************************
 * Info router.
 *****************************************************************************/
import Backbone from 'backbone';
import Marionette from 'marionette';
import { Log } from 'helpers';
import CONFIG from 'config'; // Replaced with alias
import App from 'app';
import CommonController from '../common/controller';
import InfoMenuController from './menu/controller';
import SpeciesController from './species/controller';
import HomeController from './home/controller';
import './brc_approved/BRC_approved_logo.png';
import './brc_approved/styles.scss';
import './help/swipe_record.png';

App.info = {};

const Router = Marionette.AppRouter.extend({
  routes: {
    '': HomeController.show,
    'home': HomeController.show,

    'info(/)': InfoMenuController.show,
    'info/about(/)': function () {
      CommonController.show({
        title: 'About', App, route: 'info/about/main',
        model: new Backbone.Model({
          version: CONFIG.version,
          build: CONFIG.build,
        }),
      }); },
    'info/help(/)': function () {
      CommonController.show({
        title: 'Help', App, route: 'info/help/main',
      }); },
    'info/privacy(/)': function () {
      CommonController.show({
        title: 'Privacy Policy', App, route: 'info/privacy/main',
      }); },
    'info/brc-approved(/)': function () {
      CommonController.show({
        title: 'BRC Approved', App, route: 'info/brc_approved/main',
      }); },
    'info/credits(/)': function () {
      CommonController.show({
        title: 'Credits', App, route: 'info/credits/main',
      }); },
    'info/species/:id(/)': SpeciesController.show,
    'info/*path': function () { App.trigger('404:show'); },
  },
});


// home page
App.on('home', () => {
  App.navigate('home');
  HomeController.show();
});


// info pages
App.on('info', () => {
  App.navigate('info');
  InfoMenuController.show();
});

App.on('info:about', () => {
  App.navigate('info/about');
  CommonController.show({
    title: 'About', App, route: 'info/about/main',
    model: new Backbone.Model({ version: CONFIG.version }),
  });
});

App.on('info:help', () => {
  App.navigate('info/help');
  CommonController.show({
    title: 'Help', App, route: 'info/help/main',
  });
});

App.on('info:privacy', () => {
  App.navigate('info/privacy');
  CommonController.show({
    title: 'Privacy Policy', App, route: 'info/privacy/main',
  });
});

App.on('info:brc-approved', () => {
  App.navigate('info/brc-approved');
  CommonController.show({
    title: 'BRC Approved', App, route: 'info/brc_approved/main',
  });
});

App.on('info:credits', () => {
  App.navigate('info/credits');
  CommonController.show({
    title: 'Credits', App, route: 'info/credits/main',
  });
});

App.on('before:start', () => {
  Log('Info:router: initializing');
  App.info.router = new Router();
});
