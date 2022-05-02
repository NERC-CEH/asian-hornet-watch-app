import React from 'react';
import { useAlert } from '@flumens';
import { hasValidContactDetails } from 'models/user';
import Sample from '../models/sample';

export const usePromptToLogin = () => {
  const alert = useAlert();

  const alertDialog = () => {
    const showAlert = (resolve: any) => {
      alert({
        message: (
          <>
            Please select <b>Login</b> if you have an iRecord account or would
            like to register. Otherwise select <b>Send</b> and enter you contact
            details.
          </>
        ),
        buttons: [
          {
            text: 'Send',
            handler: () => resolve(false),
          },
          {
            text: 'Login',
            cssClass: 'primary',
            handler: () => resolve(true),
          },
        ],
      });
    };
    return new Promise(showAlert);
  };
  return alertDialog;
};

export const useContactDetailsPrompt = (sample: Sample) => {
  const alert = useAlert();

  const alertDialog = () => {
    function assignContactDetailsToSample(data: any) {
      // eslint-disable-next-line no-param-reassign
      sample.attrs.user_email = data.email;
      // eslint-disable-next-line no-param-reassign
      sample.attrs.firstname = data.firstname;
      // eslint-disable-next-line no-param-reassign
      sample.attrs.secondname = data.secondname;
      // eslint-disable-next-line no-param-reassign
      sample.attrs.phone = data.phone;
      sample.save();
    }

    const showAlert = (resolve: any) => {
      const sendHandler = (data: any) => {
        if (hasValidContactDetails(data)) {
          assignContactDetailsToSample(data);

          resolve(false);

          return true; // close alert
        }

        return false; // don't close alert
      };

      alert({
        header: 'Your details',
        message: <></>,
        inputs: [
          {
            name: 'email',
            type: 'email',
            placeholder: 'Email',
          },
          {
            name: 'firstname',
            type: 'text',
            placeholder: 'Name',
          },
          {
            name: 'secondname',
            type: 'text',
            placeholder: 'Surname',
          },
          {
            name: 'phone',
            type: 'tel',
            placeholder: 'Phone',
          },
        ],

        buttons: [
          {
            text: 'Cancel',
            handler: () => resolve(true),
          },
          {
            text: 'Send',
            cssClass: 'primary',
            handler: sendHandler,
          },
        ],
      });
    };

    return new Promise(showAlert);
  };
  return alertDialog;
};
