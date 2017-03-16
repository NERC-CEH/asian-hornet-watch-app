/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import JST from 'JST';
import './styles.scss';
import './images/app_logo.png';
import './images/background.png';

export default Marionette.View.extend({
  id: 'home',
  template: JST['info/home/main'],

  triggers: {
    'click #sample-btn': 'sample',
  },

  initialize() {
    const savedSamples = this.model.get('savedSamples');
    this.listenTo(savedSamples, 'sync', this.render);
  },

  serializeData() {
    const savedSamples = this.model.get('savedSamples');

    let savedsamples = 0;
    let needSync = false;
    savedSamples.each((sample) => {
      if (sample.isLocalOnly()) needSync = true;
      if (sample.metadata.saved) savedsamples++;
    });

    return {
      samples: savedsamples,
      needSync,
    };
  },

});
