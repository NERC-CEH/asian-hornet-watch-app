/** ****************************************************************************
 * Taxon controller.
 *****************************************************************************/
import Backbone from 'backbone';
import App from 'app';
import radio from 'radio';
import speciesData from 'species.data';
import Log from 'helpers/log';
import savedSamples from 'saved_samples';
import MainView from './main_view';
import HeaderView from '../../views/header_view';

const API = {
  show(sampleID) {
    Log('Records:Taxon:Controller: showing');

    const that = this;
    this.id = sampleID;

    if (sampleID) {
      // wait till savedSamples is fully initialized
      if (savedSamples.fetching) {
        savedSamples.once('fetching:done', () => {
          API.show.apply(that, [sampleID]);
        });
        return;
      }

      // check if the sample has taxon specified
      const sample = savedSamples.get(sampleID);
      // Not found
      if (!sample) {
        Log('No sample model found.', 'e');
        radio.trigger('app:404:show', { replace: true });
        return;
      }

      // MAIN
      const speciesCollection = new Backbone.Collection(speciesData);
      const mainView = new MainView({
        collection: speciesCollection,
        sampleModel: sample,
      });

      mainView.on('childview:select', (taxon) => {
        API.save(sample, taxon);
      });

      const mainRegion = App.regions.getRegion('main');
      if (mainRegion.el.scrollTop) mainRegion.el.scrollTop = 0; // needs to be at the top
      radio.trigger('app:main', mainView);
    } else {
      // MAIN
      const speciesCollection = new Backbone.Collection(speciesData);
      const mainView = new MainView({
        collection: speciesCollection,
      });

      const mainRegion = App.regions.getRegion('main');
      if (mainRegion.el.scrollTop) mainRegion.el.scrollTop = 0; // needs to be at the top
      radio.trigger('app:main', mainView);
    }

// HEADER
    const headerView = new HeaderView({
      model: new Backbone.Model({
        title: 'Species',
      }),
    });
    radio.trigger('app:header', headerView);

// FOOTER
    radio.trigger('app:footer:hide');
  },

  save(recordModel, taxon) {
    const occ = recordModel.occurrences.at(0);
    occ.set('taxon', taxon).save()
      .then(() => {
        window.history.back();
      });
  },
};

export { API as default };
