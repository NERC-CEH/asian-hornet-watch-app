import { observer } from 'mobx-react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './Home';
import Info from './Info/router';
import Settings from './Settings/router';
import Survey from './Survey/router';
import User from './User/router';

const HomeRedirect = () => {
  return <Redirect to="home" />;
};

const App = () => {
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
