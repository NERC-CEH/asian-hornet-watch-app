/** ****************************************************************************
 * Record Show main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'backbone.marionette';
import JST from 'JST';
import './styles.scss';

const View = Marionette.View.extend({
  template: JST['records/taxon/main'],

  events: {
    'click input': 'onSelect',
  },

  onSelect() {
    this.trigger('select', this.model.attributes);
  },

  serializeData() {
    const recordModel = this.options.recordModel;
    const occ = recordModel.occurrences.at(0);

    const taxon = occ.get('taxon') || {};

    const other = !this.model.get('description');

    return {
      id: this.model.id,
      name: this.model.get('common_name'),
      pic: this.model.get('photo')[0],
      selected: taxon.id === this.model.id,
      other,
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
