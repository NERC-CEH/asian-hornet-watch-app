/** ****************************************************************************
 * Location controller.
 *****************************************************************************/
import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import Morel from 'morel';
import { Log, Validate, StringHelp, LocHelp } from 'helpers';
import App from 'app';

import recordManager from '../../record_manager';
import appModel from '../../models/app_model';
import TabsLayout from '../../views/tabs_layout';
import HeaderView from '../../views/header_view';

import GpsView from './gps_view';
import MapView from './map_view';
import GridRefView from './grid_ref_view';
import './styles.scss';

const API = {
  show(recordID) {
    recordManager.get(recordID, (err, recordModel) => {
      // Not found
      if (!recordModel) {
        App.trigger('404:show', { replace: true });
        return;
      }

      // can't edit a saved one - to be removed when record update
      // is possible on the server
      if (recordModel.getSyncStatus() === Morel.SYNCED) {
        App.trigger('records:show', recordID, { replace: true });
        return;
      }

      // MAIN
      const recordLocation = recordModel.get('location') || {};
      const active = {};
      if (!recordLocation.source) {
        active.gps = true;
      } else {
        active[recordLocation.source] = true;
      }
      const mainView = new TabsLayout({
        tabs: [
          {
            active: active.gps,
            id: 'gps',
            title: '<span class="icon icon-location"></span>',
            ContentView: GpsView,
          },
          {
            active: active.map,
            id: 'map',
            title: '<span class="icon icon-map"></span>',
            ContentView: MapView,
          },
          {
            active: active.gridref,
            id: 'grid-ref',
            title: 'GR',
            ContentView: GridRefView,
          },
        ],
        model: new Backbone.Model({ recordModel, appModel }),
        vent: App,
      });

      function onLocationSelect(view, loc, createNew) {
        if (typeof loc !== 'object') {
          // jQuery event object bug fix
          Log('Location:Controller:onLocationSelect: loc is not an object', 'e');
          return;
        }

        let location = loc;
        // we don't need the GPS running and overwriting the selected location
        recordModel.stopGPS();

        if (!createNew) {
          // extend old location to preserve its previous attributes like name or id
          let oldLocation = recordModel.get('location');
          location = $.extend(oldLocation, location);
        }

        recordModel.set('location', location);
        recordModel.trigger('change:location');
      }

      function onGPSClick() {
        // turn off if running
        if (recordModel.isGPSRunning()) {
          recordModel.stopGPS();
        } else {
          recordModel.startGPS();
        }
      }

      function onLocationNameChange(view, name) {
        if (!name || typeof name !== 'string') {
          return;
        }

        const location = recordModel.get('location') || {};
        location.name = StringHelp.escape(name);
        recordModel.set('location', location);
        recordModel.trigger('change:location');
      }

      function onPageExit() {
        recordModel.save(null, {
          success: () => {
            const location = recordModel.get('location') || {};

            if ((location.latitude && location.longitude) || location.name) {
              // save to past locations
              const locationID = appModel.setLocation(recordModel.get('location'));
              location.id = locationID;
              recordModel.set('location', location);
            }

            window.history.back();
          },
          error: (err) => {
            Log(err, 'e');
            App.regions.getRegion('dialog').error(err);
          },
        });
      }

      mainView.on('childview:location:select:map', onLocationSelect);
      mainView.on('childview:location:select:gridref', (view, data) => {
        /**
         * Validates the new location
         * @param attrs
         * @returns {{}}
         */
        function validate(attrs) {
          const errors = {};

          if (!attrs.name) {
            errors.name = "can't be blank";
          }

          if (!attrs.gridref) {
            errors.gridref = "can't be blank";
          } else {
            const gridref = attrs.gridref.replace(/\s/g, '');
            if (!Validate.gridRef(gridref)) {
              errors.gridref = 'invalid';
            } else if (!LocHelp.grid2coord(gridref)) {
              errors.gridref = 'invalid';
            }
          }

          if (!_.isEmpty(errors)) {
            return errors;
          }
        }

        const validationError = validate(data);
        if (!validationError) {
          App.trigger('gridref:form:data:invalid', {}); // update form
          const latLon = LocHelp.grid2coord(data.gridref);
          const location = {
            source: 'gridref',
            name: data.name,
            gridref: data.gridref,
            latitude: parseFloat(latLon.lat.toFixed(8)),
            longitude: parseFloat(latLon.lon.toFixed(8)),
          };

          // -2 because of gridref letters, 2 because this is min precision
          const accuracy = (data.gridref.replace(/\s/g, '').length - 2) || 2;
          location.accuracy = accuracy;

          onLocationSelect(view, location);
          onPageExit();
        } else {
          App.trigger('gridref:form:data:invalid', validationError);
        }
      });
      mainView.on('childview:gps:click', onGPSClick);
      mainView.on('childview:location:name:change', onLocationNameChange);

      App.regions.getRegion('main').show(mainView);

      // HEADER
      const LocationHeader = HeaderView.extend({
        id: 'location-header',

        /*
         From Marionette docs:
         it is suggested that you avoid re-rendering the entire View unless
         absolutely necessary. Instead, if you are binding the View's template
         to a model and need to update portions of the View, you should listen
         to the model's "change" events and only update the necessary DOM elements.
         */
        modelEvents: {
          'change:location': 'updateTitle',
        },

        updateTitle() {
          const title = this.model.printLocation();
          const $title = this.$el.find('h1');

          $title.html(title || 'Location');
        },

        serializeData() {
          return {
            title: this.model.printLocation() || 'Location',
          };
        },
      });

      const headerView = new LocationHeader({
        onExit: onPageExit,
        model: recordModel,
      });

      App.regions.getRegion('header').show(headerView);

      // if exit on selection click
      mainView.on('save', onPageExit);
    });

    // FOOTER
    App.regions.getRegion('footer').hide().empty();
  },
};

export { API as default };
