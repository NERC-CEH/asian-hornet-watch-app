/** ****************************************************************************
 * Record Show main view.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import JST from 'JST';
import './styles.scss';
import './images/loader';

export default Marionette.View.extend({
  id: 'species-comparison',
  template: JST['info/species_comparison/main'],
});
