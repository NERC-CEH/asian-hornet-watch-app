import { device, getDeepErrorMessage, useAlert } from '@flumens';
import Sample, { Attrs as SampleAttrs } from '@bit/flumens.apps.models.sample';
import userModel from 'models/user';
import surveyConfig from 'Survey/config';
import { modelStore } from './store';
import Occurrence from './occurrence';
import GPSExtension from './sampleGPSExt';
import Media from './image';

type Attrs = SampleAttrs & {
  location?: any;
  date?: string;
};

class AppSample extends Sample {
  static fromJSON(json: any) {
    return super.fromJSON(json, Occurrence, AppSample, Media);
  }

  isGPSRunning: any;

  gpsExtensionInit: any;

  attrs: Attrs = this.attrs;

  occurrences: Occurrence[] = this.occurrences;

  samples: AppSample[] = this.samples;

  media: Media[] = this.media;

  store = modelStore;

  constructor(args: any) {
    super(args);

    this.survey = surveyConfig;
    Object.assign(this, GPSExtension());
  }

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
