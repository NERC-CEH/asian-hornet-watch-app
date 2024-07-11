import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Route, Redirect } from 'react-router-dom';
import {
  useAlert,
  TailwindContext,
  TailwindBlockContext,
  TailwindContextValue,
  defaultContext,
} from '@flumens';
import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import 'common/theme.scss';
import Home from './Home';
import Info from './Info/router';
import Settings from './Settings/router';
import Survey from './Survey/router';
import User from './User/router';

const platform = isPlatform('ios') ? 'ios' : 'android';
const tailwindContext: TailwindContextValue = { platform };
const tailwindBlockContext = {
  ...defaultContext,
  ...tailwindContext,
  basePath: '',
};

const HomeRedirect = () => {
  return <Redirect to="home" />;
};

const useBackendMaintenanceAlert = () => {
  const alert = useAlert();
  const [shown, setShown] = useState(false);

  const showBackendMaintainanceAlert = () => {
    if (shown) return;

    const now = new Date().getTime();
    const notReady = now < new Date('2023-11-13T00:00').getTime();
    const expired = now > new Date('2023-11-14T07:00').getTime();
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
          on <b>13/11/2023</b>
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
      <TailwindContext.Provider value={tailwindContext}>
        <TailwindBlockContext.Provider value={tailwindBlockContext}>
          <IonReactRouter>
            <IonRouterOutlet id="main">
              <Route exact path="/" component={HomeRedirect} />
              <Route path="/home" component={Home} />
              {User}
              {Info}
              {Survey}
              {Settings}
            </IonRouterOutlet>
          </IonReactRouter>
        </TailwindBlockContext.Provider>
      </TailwindContext.Provider>
    </IonApp>
  );
};

export default observer(App);
