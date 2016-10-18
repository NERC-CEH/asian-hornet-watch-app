/** ****************************************************************************
 * App model. Persistent.
 *****************************************************************************/
import Backbone from 'backbone';
import Store from 'backbone.localstorage';
import CONFIG from 'config';
import pastLocationsExtension from './app_model_past_loc_ext';

let AppModel = Backbone.Model.extend({
  id: 'app',

  defaults: {
    exceptions: [],

    locations: [],
    autosync: true,
    useGridRef: true,
    useGridMap: true,
    useTraining: process.env.TRAINING,
  },

  localStorage: new Store(CONFIG.name),

  /**
   * Initializes the object.
   */
  initialize() {
    this.fetch();
  },
});

// add previous/pased saved locations management
AppModel = AppModel.extend(pastLocationsExtension);

const appModel = new AppModel();
export { appModel as default, AppModel };
