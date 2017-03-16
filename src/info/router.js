/** ****************************************************************************
 * Info router.
 *****************************************************************************/
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Log from 'helpers/log';
import CONFIG from 'config';
import App from 'app';
import radio from 'radio';
import CommonController from '../common/controller';
import InfoMenuController from './menu/controller';
import SpeciesController from './species/controller';
import SpeciesComparisonController from './species_comparison/controller';
import SpeciesListController from '../common/pages/taxon/controller';
import HomeController from './home/controller';
import './brc_approved/BRC_approved_logo.png';
import './brc_approved/styles.scss';
import './help/swipe_record.png';
import './credits/sponsor_logo.png';

App.info = {};

const Router = Marionette.AppRouter.extend({
  routes: {
    '': HomeController.show,
    home: HomeController.show,

    'info(/)': InfoMenuController.show,
    'info/about(/)': () => {
      CommonController.show({
        title: 'About',
        App,
        route: 'info/about/main',
        model: new Backbone.Model({
          version: CONFIG.version,
          build: CONFIG.build,
        }),
      });
    },
    'info/help(/)': () => {
      CommonController.show({
        title: 'Help',
        App,
        route: 'info/help/main',
        model: new Backbone.Model({
          site_url: CONFIG.site_url,
        }),
      });
    },
    'info/privacy(/)': () => {
      CommonController.show({
        title: 'Privacy Policy', App, route: 'info/privacy/main',
      });
    },
    'info/brc-approved(/)': () => {
      CommonController.show({
        title: 'BRC Approved', App, route: 'info/brc_approved/main',
      });
    },
    'info/credits(/)': () => {
      CommonController.show({
        title: 'Credits', App, route: 'info/credits/main',
      }); },
    'info/species/comparison(/)': SpeciesComparisonController.show,
    'info/species/:id(/)': SpeciesController.show,
    'info/species(/)': SpeciesListController.show,
    'info/*path': () => { radio.trigger('app:404:show'); },
  },
});


// home page
App.on('home', () => {
  App.navigate('home');
  HomeController.show();
});

App.on('before:start', () => {
  Log('Info:router: initializing.');
  App.info.router = new Router();
});
