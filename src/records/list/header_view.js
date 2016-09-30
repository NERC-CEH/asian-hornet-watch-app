/** ****************************************************************************
 * Record List header view.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import JST from 'JST';

export default Marionette.View.extend({
  id: 'records-header',
  tagName: 'nav',
  template: JST['records/list/header'],

  events: {
    'click a[data-rel="back"]': 'navigateBack',
  },

  navigateBack() {
    window.history.back();
  },
});

