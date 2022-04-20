import React, { FC } from 'react';
import { IonSpinner, IonLabel, IonChip, IonButton } from '@ionic/react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import './styles.scss';

type Props = {
  sample: Sample;
  onUpload: any;
  uploadIsPrimary: boolean;
};

const OnlineStatus: FC<Props> = ({ sample, onUpload, uploadIsPrimary }) => {
  const { saved } = sample.metadata;

  if (!saved) {
    return (
      <IonLabel slot="end" class="survey-status">
        <IonChip slot="end" class="survey-status">
          <IonLabel>Draft</IonLabel>
        </IonChip>
      </IonLabel>
    );
  }

  if (sample.remote.synchronising) {
    return <IonSpinner class="survey-status" />;
  }

  if (sample.isUploaded()) {
    return null;
  }

  const onUploadWrap = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    onUpload();
  };

  return (
    <IonButton
      class="survey-status-upload"
      color="secondary"
      onClick={onUploadWrap}
      fill={uploadIsPrimary ? undefined : 'outline'}
    >
      Upload
    </IonButton>
  );
};

export default observer(OnlineStatus);
