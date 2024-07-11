import { observer } from 'mobx-react';
import { IonSpinner, IonButton } from '@ionic/react';
import { Badge } from 'common/flumens';
import Sample from 'models/sample';
import './styles.scss';

type Props = {
  sample: Sample;
  onUpload: any;
  uploadIsPrimary: boolean;
};

const OnlineStatus = ({ sample, onUpload, uploadIsPrimary }: Props) => {
  const { saved } = sample.metadata;

  if (!saved) {
    return <Badge>Draft</Badge>;
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
      className="survey-status-upload"
      color="secondary"
      onClick={onUploadWrap}
      fill={uploadIsPrimary ? undefined : 'outline'}
    >
      Upload
    </IonButton>
  );
};

export default observer(OnlineStatus);
