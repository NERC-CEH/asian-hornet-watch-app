import { Geolocation, Position } from '@capacitor/geolocation';

type Options = {
  callback: any;
  onUpdate?: any;
  accuracyLimit?: any;
};

const GPS_ACCURACY_LIMIT = 100; // meters

const API = {
  running: false,

  start({ callback, onUpdate, accuracyLimit = GPS_ACCURACY_LIMIT }: Options) {
    // geolocation config
    const GPSoptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 60000,
    };

    const onPosition = (position: Position | null, err: Error) => {
      if (err) {
        callback && callback(new Error(err.message));
        return;
      }

      if (!position) return;

      const location = {
        latitude: position.coords.latitude.toFixed(8),
        longitude: position.coords.longitude.toFixed(8),
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
      };

      if (location.accuracy <= accuracyLimit) {
        callback && callback(null, location);
      } else {
        onUpdate && onUpdate(location);
      }
    };

    return Geolocation.watchPosition(GPSoptions, onPosition);
  },

  stop(id: string) {
    Geolocation.clearWatch({ id });
  },
};

export default API;
