import { FC, useState } from 'react';
import { Formik, Form } from 'formik';
import {
  keyOutline,
  personOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';
import { AnySchema } from 'yup';
import { Main, InputWithValidation } from '@flumens';
import { IonIcon, IonButton, IonList, IonRouterLink } from '@ionic/react';
import { Details } from './';

type Props = {
  schema: AnySchema;
  onSubmit: (details: Details) => Promise<void>;
};

const LoginMain: FC<Props> = ({ schema, onSubmit }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const loginForm = (props: any) => (
    <Form>
      <IonList lines="full">
        <InputWithValidation
          name="email"
          placeholder="Email"
          icon={personOutline}
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
        <IonRouterLink
          routerLink="/user/reset"
          className="password-forgot-button"
        >
          Forgot password?
        </IonRouterLink>
      </IonList>

      {/** https://github.com/formium/formik/issues/1418 */}
      <input type="submit" style={{ display: 'none' }} />
      <IonButton
        color={props.isValid ? 'secondary' : 'medium'}
        type="submit"
        expand="block"
      >
        Sign In
      </IonButton>
    </Form>
  );

  const initialValues: Details = { email: '', password: '' };

  return (
    <Main>
      <h1>Welcome back</h1>
      <h2>Sign in to your account to start</h2>

      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={initialValues}
        validateOnMount
      >
        {loginForm}
      </Formik>
    </Main>
  );
};

export default LoginMain;
