import CONFIG from 'common/config';
import {
  DrupalUserModel,
  DrupalUserModelAttrs,
  useToast,
  useLoader,
} from '@flumens';
import * as Yup from 'yup';
import { set } from 'mobx';
import { genericStore } from './store';

export interface Attrs extends DrupalUserModelAttrs {
  firstName?: string;
  lastName?: string;
  id?: number | null;
}

const defaults: Attrs = {
  firstName: '',
  lastName: '',
  id: null,
};

export const hasValidContactDetails = (details: any) => {
  try {
    Yup.object()
      .shape({
        email: Yup.string().email().required(),
        firstname: Yup.string().required(),
        secondname: Yup.string().required(),
        phone: Yup.string(),
      })
      .validateSync(details, {
        abortEarly: false,
      });
  } catch (attrError) {
    return false;
  }

  return true;
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

/**
 * Migrate from Indicia API auth to JWT. Remove in the future versions.
 */
const migrateOldAuth = async () => {
  if (userModel.isLoggedIn()) return;

  const OLD_USER_MODEL_KEY = 'asian-hornet-watch-user';

  let password;
  let email;
  try {
    const oldUserString = localStorage.getItem(OLD_USER_MODEL_KEY);
    const oldUser = oldUserString ? JSON.parse(oldUserString) : {};
    password = oldUser.password;
    email = oldUser.email;
  } catch (error) {
    localStorage.removeItem(OLD_USER_MODEL_KEY);
    return;
  }

  if (!email || !password) {
    localStorage.removeItem(OLD_USER_MODEL_KEY);
    return;
  }

  console.log('Migrating user auth.');

  try {
    await userModel.logIn(email, password);
  } catch (e) {
    // do nothing
  } finally {
    localStorage.removeItem(OLD_USER_MODEL_KEY);
  }
};

userModel.ready?.then(migrateOldAuth);

export const useUserStatusCheck = () => {
  const toast = useToast();
  const loader = useLoader();

  const userStatusAlert = async () => {
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
