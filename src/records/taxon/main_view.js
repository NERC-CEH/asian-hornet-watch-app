/** ****************************************************************************
 * Record Show main view.
 *****************************************************************************/
import Marionette from 'marionette';
import JST from 'JST';
import { DateHelp } from 'helpers';
import Gallery from '../../common/gallery';
import './styles.scss';

export default Marionette.View.extend({
  template: JST['records/taxon/main'],

  events: {
    'click img': 'photoView',
  },

  serializeData() {
    const recordModel = this.model.get('recordModel');
    const occ = recordModel.occurrences;

    //todo taxa

    return {

    };
  },
});

