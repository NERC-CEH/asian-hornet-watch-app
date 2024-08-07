import { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { Page, Header, useToast, device } from '@flumens';
import { IonButton, NavContext } from '@ionic/react';
import useThankYouMessage from 'common/helpers/thankYouMessageHook';
import { AppModel } from 'models/app';
import Sample, { useValidateCheck } from 'models/sample';
import { UserModel, useUserStatusCheck } from 'models/user';
import {
  useContactDetailsPrompt,
  usePromptToLogin,
} from 'helpers/anonymousUploadAlerts';
import Main from './Main';
import './styles.scss';

type Props = {
  sample: Sample;
  appModel: AppModel;
  userModel: UserModel;
};

const HomeController: FC<Props> = ({ sample, appModel, userModel }) => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const showThankYouMessage = useThankYouMessage();
  const checkUserStatus = useUserStatusCheck();
  const promptToLogin = usePromptToLogin();
  const promptToEnterContactDetails = useContactDetailsPrompt(sample);

  const isTraining = !!sample.attrs.training;

  const checkSampleStatus = useValidateCheck(sample);

  const isEditing = sample.metadata.saved;

  const isDisabled = sample.isUploaded();

  const onUpload = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return;
    }

    if (sample.canUploadAnonymously()) {
      await sample.upload().then(showThankYouMessage).catch(toast.error);

      navigate(`/home/records`, 'root');
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

    await sample.upload().then(showThankYouMessage).catch(toast.error);

    navigate(`/home/records`, 'root');
  };

  const processDraft = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    // eslint-disable-next-line
    appModel.attrs['draftId:main'] = null;
    await appModel.save();

    // eslint-disable-next-line
    sample.metadata.saved = true;
    sample.save();

    navigate(`/home/records`, 'root');
  };

  const onFinish = async () => {
    if (!sample.metadata.saved) {
      await processDraft();
      return;
    }

    await onUpload();
  };

  const finishButton = isDisabled ? null : (
    <IonButton onClick={onFinish}>{isEditing ? 'Upload' : 'Finish'}</IonButton>
  );

  const trainingModeSubheader = isTraining && (
    <div className="training-subheader">Training Mode</div>
  );

  return (
    <Page id="survey-home">
      <Header
        title="Report"
        rightSlot={finishButton}
        subheader={trainingModeSubheader}
      />

      <Main sample={sample} />
    </Page>
  );
};

export default observer(HomeController);
