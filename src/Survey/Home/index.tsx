import React, { FC, useContext } from 'react';
import Sample, { useValidateCheck } from 'models/sample';
import { AppModel } from 'models/app';
import { UserModel } from 'models/user';
import { observer } from 'mobx-react';
import { IonButton, NavContext } from '@ionic/react';
import { Page, Header } from '@flumens';
import Main from './Main';
import './styles.scss';

type Props = {
  sample: Sample;
  appModel: AppModel;
  userModel: UserModel;
};

const HomeController: FC<Props> = ({ sample, appModel, userModel }) => {
  const { navigate } = useContext(NavContext);

  const isTraining = !!sample.metadata.training;

  const checkSampleStatus = useValidateCheck(sample);

  const isEditing = sample.metadata.saved;

  const isDisabled = sample.isUploaded();

  const processSubmission = () => {
    const isLoggedIn = !!userModel.attrs.email;
    if (!isLoggedIn) {
      navigate(`/user/login`);
      return;
    }

    sample.upload();
    navigate(`/home/records`, 'root');
  };

  const processDraft = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    // eslint-disable-next-line
    appModel.attrs['draftId:survey'] = '';
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

    await processSubmission();
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
        title="Record"
        rightSlot={finishButton}
        subheader={trainingModeSubheader}
      />

      <Main sample={sample} />
    </Page>
  );
};

export default observer(HomeController);
