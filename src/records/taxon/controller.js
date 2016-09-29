/** ****************************************************************************
 * Record Show controller.
 *****************************************************************************/
import Backbone from 'backbone';
import App from 'app';
import { Log } from 'helpers';
import appModel from '../../common/models/app_model';
import recordManager from '../../common/record_manager';
import MainView from './main_view';
import HeaderView from '../../common/views/header_view';
import speciesData from 'species.data';

const API = {
  show(id) {
    Log('Records:Taxon:Controller: showing');
    recordManager.get(id, (err, recordModel) => {
      if (err) {
        Log(err, 'e');
      }

      // Not found
      if (!recordModel) {
        Log('No record model found', 'e');
        App.trigger('404:show', { replace: true });
        return;
      }

      // MAIN
      const speciesCollection = new Backbone.Collection(speciesData);
      const mainView = new MainView({
        model: new Backbone.Model({ recordModel, appModel, speciesCollection }),
      });

      mainView.on('select', (taxon) => {
        API.save(recordModel, taxon);
      });

      App.regions.getRegion('main').show(mainView);
    });

    // HEADER
    const headerView = new HeaderView({
      model: new Backbone.Model({
        title: 'Species',
      }),
    });
    App.regions.getRegion('header').show(headerView);

    // FOOTER
    App.regions.getRegion('footer').hide().empty();
  },

  save(recordModel, taxon) {
    const occ = recordModel.occurrences.at(0);
    occ.set('taxon', taxon).save()
      .then(() => {
        window.history.back();
      });
  },
};

export { API as default };
