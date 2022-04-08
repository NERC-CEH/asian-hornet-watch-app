import React from 'react';
import { Main } from '@flumens';
import { IonIcon, IonList, IonItem, IonItemDivider } from '@ionic/react';
import {
  settingsOutline,
  informationCircleOutline,
  thumbsUpOutline,
  lockClosedOutline,
  heartOutline,
  helpBuoyOutline,
} from 'ionicons/icons';
import './styles.scss';

const MainComponent = () => {
  return (
    <Main>
      <IonList lines="full">
        <h1>Menu</h1>

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

          <IonItem routerLink="/info/privacy" detail>
            <IonIcon icon={lockClosedOutline} size="small" slot="start" />
            Privacy Policy
          </IonItem>

          <IonItem routerLink="/info/brc" detail>
            <IonIcon icon={thumbsUpOutline} size="small" slot="start" />
            BRC Approved
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
      </IonList>
    </Main>
  );
};

export default MainComponent;
