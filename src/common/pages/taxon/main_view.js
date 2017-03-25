/** ****************************************************************************
 * Taxon main view.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import JST from 'JST';
import './styles.scss';

const View = Marionette.View.extend({
  template: JST['common/taxon/taxon'],

  events: {
    'click input': 'onSelect',
  },

  onSelect() {
    this.trigger('select', this.model.attributes);
  },

  serializeData() {
    const sampleModel = this.options.sampleModel;
    let taxon;
    if (sampleModel) {
      const occ = sampleModel.occurrences.at(0);
      taxon = occ.get('taxon') || {};
    }

    return {
      id: this.model.id,
      name: this.model.get('common_name'),
      pic: `${this.model.id}_0.jpg`,
      selected: taxon && taxon.id === this.model.id,
      sampleModel,
    };
  },
});

export default Marionette.CompositeView.extend({
  id: 'taxon-main',
  template: JST['common/taxon/main'],
  childViewContainer: '#species-list',

  tagName: 'div',
  className: 'list',
  childView: View,

  childViewOptions() {
    return {
      sampleModel: this.options.sampleModel,
    };
  },
});
