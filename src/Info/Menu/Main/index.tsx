import React, { FC } from 'react';
import { Main, InfoMessage } from '@flumens';
import { observer } from 'mobx-react';
import { UserModel } from 'common/models/user';
import {
  IonIcon,
  IonList,
  IonItem,
  IonItemDivider,
  IonButton,
} from '@ionic/react';
import {
  settingsOutline,
  informationCircleOutline,
  heartOutline,
  helpBuoyOutline,
  personOutline,
  personAddOutline,
  exitOutline,
} from 'ionicons/icons';
import CONFIG from 'common/config';
import flumensLogo from 'common/images/flumens.svg';
import './styles.scss';

type Props = {
  logOut: () => void;
  refreshAccount: any;
  resendVerificationEmail: () => Promise<void>;
  isLoggedIn: boolean;
  user: UserModel;
};

const MainComponent: FC<Props> = ({
  isLoggedIn,
  user,
  logOut,
  refreshAccount,
  resendVerificationEmail,
}) => {
  const isNotVerified = user.attrs.verified === false; // verified is undefined in old versions
  const userEmail = user.attrs.email;

  return (
    <Main>
      <IonList lines="full">
        <h1>Menu</h1>

        <IonItemDivider>Account</IonItemDivider>
        <div className="rounded">
          {isLoggedIn && (
            <IonItem detail id="logout-button" onClick={logOut}>
              <IonIcon icon={exitOutline} size="small" slot="start" />
              Logout
              {': '}
              {user.attrs.firstName} {user.attrs.lastName}
            </IonItem>
          )}

          {isLoggedIn && isNotVerified && (
            <InfoMessage className="verification-warning">
              Looks like your <b>{{ userEmail }}</b> email hasn't been verified
              yet.
              <div>
                <IonButton fill="outline" onClick={refreshAccount}>
                  Refresh
                </IonButton>
                <IonButton fill="clear" onClick={resendVerificationEmail}>
                  Resend Email
                </IonButton>
              </div>
            </InfoMessage>
          )}

          {!isLoggedIn && (
            <IonItem routerLink="/user/login" detail>
              <IonIcon icon={personOutline} size="small" slot="start" />
              Login
            </IonItem>
          )}

          {!isLoggedIn && (
            <IonItem routerLink="/user/register" detail>
              <IonIcon icon={personAddOutline} size="small" slot="start" />
              Register
            </IonItem>
          )}
        </div>

        <IonItemDivider>Info</IonItemDivider>
        <div className="rounded">
          <IonItem routerLink="/info/about" detail>
            <IonIcon
              icon={informationCircleOutline}
              size="small"
              slot="start"
            />
            About
          </IonItem>
          <IonItem routerLink="/info/help" detail>
            <IonIcon icon={helpBuoyOutline} size="small" slot="start" />
            Help
          </IonItem>

          <IonItem routerLink="/info/credits" detail>
            <IonIcon icon={heartOutline} size="small" slot="start" />
            Credits
          </IonItem>
        </div>

        <IonItemDivider>Settings</IonItemDivider>
        <div className="rounded">
          <IonItem routerLink="/settings/menu" detail>
            <IonIcon icon={settingsOutline} size="small" slot="start" />
            App
          </IonItem>
        </div>

        <div>
          <a href="https://flumens.io">
            <img src={flumensLogo} alt="logo" />
          </a>

          <p className="app-version">{`App version: v${CONFIG.version} (${CONFIG.build})`}</p>
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MainComponent);
