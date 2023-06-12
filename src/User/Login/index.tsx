import { FC, useContext } from 'react';
import { useToast, useLoader, Page, Header, device } from '@flumens';
import { NavContext } from '@ionic/react';
import userModel from 'models/user';
import Main from './Main';
import './styles.scss';

export type Details = {
  password: string;
  email: string;
};

const LoginController: FC = () => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const loader = useLoader();

  const onSuccessReturn = () => {
    const { email } = userModel.attrs;
    toast.success(`Successfully logged in as: ${email}`);
    navigate('/home/records', 'root');
  };

  async function onLogin(details: Details) {
    const { email, password } = details;

    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    await loader.show('Please wait...');

    try {
      await userModel.logIn(email.trim(), password);

      onSuccessReturn();
    } catch (err: any) {
      toast.error(err);
    }

    loader.hide();
  }

  return (
    <Page id="user-login">
      <Header className="ion-no-border" title="Login" />
      <Main schema={userModel.loginSchema} onSubmit={onLogin} />
    </Page>
  );
};

export default LoginController;
