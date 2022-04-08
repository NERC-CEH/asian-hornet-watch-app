import CONFIG from 'common/config';
import {
  DrupalUserModel,
  DrupalUserModelAttrs,
  useToast,
  useLoader,
  device,
} from '@flumens';
import * as Yup from 'yup';
import { set } from 'mobx';
import { genericStore } from './store';

export interface Attrs extends DrupalUserModelAttrs {
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

const defaults: Attrs = {
  fullName: '',
  firstName: '',
  lastName: '',
};

class UserModel extends DrupalUserModel {
  attrs: Attrs = DrupalUserModel.extendAttrs(this.attrs, defaults);

  registerSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
  });

  async checkActivation() {
    const isLoggedIn = !!this.attrs.email;
    if (!isLoggedIn) return false;

    if (!this.attrs.verified) {
      try {
        await this.refreshProfile();
      } catch (e) {
        // do nothing
      }

      if (!this.attrs.verified) return false;
    }

    return true;
  }

  async resendVerificationEmail() {
    const isLoggedIn = !!this.attrs.email;
    if (!isLoggedIn || this.attrs.verified) return false;

    await this._sendVerificationEmail();

    return true;
  }

  resetDefaults() {
    super.resetDefaults();
    set(this.attrs, JSON.parse(JSON.stringify(defaults)));
    return this.save();
  }
}

const userModel = new UserModel({
  cid: 'user',
  store: genericStore,
  config: CONFIG.backend,
});

export const useUserStatusCheck = () => {
  const toast = useToast();
  const loader = useLoader();

  const userStatusAlert = async () => {
    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return false;
    }

    if (!userModel.isLoggedIn()) {
      toast.warn('Please log in first.');
      return false;
    }

    if (!userModel.attrs.verified) {
      await loader.show('Please wait...');
      const isVerified = await userModel.checkActivation();
      loader.hide();

      if (!isVerified) {
        toast.warn('The user has not been activated or is blocked.');
        return false;
      }
    }

    return true;
  };
  return userStatusAlert;
};

export { userModel as default, UserModel };
