import React, { FC, useContext } from 'react';
import userModelProps from 'models/user';
import { NavContext } from '@ionic/react';
import { Trans as T } from 'react-i18next';
import { Page, Header, device, useToast, useAlert, useLoader } from '@flumens';
import Main from './Main';
import './styles.scss';

export type Details = {
  password: string;
  email: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
};

type Props = {
  userModel: typeof userModelProps;
};

const RegisterContainer: FC<Props> = ({ userModel }) => {
  const { navigate } = useContext(NavContext);
  const alert = useAlert();
  const toast = useToast();
  const loader = useLoader();

  const onSuccess = () => navigate('/home/landing', 'root');

  async function onRegister(details: Details) {
    const email = details.email.trim();
    const { password, firstName, lastName } = details;
    const otherDetails = {
      field_first_name: [{ value: firstName?.trim() }],
      field_last_name: [{ value: lastName?.trim() }],
    };

    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }
    await loader.show('Please wait...');

    try {
      await userModel.register(email, password, otherDetails);

      userModel.attrs.firstName = firstName; // eslint-disable-line
      userModel.attrs.lastName = lastName; // eslint-disable-line

      alert({
        header: 'Welcome aboard',
        message:
          'Before starting any surveys please check your email and click on the verification link.',
        buttons: [
          {
            text: 'OK, got it',
            role: 'cancel',
            handler: onSuccess,
          },
        ],
      });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      console.error(err, 'e');
    }

    loader.hide();
  }

  return (
    <Page id="user-register">
      <Header
        className="ion-no-border"
        routerDirection="none"
        title="Register"
      />
      <Main schema={userModel.registerSchema} onSubmit={onRegister} />
    </Page>
  );
};

export default RegisterContainer;
