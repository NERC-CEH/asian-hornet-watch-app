import React from 'react';
import config from 'common/config';
import {
  IonItem,
  IonList,
  IonListHeader,
  IonMenu,
  IonFooter,
  IonContent,
} from '@ionic/react';
import { Trans as T } from 'react-i18next';
import logo from 'common/images/flumens.svg';
import './styles.scss';

const Menu = () => {
  return (
    <IonMenu type="overlay" contentId="main">
      <IonContent forceOverscroll={false}>
        <IonList lines="none">
          <IonListHeader>
            <T>Navigate</T>
          </IonListHeader>

          <IonItem routerLink="/info/about">About</IonItem>
          <IonItem routerLink="/info/credits">Credits</IonItem>
        </IonList>
      </IonContent>

      <IonFooter className="ion-no-border">
        <div>
          <a href="https://flumens.io">
            <img src={logo} alt="" />
          </a>

          <p className="app-version">{`App version: v${config.version} (${config.build})`}</p>
        </div>
      </IonFooter>
    </IonMenu>
  );
};

export default Menu;
