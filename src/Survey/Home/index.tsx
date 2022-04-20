import React, { FC } from 'react';
import Sample from 'models/sample';
import { observer } from 'mobx-react';
import { IonButton } from '@ionic/react';
import { Page, Header } from '@flumens';
import Main from './Main';
import './styles.scss';

type Props = {
  sample: Sample;
};

const HomeController: FC<Props> = ({ sample }) => {
  const isEditing = sample.metadata.saved;

  const isDisabled = sample.isUploaded();

  const finishButton = isDisabled ? null : (
    <IonButton>{isEditing ? 'Upload' : 'Finish'}</IonButton>
  );

  return (
    <Page id="survey-home">
      <Header title="Record" rightSlot={finishButton} />

      <Main sample={sample} />
    </Page>
  );
};

export default observer(HomeController);
