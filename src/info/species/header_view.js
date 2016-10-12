/** ****************************************************************************
 * Record List header view.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import JST from 'JST';

export default Marionette.View.extend({
  id: 'species-account-header',
  tagName: 'nav',
  template: JST['info/species/header'],

  events: {
    'click a[data-rel="back"]': 'navigateBack',
  },

  navigateBack() {
    window.history.back();
  },
});