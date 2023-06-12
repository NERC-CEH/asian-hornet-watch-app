import React, { useEffect, useContext } from 'react';
import { useAlert } from '@flumens';
import { NavContext } from '@ionic/react';
import CONFIG from 'common/config';
import appModel, { SurveyDraftKeys } from 'models/app';
import Sample from 'models/sample';
import savedSamples from 'models/savedSamples';
import SurveyConfig from 'Survey/config';

async function showDraftAlert(alert: any) {
  const alertWrap = (resolve: any) => {
    alert({
      header: 'Draft',
      message: 'Previous record draft exists, would you like to continue it?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Discard',
          handler: () => {
            resolve(false);
          },
        },
        {
          text: 'Continue',
          cssClass: 'primary',
          handler: () => {
            resolve(true);
          },
        },
      ],
    });
  };
  return new Promise(alertWrap);
}

async function getNewSample(
  survey: typeof SurveyConfig,
  draftIdKey: keyof SurveyDraftKeys
) {
  const isTraining = appModel.attrs.training ? 't' : null;
  const sample = await survey.create(Sample, isTraining, CONFIG.deviceVersion);
  await sample.save();

  savedSamples.push(sample);
  appModel.attrs[draftIdKey] = sample.cid;
  await appModel.save();

  return sample;
}

async function getDraft(draftIdKey: keyof SurveyDraftKeys, alert: any) {
  const draftID = appModel.attrs[draftIdKey];
  if (draftID) {
    const byId = ({ cid }: any) => cid === draftID;
    const draftSample = savedSamples.find(byId);
    if (draftSample && !draftSample.isDisabled()) {
      const continueDraftRecord = await showDraftAlert(alert);
      if (continueDraftRecord) {
        return draftSample;
      }

      draftSample.destroy();
    }
  }

  return null;
}

type Props = {
  survey: typeof SurveyConfig;
};

function StartNewSurvey({ survey }: Props): null {
  const { navigate } = useContext(NavContext);
  const alert = useAlert();

  const baseURL = `/survey/${survey.name}`;

  const draftIdKey: any = `draftId:${survey.name}`;

  const pickDraftOrCreateSampleWrap = () => {
    const pickDraftOrCreateSample = async () => {
      let sample = await getDraft(draftIdKey, alert);
      if (!sample) {
        sample = await getNewSample(survey, draftIdKey);
      }

      const url = `${baseURL}/${sample!.cid}`;

      navigate(url, 'none', 'replace');
    };

    pickDraftOrCreateSample();
  };

  const disableBackButton = () => {
    const disableHardwareBackButton = (event: any) =>
      event.detail.register(101, () => null);

    document.addEventListener('ionBackButton', disableHardwareBackButton);

    const removeEventListener = () =>
      document.removeEventListener('ionBackButton', disableHardwareBackButton);
    return removeEventListener;
  };
  useEffect(disableBackButton);

  useEffect(pickDraftOrCreateSampleWrap, []);

  return null;
}

// eslint-disable-next-line @getify/proper-arrows/name
StartNewSurvey.with = (survey: typeof SurveyConfig) => {
  const StartNewSurveyWrap = (params: any) => (
    <StartNewSurvey survey={survey} {...params} />
  );

  return StartNewSurveyWrap;
};

export default StartNewSurvey;
