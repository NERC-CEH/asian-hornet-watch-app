import Indicia from 'indicia';
import Log from 'helpers/log';
import Sample from 'sample';
import store from './store';

const Collection = Indicia.Collection.extend({
  store,
  model: Sample,

  removeAllSynced() {
    Log('SavedSamples: removing all synced samples.');

    const toWait = [];
    this.models.forEach((sample) => {
      if (sample.getSyncStatus() === Indicia.SYNCED) {
        toWait.push(sample.destroy());
      }
    });

    return Promise.all(toWait);
  },

  syncAll() {
    Log('SavedSamples: setting all samples to send.');

    this.models
      .filter(sample => sample.metadata.saved && sample.isLocalOnly())
      .forEach(sample => sample.save(null, { remote: true }));
    // no promise return since we don't want wait till all are submitted
    // as this can be done in the background
    return Promise.resolve();
  },
});

const savedSamples = new Collection();
Log('SavedSamples: fetching all samples.');

// load all the samples from storage
savedSamples.fetching = true;
savedSamples
  .fetch()
  .then(() => {
    Log('SavedSamples: fetching all samples done.');

    savedSamples.fetching = false;
    savedSamples.trigger('fetching:done');
  })
  .catch((err) => {
    Log(err, 'e');

    savedSamples.fetching = false;
    savedSamples.trigger('fetching:error');
  });

export { savedSamples as default, Collection };
