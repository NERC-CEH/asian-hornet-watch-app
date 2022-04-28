import React, { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import savedSamples from 'common/models/savedSamples';
import {
  IonTabs,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonRouterOutlet,
} from '@ionic/react';
import {
  homeOutline,
  informationCircleOutline,
  layersOutline,
} from 'ionicons/icons';
import waspIcon from 'common/images/wasp.svg';
import PendingSurveysBadge from 'common/Components/PendingSurveysBadge';
import Menu from '../Info/Menu';
import Home from './Home';
import Species from './Species';
import UserRecords from '../UserRecords';
import './styles.scss';

const HomeController: FC = () => {
  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect path="/home" to="/home/landing" exact />
          <Route path="/home/info" component={Menu} exact />
          <Route path="/home/records" component={UserRecords} exact />
          <Route path="/home/landing" component={Home} exact />
          <Route path="/home/species" component={Species} exact />
        </IonRouterOutlet>

        <IonTabBar slot="bottom" className="home-tab-bar">
          <IonTabButton tab="/home/landing" href="/home/landing">
            <IonIcon icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="/home/species" href="/home/species">
            <IonIcon icon={waspIcon} />
            <IonLabel>Species</IonLabel>
          </IonTabButton>
          <IonTabButton tab="/home/records" href="/home/records">
            <IonIcon icon={layersOutline} />
            <IonLabel>Records</IonLabel>
            <PendingSurveysBadge savedSamples={savedSamples} />
          </IonTabButton>
          <IonTabButton tab="/home/info" href="/home/info">
            <IonIcon icon={informationCircleOutline} />
            <IonLabel>App Info</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </>
  );
};

export default HomeController;
