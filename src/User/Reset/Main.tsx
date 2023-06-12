import { FC } from 'react';
import { Formik, Form } from 'formik';
import { personOutline } from 'ionicons/icons';
import { AnySchema } from 'yup';
import { Main, InputWithValidation } from '@flumens';
import { IonButton, IonList } from '@ionic/react';
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

      {/** https://github.com/formium/formik/issues/1418 */}
      <input type="submit" style={{ display: 'none' }} />
      <IonButton
        color={props.isValid ? 'secondary' : 'medium'}
        type="submit"
        expand="block"
      >
        Reset
      </IonButton>
    </Form>
  );

  const initialValues: Details = { email: '' };

  return (
    <Main>
      <h2>Enter your email address to request a password reset.</h2>

      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={initialValues}
        validateOnMount
      >
        {resetForm}
      </Formik>
    </Main>
  );
};

export default ResetMain;
