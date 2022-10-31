import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { observer } from 'mobx-react';
import { useAlert } from '@flumens';
import Home from './Home';
import Info from './Info/router';
import User from './User/router';
import Settings from './Settings/router';
import Survey from './Survey/router';

const HomeRedirect = () => {
  return <Redirect to="home" />;
};

const useBackendMaintenanceAlert = () => {
  const alert = useAlert();
  const [shown, setShown] = useState(false);

  const showBackendMaintainanceAlert = () => {
    if (shown) return;

    const now = new Date().getTime();
    const notReady = now < new Date('2022-11-11T12:00').getTime();
    const expired = now > new Date('2022-11-14T12:00').getTime();
    if (expired || notReady) return;

    alert({
      header: 'Down for Maintenance',
      message: (
        <>
          Due to essential server maintenance, please submit your records by
          email to{' '}
          <a href="mailto:alert_nonnative@ceh.ac.uk">
            alert_nonnative@ceh.ac.uk
          </a>{' '}
          between <b>3pm 11/11/2022</b> and <b>9am 14/11/2022</b>
        </>
      ),
      buttons: [{ text: 'OK', handler: () => setShown(true) }],
    });
  };
  useEffect(showBackendMaintainanceAlert, []);
};

const App = () => {
  useBackendMaintenanceAlert();

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route exact path="/" component={HomeRedirect} />
          <Route path="/home" component={Home} />
          {Info}
          {User}
          {Survey}
          {Settings}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default observer(App);
