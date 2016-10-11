/** ****************************************************************************
 * Record Show controller.
 *****************************************************************************/
import Backbone from 'backbone';
import App from 'app';
import { Log } from 'helpers';
import recordManager from '../../record_manager';
import MainView from './main_view';
import HeaderView from '../../views/header_view';
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
        collection: speciesCollection,
        recordModel,
      });

      mainView.on('childview:select', (taxon) => {
        API.save(recordModel, taxon);
      });

      const mainRegion = App.regions.getRegion('main');
      mainRegion.el.scrollTop = 0; // needs to be at the top
      mainRegion.show(mainView);
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
