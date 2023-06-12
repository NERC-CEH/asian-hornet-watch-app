import { FC, useContext } from 'react';
import { Page, Header, device, useToast, useAlert, useLoader } from '@flumens';
import { NavContext } from '@ionic/react';
import userModel from 'models/user';
import Main from './Main';
import './styles.scss';

export type Details = {
  password: string;
  email: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
};

const RegisterContainer: FC = () => {
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
      userModel.save();

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
    } catch (err: any) {
      toast.error(err);
    }

    loader.hide();
  }

  return (
    <Page id="user-register">
      <Header className="ion-no-border" title="Register" />
      <Main schema={userModel.registerSchema} onSubmit={onRegister} />
    </Page>
  );
};

export default RegisterContainer;
