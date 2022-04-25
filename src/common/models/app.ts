import { set } from 'mobx';
import { Model, ModelAttrs } from '@flumens';
import { genericStore } from './store';

export type SurveyDraftKeys = {
  'draftId:survey'?: string;
};

export interface Attrs extends ModelAttrs, SurveyDraftKeys {
  appSession: number;
  showedWelcome: boolean;
  sendAnalytics: boolean;
  training: boolean;
}

const defaults: Attrs = {
  showedWelcome: false,
  sendAnalytics: true,
  appSession: 0,
  training: false,
};

class AppModel extends Model {
  attrs: Attrs = Model.extendAttrs(this.attrs, defaults);

  resetDefaults() {
    set(this.attrs, {});
    delete this.id;
    return this.save();
  }
}

const appModel = new AppModel({ cid: 'app', store: genericStore });

export { appModel as default, AppModel };
