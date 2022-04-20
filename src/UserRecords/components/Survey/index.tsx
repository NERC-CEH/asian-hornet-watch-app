import React, { FC } from 'react';
import { useAlert, useToast } from '@flumens';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import { observer } from 'mobx-react';
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonBadge,
  IonLabel,
  IonIcon,
} from '@ionic/react';
// import flowerIcon from 'common/images/flowerIcon.svg';
import OnlineStatus from './components/OnlineStatus';
import './styles.scss';

const useDeleteAlert = (sample: Sample) => {
  const alert = useAlert();

  const alertDialog = () => {
    alert({
      header: 'Delete',
      skipTranslation: true,
      message: 'Are you sure you want to remove it from your device?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'primary',
        },
        {
          text: 'Delete',
          cssClass: 'danger',
          handler: () => sample.destroy(),
        },
      ],
    });
  };
  return alertDialog;
};

type Props = {
  sample: Sample;
  uploadIsPrimary?: boolean;
};

const Survey: FC<Props> = ({ sample, uploadIsPrimary }) => {
  const deleteSurvey = useDeleteAlert(sample);
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);

  const survey = sample.getSurvey();

  let href;
  if (!sample.remote.synchronising) {
    href = `/survey/${survey.name}/${sample.cid}`;
    if (survey.name === 'transect' && !sample.metadata.completedDetails) {
      href += '/details';
    }
  }

  function getSampleInfo() {
    if (survey.name === 'transect') {
      return (
        <div className="species-info">
          <h3>{survey.label}</h3>
        </div>
      );
    }

    const showSpeciesLength = sample.samples.length;

    return (
      <div className="species-info">
        <h3>
          {survey.label}

          {!!showSpeciesLength && (
            <IonBadge>
              {/* <IonIcon icon={flowerIcon} /> */}
              {showSpeciesLength}
            </IonBadge>
          )}
        </h3>
      </div>
    );
  }

  const onUpload = async () => {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    const isValid = checkSampleStatus();
    if (!isValid) return;

    sample.upload().catch(toast.error);
  };

  return (
    <IonItemSliding className="survey-list-item">
      <IonItem routerLink={href} detail>
        <IonIcon icon={survey.icon} color="primary" />
        <IonLabel>{getSampleInfo()}</IonLabel>
        <OnlineStatus
          sample={sample}
          onUpload={onUpload}
          uploadIsPrimary={!!uploadIsPrimary}
        />
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={deleteSurvey}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default observer(Survey);
