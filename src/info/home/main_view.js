/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import JST from 'JST';
import './styles.scss';
import './app_logo.png';
import './background.jpg';

export default Marionette.View.extend({
  id: 'home',
  template: JST['info/home/main'],

  triggers: {
    'click #record-btn': 'record',
  },

  initialize() {
    const recordsCollection = this.model.get('recordsCollection');
    this.listenTo(recordsCollection, 'sync', this.render);
  },

  serializeData() {
    const recordsCollection = this.model.get('recordsCollection');

    let savedRecords = 0;
    let needSync = false;
    recordsCollection.each((record) => {
      if (record.isLocalOnly()) needSync = true;
      if (record.metadata.saved) savedRecords++;
    });

    return {
      records: savedRecords,
      needSync,
    };
  },

});
