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

  initialize() {
    const userModel = this.model.get('userModel');
    this.listenTo(userModel, 'logout', this.render);
  },

  serializeData() {
    const userModel = this.model.get('userModel');
    const recordsCollection = this.model.get('recordsCollection');

    let savedRecords = 0;
    recordsCollection.each((record) => {
      const status = record.getSyncStatus();
      if (record.metadata.saved &&
        status === Morel.LOCAL ||
        status === Morel.SYNCHRONISING) {
        savedRecords++;
      }
    });

    let surname;

    if (userModel.hasLogIn()) {
      surname = userModel.get('surname');
    }

    return {
      records: savedRecords,
      surname,
    };
  },

  logout() {
    this.trigger('user:logout');
  },
});
