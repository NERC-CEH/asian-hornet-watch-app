import React, { FC, useContext } from 'react';
import { UserModel } from 'models/user';
import { NavContext } from '@ionic/react';
import { Page, Header, device, useAlert, useLoader, useToast } from '@flumens';
import Main from './Main';
import './styles.scss';

export type Details = {
  password?: string;
  email: string;
};

type Props = {
  userModel: UserModel;
};

const ResetController: FC<Props> = ({ userModel }) => {
  const { navigate } = useContext(NavContext);
  const alert = useAlert();
  const toast = useToast();
  const loader = useLoader();

  const onSuccess = () => navigate('/home/landing', 'root');

  async function onSubmit(details: Details) {
    const { email } = details;
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }
    await loader.show('Please wait...');

    try {
      await userModel.reset(email.trim());
      alert({
        header: "We've sent an email to you",
        message:
          "Click the link in the email to reset your password. If you don't see the email, check other places like your junk, spam or other folders.",
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
        toast.error(`${err.message}`);
      }
      loader.hide();
      console.error(err, 'e');
    }

    loader.hide();
  }

  return (
    <Page id="user-reset">
      <Header
        className="ion-no-border"
        title="Reset"
        defaultHref="/user/login"
      />
      <Main schema={userModel.resetSchema} onSubmit={onSubmit} />
    </Page>
  );
};

export default ResetController;
