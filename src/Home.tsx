import React from 'react';
import { IonMenuButton, IonToolbar, IonHeader } from '@ionic/react';
import { Page, Main } from '@flumens';

const HomeController = () => {
  return (
    <Page id="home">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonMenuButton slot="start" />
        </IonToolbar>
      </IonHeader>

      <Main>Home page Main</Main>
    </Page>
  );
};

export default HomeController;
