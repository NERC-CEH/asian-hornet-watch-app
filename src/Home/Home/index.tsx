import React, { FC } from 'react';
import { IonItem, IonItemGroup, IonLabel } from '@ionic/react';
import { Page, Main } from '@flumens';
import homePageBackground from './images/background.jpg';
import appLogo from './images/app_logo.png';
import './styles.scss';

const Home: FC = () => {
  return (
    <Page id="home-info">
      <Main>
        <div
          className="app-home-background"
          style={{ backgroundImage: `url(${homePageBackground})` }}
        >
          <img className="app-logo" src={appLogo} alt="" />
          <IonItemGroup>
            <IonItem
              className="pretty-button"
              color="light"
              routerLink="/survey/survey"
              routerDirection="none"
              detail
            >
              <IonLabel>Record</IonLabel>
            </IonItem>
          </IonItemGroup>
        </div>
      </Main>
    </Page>
  );
};

export default Home;
