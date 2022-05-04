import { set } from 'mobx';
import { Model, ModelAttrs } from '@flumens';
import { genericStore } from './store';

export type SurveyDraftKeys = {
  'draftId:main': string | null;
};

export interface Attrs extends ModelAttrs, SurveyDraftKeys {
  appSession: number;
  showedWelcome: boolean;
  sendAnalytics: boolean;
  training: boolean;
  showSurveysDeleteTip: boolean;
  showSurveyUploadTip: boolean;
}

const defaults: Attrs = {
  showedWelcome: false,
  sendAnalytics: true,
  showSurveysDeleteTip: true,
  showSurveyUploadTip: true,
  appSession: 0,
  training: false,

  'draftId:main': null,
};

class AppModel extends Model {
  attrs: Attrs = Model.extendAttrs(this.attrs, defaults);

  resetDefaults() {
    set(this.attrs, JSON.parse(JSON.stringify(defaults)));
    delete this.id;
    return this.save();
  }
}

const appModel = new AppModel({ cid: 'app', store: genericStore });

export { appModel as default, AppModel };
