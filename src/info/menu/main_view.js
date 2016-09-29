/** ****************************************************************************
 * Info Menu main view.
 *****************************************************************************/

import Morel from 'morel';
import Marionette from 'marionette';
import JST from 'JST';
import './styles.scss';

export default Marionette.View.extend({
  tagName: 'ul',
  className: 'table-view buttons',

  template: JST['info/menu/main'],

  events: {
    'click #logout-button': 'logout',
  },

  modelEvents: {
    change: 'render',
  },

  serializeData() {
    const userModel = this.model.get('userModel');
    const recordsCollection = this.model.get('recordsCollection');

    let savedRecords = 0;
    recordsCollection.each((record) => {
      const status = record.getSyncStatus();
      if (status === Morel.LOCAL ||
        status === Morel.SYNCHRONISING) {
        savedRecords++;
      }
    });

    return {
      records: savedRecords,
      surname: userModel.get('surname'),
    };
  },

  logout() {
    this.trigger('user:logout');
  },
});
