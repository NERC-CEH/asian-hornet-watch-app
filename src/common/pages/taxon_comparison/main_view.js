/** ****************************************************************************
 * Record Show main view.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import JST from 'JST';
import './styles.scss';

export default Marionette.View.extend({
  template: JST['common/taxon_comparison/main'],

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
