import Backbone from 'backbone';
import App from 'app';
import radio from 'radio';
import savedSamples from 'saved_samples';
import speciesData from 'species.data';
import MainView from './main_view';
import appModel from '../../common/models/app_model';
import Sample from '../../common/models/sample';
import Occurrence from '../../common/models/occurrence';
import HeaderView from '../../common/views/header_view';

const API = {
  show(id) {
    const speciesCollection = new Backbone.Collection(speciesData);
    const speciesModel = speciesCollection.get(id);

    const mainView = new MainView({
      model: speciesModel,
    });
    mainView.on('sample', () => {
      API.sample(speciesModel);
    });
    const mainRegion = App.regions.getRegion('main');
    if (mainRegion.el.scrollTop) mainRegion.el.scrollTop = 0; // needs to be at the top

    radio.trigger('app:main', mainView);

    // HEADER
    const headerView = new HeaderView({
      id: 'species-account-header',
      model: new Backbone.Model({ title: speciesModel.get('scientific_name') }),

    });

    // HEADER
    radio.trigger('app:header', headerView);

    // FOOTER
    radio.trigger('app:footer:hide');
  },

  // sample species
  sample(speciesModel) {
    // create new sample
    const sample = new Sample();
    const occurrence = new Occurrence();
    occurrence.set('taxon', speciesModel.attributes);
    sample.addOccurrence(occurrence);
    sample.save().then(() => {
      savedSamples.add(sample);

      sample.startGPS();
      appModel.set('draftSampleID', sample.cid);

      // navigate to sample edit
      radio.trigger('samples:edit', sample.cid);
    });
  },
};

export { API as default };
