/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import JST from 'JST';
import './styles.scss';
import './app_logo.png';
import './background.jpg';

export default Marionette.View.extend({
  id: 'home',
  template: JST['info/home/main'],

  triggers: {
    'click #record-btn': 'record',
  },
});
