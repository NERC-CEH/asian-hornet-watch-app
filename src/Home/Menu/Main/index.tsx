import { FC } from 'react';
import { observer } from 'mobx-react';
import {
  settingsOutline,
  informationCircleOutline,
  heartOutline,
  helpBuoyOutline,
  personOutline,
  personAddOutline,
  exitOutline,
} from 'ionicons/icons';
import { Main, InfoMessage } from '@flumens';
import { IonIcon, IonList, IonItem, IonButton } from '@ionic/react';
import CONFIG from 'common/config';
import flumensLogo from 'common/images/flumens.svg';
import { UserModel } from 'common/models/user';
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

        <h2 className="list-title">Account</h2>
        <div className="rounded-list">
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
              Looks like your <b>{{ userEmail } as any}</b> email hasn't been
              verified yet.
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

        <h2 className="list-title">Info</h2>
        <div className="rounded-list">
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

        <h2 className="list-title">Settings</h2>
        <div className="rounded-list">
          <IonItem routerLink="/settings/menu" detail>
            <IonIcon icon={settingsOutline} size="small" slot="start" />
            App
          </IonItem>
        </div>

        <div className="mt-10">
          <a href="https://flumens.io">
            <img src={flumensLogo} alt="logo" />
          </a>

          <div className="mt-2 opacity-60">{`App version: v${CONFIG.version} (${CONFIG.build})`}</div>
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MainComponent);