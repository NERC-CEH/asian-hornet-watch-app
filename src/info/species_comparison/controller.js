/** ****************************************************************************
 * sample Show controller.
 *****************************************************************************/
import Backbone from 'backbone';
import App from 'app';
import Log from 'helpers/log';
import MainView from './main_view';
import HeaderView from '../../common/views/header_view';

const API = {
  show() {
    Log('samples:Taxon:Controller: showing');

    // MAIN
    const mainView = new MainView();

    const mainRegion = App.regions.getRegion('main');
    if (mainRegion.el.scrollTop) mainRegion.el.scrollTop = 0; // needs to be at the top
    mainRegion.show(mainView);

    // HEADER
    const headerView = new HeaderView({
      model: new Backbone.Model({
        title: 'Comparison',
      }),
    });
    App.regions.getRegion('header').show(headerView);

    // FOOTER
    App.regions.getRegion('footer').hide().empty();
  },
};

export { API as default };
