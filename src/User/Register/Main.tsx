import React, { FC, useState } from 'react';
import { IonIcon, IonButton, IonList, IonRouterLink } from '@ionic/react';
import {
  personOutline,
  mailOutline,
  keyOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';
import { AnySchema } from 'yup';
import { Formik, Form } from 'formik';
import { Main, InputWithValidation } from '@flumens';
import config from 'common/config';

type Props = {
  onSubmit: any;
  schema: AnySchema;
};

const RegisterMain: FC<Props> = ({ onSubmit, schema }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const registrationForm = (props: any) => (
    <Form>
      <IonList lines="full">
        <InputWithValidation
          name="firstName"
          placeholder="First name"
          icon={personOutline}
          type="text"
          autocomplete="off"
          {...props}
        />
        <InputWithValidation
          name="lastName"
          placeholder="Surname"
          icon={personOutline}
          type="text"
          autocomplete="off"
          {...props}
        />
        <InputWithValidation
          name="email"
          placeholder="Email"
          icon={mailOutline}
          type="email"
          autocomplete="off"
          {...props}
        />
        <InputWithValidation
          name="password"
          placeholder="Password"
          icon={keyOutline}
          type={showPassword ? 'text' : 'password'}
          autocomplete="off"
          {...props}
        >
          <IonButton slot="end" onClick={togglePassword} fill="clear">
            <IonIcon
              icon={showPassword ? eyeOutline : eyeOffOutline}
              size="small"
            />
          </IonButton>
        </InputWithValidation>

        <div className="terms-info-text">
          By clicking Sign Up, you agree to our{' '}
          <a href={`${config.backend.url}/privacy-notice`}>Privacy Policy</a>{' '}
          and{' '}
          <a href={`${config.backend.url}/terms_of_use`}>
            Terms and Conditions
          </a>
        </div>
      </IonList>

      <IonButton color="secondary" type="submit" expand="block">
        Sign Up
      </IonButton>

      <div className="signin-button">
        I am already a member.{' '}
        <IonRouterLink routerLink="/user/login">Sign In</IonRouterLink>
      </div>
    </Form>
  );

  return (
    <Main>
      <h1>Create a free account</h1>

      <Formik validationSchema={schema} onSubmit={onSubmit} initialValues={{}}>
        {registrationForm}
      </Formik>
    </Main>
  );
};

export default RegisterMain;
