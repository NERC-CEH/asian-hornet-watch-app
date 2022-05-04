import React from 'react';
import { useAlert } from '@flumens';
import { validateContactDetails } from 'models/user';
import Sample from '../../models/sample';
import './styles.scss';

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
        const invalids: any = validateContactDetails(data);
        if (invalids) {
          // remove old
          const oldErrorMessages = [
            ...document.getElementsByClassName('alert-input-error'),
          ];
          const remove = (oldErrorMessage: Element) => oldErrorMessage.remove();
          oldErrorMessages.forEach(remove);

          // add new
          const updateErrCode = (input: any) => {
            const inputEl = document.getElementById(
              `anonymous-user-${input.path}-input`
            );

            if (!inputEl) return;

            const errorMessage = document.createElement('span');
            errorMessage.classList.add('alert-input-error');
            errorMessage.innerHTML = 'is incorrect or missing';
            inputEl.parentNode?.insertBefore(errorMessage, inputEl.nextSibling);
          };

          invalids.inner.forEach(updateErrCode);
          return false; // don't close alert
        }

        assignContactDetailsToSample(data);

        resolve(false);

        return true; // close alert
      };

      alert({
        header: 'Your details',
        message: <></>,
        inputs: [
          {
            name: 'email',
            type: 'email',
            id: 'anonymous-user-email-input',
            placeholder: 'Email',
          },
          {
            name: 'firstname',
            type: 'text',
            id: 'anonymous-user-firstname-input',
            placeholder: 'Name',
          },
          {
            name: 'secondname',
            type: 'text',
            id: 'anonymous-user-secondname-input',
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
