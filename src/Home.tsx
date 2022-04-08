import React, { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {
  IonTabs,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonRouterOutlet,
} from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';
import Menu from './Info/Menu';

const HomeController: FC = () => {
  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect path="/home" to="/home/info" exact />
          <Route path="/home/info" component={Menu} exact />
        </IonRouterOutlet>

        <IonTabBar slot="bottom" className="home-tab-bar">
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
