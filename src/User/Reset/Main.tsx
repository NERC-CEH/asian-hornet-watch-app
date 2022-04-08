import React, { FC } from 'react';
import { IonButton, IonList } from '@ionic/react';
import { Main, InputWithValidation } from '@flumens';
import { personOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { AnySchema } from 'yup';
import { Formik, Form } from 'formik';
import { Details } from './';

type Props = {
  onSubmit: (details: Details) => Promise<void>;
  schema: AnySchema;
};

const ResetMain: FC<Props> = ({ onSubmit, schema }) => {
  const resetForm = (props: any) => (
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
      </IonList>

      <IonButton color="secondary" type="submit" expand="block">
        <T>Reset</T>
      </IonButton>
    </Form>
  );

  const initialValues: Details = { email: '' };

  return (
    <Main>
      <h2>
        <T>Enter your email address to request a password reset.</T>
      </h2>

      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={initialValues}
      >
        {resetForm}
      </Formik>
    </Main>
  );
};

export default ResetMain;
