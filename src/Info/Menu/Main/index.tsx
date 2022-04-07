import React from 'react';
import { Main } from '@flumens';
import { IonIcon, IonList, IonItem, IonItemDivider } from '@ionic/react';
import { settings, informationCircleOutline } from 'ionicons/icons';
import './styles.scss';

const MainComponent = () => {
  return (
    <Main className="app-menu">
      <IonList lines="full">
        <IonItemDivider>Settings</IonItemDivider>

        <IonItem routerLink="/settings/menu" detail>
          <IonIcon icon={settings} size="small" slot="start" />
          App
        </IonItem>

        <IonItemDivider>Info</IonItemDivider>

        <IonItem routerLink="/info/about" detail>
          <IonIcon icon={informationCircleOutline} size="small" slot="start" />
          About
        </IonItem>
      </IonList>
    </Main>
  );
};

export default MainComponent;
