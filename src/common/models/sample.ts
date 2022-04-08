import { device, getDeepErrorMessage, useAlert } from '@flumens';
import Sample, { Attrs as SampleAttrs } from '@bit/flumens.apps.models.sample';
import userModel from 'models/user';
import { modelStore } from './store';
import Occurrence from './occurrence';
import Media from './image';

type Attrs = SampleAttrs;

class AppSample extends Sample {
  static fromJSON(json: any) {
    return super.fromJSON(json, Occurrence, AppSample, Media);
  }

  attrs: Attrs = this.attrs;

  occurrences: Occurrence[] = this.occurrences;

  samples: AppSample[] = this.samples;

  media: Media[] = this.media;

  store = modelStore;

  // eslint-disable-next-line
  destroy = () => super.destroy();

  async upload() {
    if (this.remote.synchronising || this.isUploaded()) return true;

    const invalids = this.validateRemote();
    if (invalids) return false;

    if (!device.isOnline) return false;

    const isActivated = await userModel.checkActivation();
    if (!isActivated) return false;

    this.saveRemote();

    return true;
  }
}

export const useValidateCheck = (sample: AppSample) => {
  const alert = useAlert();

  const validateAlert = () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      alert({
        header: 'Survey incomplete',
        message: getDeepErrorMessage(invalids),
        buttons: [
          {
            text: 'Got it',
            role: 'cancel',
          },
        ],
      });
      return false;
    }
    return true;
  };

  return validateAlert;
};

export default AppSample;
