import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Page, useAlert, useToast, useLoader } from '@flumens';
import savedSamples from 'models/savedSamples';
import CONFIG from 'common/config';
import appModel from 'models/app';
import userModel, { useUserStatusCheck } from 'models/user';
import { IonFooter, IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import flumensLogo from 'common/images/flumens.svg';
import Main from './Main';

const useConfirmationDialog = () => {
  const alert = useAlert();

  return (callback: any) => {
    let deleteData = false;

    const onCheckboxChange = (e: any) => {
      deleteData = e.detail.checked;
    };

    alert({
      header: 'Logout',
      message: (
        <>
          Are you sure you want to logout?
          <br />
          <br />
          <IonItem lines="none" className="log-out-checkbox">
            <IonLabel>Discard local data</IonLabel>
            <IonCheckbox onIonChange={onCheckboxChange} />
          </IonItem>
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
          handler: () => callback(deleteData),
        },
      ],
    });
  };
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
      <IonFooter className="ion-no-border">
        <div>
          <a href="https://flumens.io">
            <img src={flumensLogo} alt="logo" />
          </a>

          <p className="app-version">{`App version: v${CONFIG.version} (${CONFIG.build})`}</p>
        </div>
      </IonFooter>
    </Page>
  );
};

export default observer(MenuController);
