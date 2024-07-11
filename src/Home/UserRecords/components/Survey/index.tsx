import { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { useAlert, useToast, device, getRelativeDate, Badge } from '@flumens';
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  NavContext,
} from '@ionic/react';
import useThankYouMessage from 'common/helpers/thankYouMessageHook';
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
  const showThankYouMessage = useThankYouMessage();
  const promptToEnterContactDetails = useContactDetailsPrompt(sample);
  const survey = sample.getSurvey();

  const { synchronising } = sample.remote;

  let href;
  if (!synchronising) {
    href = `/survey/${survey.name}/${sample.cid}`;
  }

  function getSampleInfo() {
    const occ = sample.occurrences[0];

    const prettyDate = getRelativeDate(sample.attrs.date);

    const image = occ?.media.length && occ?.media[0];
    let avatar = <IonIcon icon={waspIcon} color="warning" className="size-6" />;

    if (image) {
      avatar = (
        <img src={image.getURL()} className="h-full w-full object-cover" />
      );
    }

    const label = occ?.attrs?.taxon?.common_name;

    return (
      <div className="flex w-full items-center gap-3">
        <div className="list-avatar">{avatar}</div>
        <div className="flex flex-col">
          <div className="font-bold">{label || 'Record'}</div>
          <div>
            {prettyDate}
            {sample.attrs.training && (
              <Badge className="mx-2" size="small">
                Training
              </Badge>
            )}
          </div>
        </div>
      </div>
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
      sample.upload().then(showThankYouMessage).catch(toast.error);
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

    sample.upload().then(showThankYouMessage).catch(toast.error);
  };

  return (
    <IonItemSliding className="survey-list-item">
      <IonItem routerLink={href} detail={false}>
        <div className="flex w-full items-center justify-between">
          {getSampleInfo()}

          <OnlineStatus
            sample={sample}
            onUpload={onUpload}
            uploadIsPrimary={!!uploadIsPrimary}
          />
        </div>
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
