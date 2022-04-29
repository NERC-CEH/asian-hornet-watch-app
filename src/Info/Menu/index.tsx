import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Page, useAlert, useToast, useLoader } from '@flumens';
import savedSamples from 'models/savedSamples';
import userModel, { useUserStatusCheck } from 'models/user';
import { IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import Main from './Main';

const useConfirmationDialog = () => {
  const alert = useAlert();

  const logoutAlert = (callback: any) => {
    alert({
      header: 'Logout',
      message: (
        <>
          Are you sure you want to logout?
          <br />
          <br />
          Your pending and uploaded <b>records will not be deleted</b> from this
          device.
        </>
      ),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Logout',
          cssClass: 'primary',
          handler: () => callback(),
        },
      ],
    });
  };

  return logoutAlert;
};

const MenuController: FC = () => {
  const showLogoutConfirmationDialog = useConfirmationDialog();
  const toast = useToast();
  const loader = useLoader();
  const checkUserStatus = useUserStatusCheck();

  const isLoggedIn = userModel.isLoggedIn();

  const resendVerificationEmail = async () => {
    if (!isLoggedIn) {
      toast.warn('Please log in first.');
      return;
    }

    await loader.show('Please wait...');

    try {
      await userModel.resendVerificationEmail();
      toast.success(
        'A new verification email was successfully sent now. If you did not receive the email, then check your Spam or Junk email folders.',
        { duration: 5000 }
      );
    } catch (e: any) {
      toast.error(e.message);
    }

    loader.hide();
  };

  function logOut() {
    console.log('Info:Menu: logging out.');
    const resetWrap = async (reset: boolean) => {
      if (reset) {
        await savedSamples.resetDefaults();
      }

      userModel.logOut();
    };

    showLogoutConfirmationDialog(resetWrap);
  }

  return (
    <Page id="menu">
      <Main
        user={userModel}
        isLoggedIn={isLoggedIn}
        logOut={logOut}
        refreshAccount={checkUserStatus}
        resendVerificationEmail={resendVerificationEmail}
      />
    </Page>
  );
};

export default observer(MenuController);
