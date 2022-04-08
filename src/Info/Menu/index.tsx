import React, { FC } from 'react';
import { Page } from '@flumens';
import CONFIG from 'common/config';
import { IonFooter } from '@ionic/react';
import flumensLogo from 'common/images/flumens.svg';
import Main from './Main';

const MenuController: FC = () => {
  return (
    <Page id="menu">
      <Main />
      <IonFooter className="ion-no-border">
        <div>
          <a href="https://flumens.io">
            <img src={flumensLogo} alt="logo" />
          </a>

          <p className="app-version">{`App version: v${CONFIG.version} (${CONFIG.build})`}</p>
        </div>
      </IonFooter>
    </Page>
  );
};

export default MenuController;
