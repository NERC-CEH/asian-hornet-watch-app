import React, { FC } from 'react';
import { IonItem, IonItemGroup, IonLabel } from '@ionic/react';
import { Page, Main } from '@flumens';
import surveyConfig from 'Survey/config';
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
            <br />
            <br />
            Find out more about confirmed{' '}
            <a href="https://www.gov.uk/government/publications/asian-hornet-uk-sightings">
              UK Asian hornet sightings.
            </a>{' '}
          </h2>

          <IonItemGroup>
            <IonItem
              className="pretty-button"
              routerLink={`/survey/${surveyConfig.name}`}
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
