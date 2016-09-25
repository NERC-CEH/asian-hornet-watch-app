/** ****************************************************************************
 * Record router.
 *****************************************************************************/
import Marionette from 'marionette';
import { Log, Device } from 'helpers';
import App from 'app';
import recordManager from '../common/record_manager';
import userModel from '../common/models/user_model';
import appModel from '../common/models/app_model';
import ListController from './list/controller';
import ShowController from './show/controller';
import EditController from './edit/controller';
import EditLocationController from '../common/pages/location/controller';
import EditAttrController from './attr/controller';
import TaxonController from './taxon/controller';

App.records = {};

const Router = Marionette.AppRouter.extend({
  routes: {
    'records(/)': ListController.show,
    'records/:id': ShowController.show,
    'records/:id/edit(/)': EditController.show,
    'records/:id/edit/location(/)': EditLocationController.show,
    'records/:id/edit/taxon(/)': TaxonController.show,
    'records/:id/edit/:attr(/)': EditAttrController.show,
    'records/*path': function () { App.trigger('404:show'); },
  },
});

App.on('records:list', (options) => {
  App.navigate('records', options);
  ListController.show();
});

App.on('records:show', (recordID, options) => {
  App.navigate(`records/${recordID}`, options);
  ShowController.show(recordID);
});

App.on('records:edit', (recordID, options) => {
  App.navigate(`records/${recordID}/edit`, options);
  EditController.show(recordID);
});

App.on('records:edit:taxon', (recordID, options) => {
  App.navigate(`records/${recordID}/edit/taxon/`, options);
  TaxonController.show(recordID, occurrenceID);
});

App.on('records:edit:location', (recordID, options) => {
  App.navigate(`records/${recordID}/edit/location`, options);
  EditLocationController.show(recordID);
});

App.on('records:edit:attr', (recordID, attrID, options) => {
  App.navigate(`records/${recordID}/edit/${attrID}`, options);
  switch (attrID) {
    default:
      EditAttrController.show(recordID, attrID);
  }
});

App.on('records:new', (options) => {
  App.navigate('records/new', options);
  EditController.show();
});

App.on('records:new:attr', (attrID, options) => {
  App.navigate(`records/new/${attrID}`, options);
  switch (attrID) {
    case 'taxon':
      TaxonController.show();
      break;
    default:
      EditAttrController.show(null, attrID);
  }
});

App.on('record:saved', () => {
  window.history.back();
});

function syncRecords() {
  if (Device.isOnline() && appModel.get('autosync')) {
    Log('Records:router: syncing all records');
    recordManager.syncAll();
  }
}

userModel.on('login', syncRecords);

App.on('before:start', () => {
  Log('Records:router: initializing');
  App.records.router = new Router();

  if (userModel.hasLogIn()) {
    syncRecords();
  }
});
