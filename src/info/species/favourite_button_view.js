/** ****************************************************************************
 * Record List header view.
 *****************************************************************************/
import Marionette from 'marionette';
import JST from '../../../JST';

export default Marionette.ItemView.extend({
  template: JST['species/account/favourite_button'],

  events: {
    'click #favourite-btn': 'toggleFavourite',
  },

  modelEvents: {
    'change:favourite': 'render',
  },

  toggleFavourite(e) {
    this.trigger('click', e);
  },

  serializeData() {
    return {
      favourite: this.model.isFavouriteSpecies(this.options.speciesID),
    };
  },
});

