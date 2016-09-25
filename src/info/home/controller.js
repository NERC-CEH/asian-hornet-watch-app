import App from 'app';
import appModel from '../../common/models/app_model';
import Sample from '../../common/models/sample';
import Occurrence from '../../common/models/occurrence';
import MainView from './main_view';

const API = {
  show() {
    const mainView = new MainView();
    App.regions.getRegion('main').show(mainView);
    mainView.on('record', API.record);

    // HEADER
    App.regions.getRegion('header').hide().empty();

    // FOOTER
    App.regions.getRegion('footer').hide().empty();
  },

  // record species
  record() {
    // create new record
    const sample = new Sample();
    const occurrence = new Occurrence();
    sample.addOccurrence(occurrence);
    sample.save().then(() => {
      sample.startGPS();
      appModel.set('draftRecordID', sample.cid);

      // navigate to record edit
      App.trigger('records:edit', sample.cid);
    });
  },
};

export { API as default };
