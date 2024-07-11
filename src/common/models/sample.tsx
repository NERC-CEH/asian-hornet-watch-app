import { IObservableArray } from 'mobx';
import { useTranslation } from 'react-i18next';
import {
  device,
  useAlert,
  Sample as SampleOriginal,
  SampleAttrs,
  SampleOptions,
  SampleMetadata,
  ModelValidationMessage,
} from '@flumens';
import config from 'common/config';
import userModel from 'models/user';
import surveyConfig from 'Survey/config';
import appModel from './app';
import Media from './media';
import Occurrence from './occurrence';
import GPSExtension from './sampleGPSExt';
import { modelStore } from './store';

type Attrs = SampleAttrs & {
  date?: any;
  location?: any;

  training?: boolean;

  // anonymous upload
  firstname?: string;
  secondname?: string;
  user_email?: string;
  phone?: string;
};

type Metadata = SampleMetadata & {
  /**
   * Survey name.
   */
  survey: 'survey';

  saved?: boolean;

  // verification
  verification: any;
  verification_substatus: any;
};

export default class Sample extends SampleOriginal<Attrs, Metadata> {
  static fromJSON(json: any) {
    return super.fromJSON(json, Occurrence, Sample, Media);
  }

  declare occurrences: IObservableArray<Occurrence>;

  declare samples: IObservableArray<Sample>;

  declare media: IObservableArray<Media>;

  declare survey: any;

  declare toggleGPStracking: any;

  startGPS: any; // from extension

  isGPSRunning: any; // from extension

  stopGPS: any; // from extension

  constructor(options: SampleOptions) {
    super({ ...options, store: modelStore });

    this.remote.url = `${config.backend.indicia.url}/index.php/services/rest`;
    // eslint-disable-next-line
    // eslint-disable-next-line
    this.remote.headers = async () => {
      const token = this.canUploadAnonymously()
        ? await userModel.getAnonymousToken()
        : await userModel.getAccessToken();

      return {
        Authorization: `Bearer ${token}`,
      };
    };

    this.attrs.training = appModel.attrs.training;

    Object.assign(this, GPSExtension());
    this.survey = surveyConfig;
  }

  destroy(silent?: boolean) {
    this.cleanUp();
    return super.destroy(silent);
  }

  cleanUp = () => {
    this.stopGPS();
    const stopGPS = (smp: Sample) => smp.stopGPS();
    this.samples.forEach(stopGPS);
  };

  getSurvey() {
    return this.survey;
  }

  async upload() {
    if (this.remote.synchronising || this.isUploaded()) return true;

    const invalids = this.validateRemote();
    if (invalids) return false;

    if (!device.isOnline) return false;

    if (!this.canUploadAnonymously()) {
      const isActivated = await userModel.checkActivation();
      if (!isActivated) return false;
    }

    this.cleanUp();
    await this.saveRemote();

    return true;
  }

  canUploadAnonymously() {
    const { user_email, firstname, secondname } = this.attrs;
    return user_email && firstname && secondname;
  }
}

export const useValidateCheck = (sample: Sample) => {
  const alert = useAlert();
  const { t } = useTranslation();

  return () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      alert({
        header: t('Report incomplete'),
        skipTranslation: true,
        message: <ModelValidationMessage {...invalids} />,
        buttons: [
          {
            text: t('Got it'),
            role: 'cancel',
          },
        ],
      });
      return false;
    }
    return true;
  };
};
