/** ****************************************************************************
 * Record Show main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import JST from 'JST';
import './styles.scss';

export default Marionette.View.extend({
  id: 'taxon-main',
  template: JST['records/taxon/main'],

  events: {
    'click input': 'onSelect',
  },

  onSelect(e) {
    const id = $(e.target).val();
    const speciesCollection = this.model.get('speciesCollection');
    const taxon = speciesCollection.models[parseInt(id) - 1];
    if (!taxon)  return;

    this.trigger('select', taxon.attributes);
  },

  serializeData() {
    const recordModel = this.model.get('recordModel');
    const speciesCollection = this.model.get('speciesCollection');
    const occ = recordModel.occurrences.at(0);

    const pics = [];

    speciesCollection.each((species) => {
      const photos = species.get('photo');
      pics.push(photos[0]);
    });

    const data = {
      pics,
    };

    const taxon = occ.get('taxon');
    if (taxon) {
      data[taxon.id] = true;
    }
    return data;
  },
});

