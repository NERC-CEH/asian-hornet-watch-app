/** ****************************************************************************
 * Main app configuration file.
 *****************************************************************************/
import { DateHelp, LocHelp } from 'helpers';

export default {
  // variables replaced on build
  /* global APP_VERSION, APP_BUILD, APP_NAME, REGISTER_URL, API_KEY, API_SECRET,
   REPORT_URL, STATISTICS_URL, RECORD_URL, APP_SECRET */
  version: APP_VERSION,
  build: APP_BUILD,
  name: APP_NAME,

  gps_accuracy_limit: 100,

  // logging
  log: {
    states: ['e', 'w', 'i', 'd'], // see log helper
    ga_error: true,
  },

  // google analytics
  ga: {
    status: true,
    ID: 'UA-58378803-8',
  },

  login: {
    url: REGISTER_URL,
    timeout: 30000,
  },

  report: {
    url: REPORT_URL,
    timeout: 80000,
  },

  statistics: {
    url: STATISTICS_URL,
  },

  // mapping
  map: {
    os_api_key: '28994B5673A86451E0530C6CA40A91A5',
    mapbox_api_key: 'pk.eyJ1IjoiY2VoYXBwcyIsImEiOiJjaXBxdTZyOWYwMDZoaWVuYjI3Y3Z0a2x5In0.YXrZA_DgWCdjyE0vnTCrmw',
    mapbox_osm_id: 'cehapps.0fenl1fe',
    mapbox_satellite_id: 'cehapps.0femh3mh',
  },

  // morel configuration
  morel: {
    manager: {
      url: RECORD_URL,
      appname: API_KEY,
      appsecret: API_SECRET,
      website_id: 23,
      survey_id: 417,
      input_form: 'enter-app-record',
    },
    sample: {
      // anonymouse user info
      name: {
        id: 6,
      },
      surname: {
        id: 7,
      },
      email: {
        id: 8,
      },

      location: {
        values(location, options) {
          // convert accuracy for map and gridref sources
          let accuracy = location.accuracy;
          if (location.source !== 'gps') {
            if (location.source === 'map') {
              accuracy = LocHelp.mapZoom2meters(location.accuracy);
            } else {
              accuracy = null;
            }
          }

          const attributes = {
            location_name: location.name,
            location_source: location.source,
            location_gridref: location.gridref,
            location_altitude: location.altitude,
            location_altitude_accuracy: location.altitudeAccuracy,
            location_accuracy: accuracy,
          };

          // add other location related attributes
          options.flattener(attributes, options);

          return `${location.latitude}, ${location.longitude}`;
        },
      },
      location_accuracy: { id: 282 },
      location_altitude: { id: 283 },
      location_altitude_accuracy: { id: 284 },
      location_source: { id: 760 },
      location_gridref: { id: 335 },

      device: {
        id: 273,
        values: {
          iOS: 2398,
          Android: 2399,
        },
      },

      device_version: { id: 579 },

      date: {
        values(date) {
          return DateHelp.print(date);
        },
      },
    },
    occurrence: {
      taxon: {
        values(taxon) {
          return taxon.warehouse_id;
        },
      },
      number: {
        id: 523,
        values: {
          default: 671,
          1: 665,
          '2-5': 666,
          '6-20': 667,
          '21-100': 668,
          '101-500': 669,
          '500+': 670,
        },
      },
    },
  },
};

