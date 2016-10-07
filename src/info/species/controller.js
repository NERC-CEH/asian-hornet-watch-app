import Backbone from 'backbone';
import App from 'app';
import MainView from './main_view';
import appModel from '../../common/models/app_model';
import Sample from '../../common/models/sample';
import Occurrence from '../../common/models/occurrence';
import HeaderView from '../../common/views/header_view';
import speciesData from 'species.data';

const API = {
  show(id) {
    const speciesCollection = new Backbone.Collection(speciesData);
    const speciesModel = speciesCollection.get(id);

    const mainView = new MainView({
      model: speciesModel,
    });
    mainView.on('record', () => {
      API.record(speciesModel);
    });
    const mainRegion = App.regions.getRegion('main');
    mainRegion.el.scrollTop = 0; // needs to be at the top
    mainRegion.show(mainView);

    // HEADER
    const headerView = new HeaderView({
      id: 'species-account-header',
      model: new Backbone.Model({ title: speciesModel.get('scientific_name') }),
    });

    App.regions.getRegion('header').show(headerView);

    // FOOTER
    App.regions.getRegion('footer').hide().empty();
  },

  // record species
  record(speciesModel) {
    // create new record
    const sample = new Sample();
    const occurrence = new Occurrence();
    occurrence.set('taxon', speciesModel.attributes);
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
