import { Model, ModelAttrs } from '@flumens';
import { mainStore } from './store';

export type SurveyDraftKeys = {
  'draftId:main': string | null;
};

export type Attrs = {
  appSession: number;
  showedWelcome: boolean;
  sendAnalytics: boolean;
  training: boolean;
  showSurveysDeleteTip: boolean;
  showSurveyUploadTip: boolean;
} & ModelAttrs &
  SurveyDraftKeys;

const defaults: Attrs = {
  showedWelcome: false,
  sendAnalytics: true,
  showSurveysDeleteTip: true,
  showSurveyUploadTip: true,
  appSession: 0,
  training: false,

  'draftId:main': null,
};

export class AppModel extends Model<Attrs> {
  constructor(options: any) {
    super({ ...options, data: { ...defaults, ...options.data } });
  }

  resetDefaults() {
    return super.reset(defaults);
  }
}

const appModel = new AppModel({ cid: 'app', store: mainStore });

export default appModel;
