/** ****************************************************************************
 * Morel Sample.
 *****************************************************************************/
import $ from 'jquery';
import _ from 'lodash';
import Morel from 'morel';
import CONFIG from 'config';
import recordManager from '../record_manager';
import Occurrence from './occurrence';
import GeolocExtension from './sample_geoloc_ext';

let Sample = Morel.Sample.extend({
  constructor(...args) {
    this.manager = recordManager;
    Morel.Sample.prototype.constructor.apply(this, args);
    this.set('form', CONFIG.morel.manager.input_form);
  },

  Occurrence,

  validate(attributes) {
    const attrs = _.extend({}, this.attributes, attributes);

    const sample = {};
    const occurrences = {};

    // todo: remove this bit once sample DB update is possible
    // check if saved
    if (!this.metadata.saved) {
      sample.send = false;
    }

    // location
    const location = attrs.location || {};
    if (!location.latitude || !location.longitude) {
      sample.location = 'missing';
    }
    // location name
    if (!location.name) {
      sample['location name'] = 'missing';
    }

    // date
    if (!attrs.date) {
      sample.date = 'missing';
    } else {
      const date = new Date(attrs.date);
      if (date === 'Invalid Date' || date > new Date()) {
        sample.date = (new Date(date) > new Date()) ? 'future date' : 'invalid';
      }
    }

    // location type
    if (!attrs.location_type) {
      sample.location_type = 'can\'t be blank';
    }

    // occurrences
    if (this.occurrences.length === 0) {
      sample.occurrences = 'no species selected';
    } else if (!this.occurrences.at(0).get('taxon')) {
      sample.occurrences = 'no species selected';
    }

    if (!_.isEmpty(sample) || !_.isEmpty(occurrences)) {
      const errors = {
        sample,
        occurrences,
      };
      return errors;
    }

    return null;
  },

  /**
   * Set the record for submission and send it.
   */
  setToSend(callback) {
    this.metadata.saved = true;

    if (!this.isValid()) {
      // since the sample was invalid and so was not saved
      // we need to revert it's status
      this.metadata.saved = false;
      return false;
    }

    // save record
    const promise = this.save(null, {
      success: () => {
        callback && callback();
      },
      error: (err) => {
        callback && callback(err);
      },
    });

    return promise;
  },

  isLocalOnly() {
    const status = this.getSyncStatus();
    if (this.metadata.saved && (
      status === Morel.LOCAL ||
      status === Morel.SYNCHRONISING)) {
      return true;
    }
    return false;
  },
});

// add geolocation functionality
Sample = Sample.extend(GeolocExtension);

$.extend(true, Morel.Sample.keys, CONFIG.morel.sample);
export { Sample as default };
