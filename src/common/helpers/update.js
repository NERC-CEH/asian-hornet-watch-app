/** ****************************************************************************
 * App update functionality.
 *****************************************************************************/

import radio from 'radio';
import CONFIG from 'config';
import savedSamples from 'saved_samples';
import appModel from 'app_model';
import userModel from 'user_model';
import Log from './log';
import Analytics from './analytics';

const MIN_UPDATE_TIME = 5000; // show updating dialog for minimum seconds

/**
 * https://gist.github.com/alexey-bass/1115557
 * Simply compares left version to right one.
 *
 * Example:
 * versionCompare('1.1', '1.2') => -1
 * versionCompare('1.1', '1.1') =>  0
 * versionCompare('1.2', '1.1') =>  1
 * versionCompare('2.23.3', '2.22.3') => 1
 *
 * Returns:
 * -1 = left is LOWER than right
 *  0 = they are equal
 *  1 = left is GREATER = right is LOWER
 *  And FALSE if one of input versions are not valid
 *
 * @function
 * @param {String} left  Version #1
 * @param {String} right Version #2
 * @return {Integer|Boolean}
 * @author Alexey Bass (albass)
 * @since 2011-07-14
 */
function versionCompare(left, right) {
  if (typeof left + typeof right !== 'stringstring')
    return false;

  let a = left.split('.')
    , b = right.split('.')
    , i = 0, len = Math.max(a.length, b.length);

  for (; i < len; i++) {
    if ((a[i] && !b[i] && parseInt(a[i], 10) > 0) || (parseInt(a[i], 10) > parseInt(b[i], 10))) {
      return 1;
    } else if ((b[i] && !a[i] && parseInt(b[i], 10) > 0) || (parseInt(a[i], 10) < parseInt(b[i], 10))) {
      return -1;
    }
  }

  return 0;
}

const API = {
  /**
   * Main update function.
   */
  run(callback, silent = false) {
    const currentVersion = appModel.get('appVersion');
    const newVersion = CONFIG.version;

    if (currentVersion !== newVersion) {
      // todo: check for backward downgrade
      // set new app version
      API._updateAppVersion(currentVersion, newVersion);

      // first install
      if (!currentVersion) callback();

      // find first update
      const firstUpdate = API._findFirst(API.updatesSeq, currentVersion);
      if (firstUpdate < 0) return callback(); // no update for this version

      // hide loader
      if (navigator && navigator.splashscreen) {
        navigator.splashscreen.hide();
      }

      if (!silent) {
        radio.trigger('app:dialog:show', {
          title: 'Updating',
          body: 'This should take only a moment...',
          hideAllowed: false,
        });
      }
      const startTime = Date.now();

      // apply all updates
      return API._applyUpdates(firstUpdate, (error) => {
        if (error) {
          if (!silent) {
            radio.trigger('app:dialog:error', 'Sorry, an error has occurred while updating the app');
          }
          return null;
        }

        const timeDiff = (Date.now() - startTime);
        if (timeDiff < MIN_UPDATE_TIME) {
          setTimeout(() => {
            if (!silent) {
              radio.trigger('app:dialog:hide', true);
            }
            callback();
          }, MIN_UPDATE_TIME - timeDiff);
        } else {
          if (!silent) {
            radio.trigger('app:dialog:hide', true);
          }
          callback();
        }
        return null;
      });
    }

    callback();
    return null;
  },

  /**
   * The sequence of updates that should take place.
   * @type {string[]}
   */
  updatesSeq: [],

  /**
   * Update functions.
   * @type {{['1.1.0']: (())}}
   */
  updates: {},

  /**
   * Returns the index of the first found update in sequence.
   * @param updatesSeq
   * @param currentVersion
   * @returns {number}
   * @private
   */
  _findFirst(updatesSeq = API.updatesSeq, currentVersion) {
    if (!updatesSeq.length) return -1;

    let firstVersion = -1;
    API.updatesSeq.some((version, index) => {
      if (versionCompare(version, currentVersion) === 1) {
        firstVersion = index;
        return true;
      }
      return null;
    });

    return firstVersion;
  },

  /**
   * Recursively apply all updates.
   * @param updateIndex
   * @param callback
   * @private
   */
  _applyUpdates(updateIndex, callback) {
    const update = API.updates[API.updatesSeq[updateIndex]];

    if (typeof update !== 'function') {
      Log('Update: error with update function.', 'e');
      return callback();
    }

    let fullRestartRequired = false;
    return update((error, _fullRestartRequired) => {
      if (error) {
        callback(error);
        return null;
      }

      if (_fullRestartRequired) {
        fullRestartRequired = true;
      }

      // check if last update
      if ((API.updatesSeq.length - 1) <= updateIndex) {
        if (!fullRestartRequired) {
          return callback();
        }
        radio.trigger('app:restart');
        return null;
      }

      API._applyUpdates(updateIndex + 1, callback);
      return null;
    });
  },

  _updateAppVersion(currentVersion, newVersion) {
    appModel.set('appVersion', newVersion);
    appModel.save();

    // log only updates and not init as no prev value on init
    if (currentVersion) {
      Analytics.trackEvent('App', 'updated');
    }
  },
};

export default API;
