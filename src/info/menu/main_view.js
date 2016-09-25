/** ****************************************************************************
 * Info Menu main view.
 *****************************************************************************/

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

  serializeDate() {
    return {
      surname: this.model.get('surname'),
    };
  },

  logout() {
    this.trigger('user:logout');
  },
});
