/** ****************************************************************************
 * Main app configuration file.
 *****************************************************************************/
import { DateHelp } from 'helpers';

const rangeValues = {
  '< 1% (1-2 indivs)': 3648,
  '< 1% (several indivs)': 3649,
  '1-4%': 3650,
  '5-10%': 3651,
  '11-25%': 3652,
  '26-33%': 3653,
  '34-50%': 3654,
  '51-75%': 3655,
  '76-90%': 3656,
  '91-100%': 3657,
};

export default {
  // variables replaced on build
  /* global APP_VERSION, APP_BUILD, APP_NAME, REGISTER_URL,
   REPORT_URL, RECORD_URL, APP_SECRET */
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
      appname: 'hornets-watch',
      appsecret: APP_SECRET,
      website_id: 109,
      survey_id: 195,
      input_form: 'enter-app-record',
    },
    sample: {
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

          return location.latitude + ', ' + location.longitude;
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

      device_version: { id: 759 },

      date: {
        values(date) {
          return DateHelp.print(date);
        },
      },

      group: {
        values(group) {
          return group.id;
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
        id: 16,
      },
      'number-ranges': {
        id: 523,
        values: {
          'default': 671,
          '1': 665,
          '2-5': 666,
          '6-20': 667,
          '21-100': 668,
          '101-500': 669,
          '500+': 670,
        },
      },
      stage: {
        id: 106,
        values: {
          'default': 1949,
          'Adult': 1950,
          'Pre-adult': 1951,
          'Other': 1952,
        },
      },
      identifiers: {
        id: 18,
      },
    },
  },
};

