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
          <div className="app-home-background-contrast">
            <img className="app-logo" src={appLogo} alt="" />
          </div>

          <h2>
            Learn more about Asian hornet and help detect it by recording
            suspected sightings.
          </h2>

          <IonItemGroup>
            <IonItem
              className="pretty-button"
              routerLink="/survey/survey"
              routerDirection="none"
              color="secondary"
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
