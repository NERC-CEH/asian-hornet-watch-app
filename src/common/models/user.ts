import { useContext } from 'react';
import * as Yup from 'yup';
import {
  DrupalUserModel,
  device,
  useToast,
  useLoader,
  useAlert,
  DrupalUserModelAttrs,
} from '@flumens';
import { NavContext } from '@ionic/react';
import * as Sentry from '@sentry/browser';
import CONFIG from 'common/config';
import { genericStore } from './store';

export interface Attrs extends DrupalUserModelAttrs {
  firstName?: string;
  lastName?: string;
  email?: string;

  /**
   * @deprecated
   */
  password?: any;
}

const defaults: Attrs = {
  firstName: '',
  lastName: '',
  email: '',
};

export class UserModel extends DrupalUserModel {
  attrs: Attrs = DrupalUserModel.extendAttrs(this.attrs, defaults);

  registerSchema = Yup.object().shape({
    email: Yup.string().email('email is not valid').required('Please fill in'),
    password: Yup.string().required('Please fill in'),
    firstName: Yup.string().required('Please fill in'),
    lastName: Yup.string().required('Please fill in'),
  });

  constructor(options: any) {
    super(options);

    const checkForValidation = () => {
      if (this.isLoggedIn() && !this.attrs.verified) {
        console.log('User: refreshing profile for validation');
        this.refreshProfile();
      }
    };
    this.ready
      ?.then(() => this.attrs.password && this._migrateAuth())
      .then(checkForValidation);
  }

  async logIn(email: string, password: string) {
    await super.logIn(email, password);

    if (this.id) Sentry.setUser({ id: this.id });
  }

  getPrettyName() {
    return this.isLoggedIn()
      ? `${this.attrs.firstName} ${this.attrs.lastName}`
      : '';
  }

  async checkActivation() {
    if (!this.isLoggedIn()) return false;

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
    if (!this.isLoggedIn() || this.attrs.verified) return false;

    await this._sendVerificationEmail();

    return true;
  }

  async getAnonymousToken() {
    return CONFIG.backend.anonymousToken;
  }

  async getAccessToken(...args: any) {
    if (this.attrs.password) await this._migrateAuth();

    return super.getAccessToken(...args);
  }

  /**
   * Migrate from Indicia API auth to JWT. Remove in the future versions.
   */
  async _migrateAuth() {
    console.log('Migrating user auth.');
    if (!this.attrs.email) {
      // email might not exist
      delete this.attrs.password;
      return this.save();
    }

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const tokens = await this._exchangePasswordToTokens(
        this.attrs.email,
        this.attrs.password
      );
      this.attrs.tokens = tokens;
      delete this.attrs.password;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await this._refreshAccessToken();
    } catch (e: any) {
      if (e.message === 'Incorrect password or email') {
        console.log('Removing invalid old user credentials');
        delete this.attrs.password;
        return this.logOut();
      }
      console.error(e);
      throw e;
    }

    return this.save();
  }

  resetDefaults() {
    return super.resetDefaults(defaults);
  }
}

const userModel = new UserModel({
  cid: 'user',
  store: genericStore,
  config: CONFIG.backend,
});

export const useUserStatusCheck = () => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const loader = useLoader();
  const alert = useAlert();

  const check = async () => {
    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return false;
    }

    if (!userModel.isLoggedIn()) {
      navigate(`/user/login`);
      return false;
    }

    if (!userModel.attrs.verified) {
      await loader.show('Please wait...');
      const isVerified = await userModel.checkActivation();
      loader.hide();

      if (!isVerified) {
        const resendVerificationEmail = async () => {
          await loader.show('Please wait...');
          try {
            await userModel.resendVerificationEmail();
            toast.success(
              'A new verification email was successfully sent now. If you did not receive the email, then check your Spam or Junk email folders.'
            );
          } catch (err: any) {
            toast.error(err);
          }
          loader.hide();
        };

        alert({
          header: "Looks like your email hasn't been verified yet.",
          message: 'Should we resend the verification email?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Resend',
              handler: resendVerificationEmail,
            },
          ],
        });

        return false;
      }
    }

    return true;
  };

  return check;
};

export const validateContactDetails = (details: any) => {
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
    return attrError;
  }

  return false;
};

export default userModel;
