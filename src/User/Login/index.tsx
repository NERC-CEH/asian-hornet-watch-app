import React, { FC, useContext } from 'react';
import userModelProps from 'models/user';
import { NavContext } from '@ionic/react';
import { useToast, useLoader, Page, Header, device } from '@flumens';
import Main from './Main';
import './styles.scss';

export type Details = {
  password: string;
  email: string;
};

type Props = {
  userModel: typeof userModelProps;
};

const LoginController: FC<Props> = ({ userModel }) => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const loader = useLoader();

  const onSuccessReturn = () => {
    const { email } = userModel.attrs;
    toast.success(`Successfully logged in as: ${email}`);
    navigate('/home/landing', 'root');
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
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      console.error(err);
    }

    loader.hide();
  }

  return (
    <Page id="user-login">
      <Header className="ion-no-border" routerDirection="none" title="Login" />
      <Main schema={userModel.loginSchema} onSubmit={onLogin} />
    </Page>
  );
};

export default LoginController;