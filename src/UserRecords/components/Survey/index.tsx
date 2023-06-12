import { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { useAlert, useToast, date, device } from '@flumens';
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonIcon,
  IonAvatar,
  IonBadge,
  NavContext,
} from '@ionic/react';
import waspIcon from 'common/images/wasp.svg';
import Sample, { useValidateCheck } from 'models/sample';
import userModel, { useUserStatusCheck } from 'models/user';
import {
  useContactDetailsPrompt,
  usePromptToLogin,
} from 'helpers/anonymousUploadAlerts';
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
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);
  const promptToLogin = usePromptToLogin();
  const promptToEnterContactDetails = useContactDetailsPrompt(sample);
  const survey = sample.getSurvey();

  const { synchronising } = sample.remote;

  let href;
  if (!synchronising) {
    href = `/survey/${survey.name}/${sample.cid}`;
  }

  function getSampleInfo() {
    const occ = sample.occurrences[0];

    const prettyDate = date.print(sample.attrs.date);

    const image = occ?.media.length && occ?.media[0];
    let avatar = <IonIcon icon={waspIcon} color="warning" />;

    if (image) {
      avatar = <img src={image.getURL()} />;
    }

    const label = occ?.attrs?.taxon?.common_name;

    return (
      <>
        <IonAvatar>{avatar}</IonAvatar>
        <IonLabel position="stacked" mode="ios" color="dark">
          <IonLabel className="species-name bold">{label || 'Record'}</IonLabel>
          <div className="badge-wrapper">
            <IonLabel class="ion-text-wrap">{prettyDate}</IonLabel>
            {sample.attrs.training && <IonBadge>Training</IonBadge>}
          </div>
        </IonLabel>
      </>
    );
  }

  const onUpload = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return;
    }

    if (sample.canUploadAnonymously()) {
      sample.upload().catch(toast.error);
      return;
    }

    if (!userModel.isLoggedIn()) {
      const shouldLogin = await promptToLogin();
      if (shouldLogin) {
        navigate(`/user/login`);
        return;
      }

      const hasCancelled = await promptToEnterContactDetails();
      if (hasCancelled) return;

      onUpload();
      return;
    }

    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    sample.upload().catch(toast.error);
  };

  return (
    <IonItemSliding className="survey-list-item">
      <IonItem routerLink={href} detail={!synchronising}>
        {getSampleInfo()}

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
