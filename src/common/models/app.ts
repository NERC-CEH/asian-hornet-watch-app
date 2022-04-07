import { Model, ModelAttrs } from '@flumens';
import { genericStore } from './store';

export interface Attrs extends ModelAttrs {
  appSession: number;
  showedWelcome: boolean;
  sendAnalytics: boolean;
}

const defaults: Attrs = {
  showedWelcome: false,
  sendAnalytics: true,
  appSession: 0,
};

class AppModel extends Model {
  attrs: Attrs = Model.extendAttrs(this.attrs, defaults);
}

const appModel = new AppModel({ cid: 'app', store: genericStore });

export { appModel as default, AppModel };
