/** ****************************************************************************
 * Info Menu main view.
 *****************************************************************************/

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
      login: userModel.hasLogIn(),
      firstname: userModel.get('firstname'),
      secondname: userModel.get('secondname'),    };
  },

  logout() {
    this.trigger('user:logout');
  },
});
