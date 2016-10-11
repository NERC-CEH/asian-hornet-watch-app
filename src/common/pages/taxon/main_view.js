/** ****************************************************************************
 * Record Show main view.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import JST from 'JST';
import './styles.scss';

const View = Marionette.View.extend({
  template: JST['common/taxon/main'],

  events: {
    'click input': 'onSelect',
  },

  onSelect() {
    this.trigger('select', this.model.attributes);
  },

  serializeData() {
    const recordModel = this.options.recordModel;
    let taxon;
    if (recordModel) {
      const occ = recordModel.occurrences.at(0);
      taxon = occ.get('taxon') || {};
    }

    return {
      id: this.model.id,
      name: this.model.get('common_name'),
      pic: `${this.model.id}_0.jpg`,
      selected: taxon && taxon.id === this.model.id,
      recordModel,
    };
  },
});

export default Marionette.CollectionView.extend({
  id: 'taxon-main',
  tagName: 'div',
  className: 'list',
  childView: View,

  childViewOptions() {
    return {
      recordModel: this.options.recordModel,
    };
  },
});
