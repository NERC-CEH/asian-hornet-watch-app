import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { observer } from 'mobx-react';
import Home from './Home';
import Info from './Info/router';

const HomeRedirect = () => {
  return <Redirect to="home" />;
};

const App = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet id="main">
        <Route exact path="/" component={HomeRedirect} />
        <Route path="/home" component={Home} />
        {Info}
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default observer(App);
