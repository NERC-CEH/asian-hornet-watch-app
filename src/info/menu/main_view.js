/** ****************************************************************************
 * Info Menu main view.
 *****************************************************************************/

import Morel from 'morel';
import Marionette from 'backbone.marionette';
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
    let needSync = false;
    recordsCollection.each((record) => {
      if (record.isLocalOnly()) needSync = true;
      if (record.metadata.saved) savedRecords++;
    });

    let surname;

    if (userModel.hasLogIn()) {
      surname = userModel.get('surname');
    }

    return {
      records: savedRecords,
      needSync,
      surname,
    };
  },

  logout() {
    this.trigger('user:logout');
  },
});
