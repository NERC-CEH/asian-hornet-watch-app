import GPS from 'helpers/GPS';
import { observable } from 'mobx';
import { updateModelLocation } from '@flumens';

const DEFAULT_ACCURACY_LIMIT = 50; // meters

export type LatLng = [number, number];

export type Location = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

type Extension = {
  gps: { locating: null | string };
  setLocation: any;
  toggleGPStracking: any;
  startGPS: any;
  stopGPS: any;
  isGPSRunning: any;
  attrs?: any;
  save?: any;
};

const extension = (): Extension => ({
  gps: observable({ locating: null }),

  setLocation([longitude, latitude]: LatLng, source = 'map', accuracy: number) {
    this.attrs.location = {
      latitude,
      longitude,
      source,
      accuracy,
    };

    return this.save();
  },

  toggleGPStracking(state?: boolean) {
    if (this.isGPSRunning() || state === false) {
      this.stopGPS();
      return;
    }

    this.startGPS();
  },

  async startGPS(accuracyLimit = DEFAULT_ACCURACY_LIMIT) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const options = {
      accuracyLimit,

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onUpdate() {},

      callback(error: Error, location: Location) {
        if (error) {
          that.stopGPS();
          return;
        }
        if (location.accuracy <= options.accuracyLimit) {
          that.stopGPS();
        }

        updateModelLocation(that, location);
      },
    };

    this.gps.locating = await GPS.start(options);
  },

  stopGPS() {
    if (!this.gps.locating) {
      return;
    }

    GPS.stop(this.gps.locating);
    this.gps.locating = null;
  },

  isGPSRunning() {
    return !!this.gps.locating;
  },
});

export { extension as default };
