import React, { useEffect, useContext } from 'react';
import { NavContext } from '@ionic/react';
import Sample from 'models/sample';
import { useAlert } from '@flumens';
import appModel, { SurveyDraftKeys } from 'models/app';
import { useRouteMatch } from 'react-router';
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
  const sample = await survey.create(Sample);
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
    if (draftSample) {
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
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const alert = useAlert();

  const draftIdKey: keyof SurveyDraftKeys = `draftId:survey`;

  const pickDraftOrCreateSampleWrap = () => {
    // eslint-disable-next-line
    (async () => {
      let sample = await getDraft(draftIdKey, alert);
      if (!sample) {
        sample = await getNewSample(survey, draftIdKey);
      }

      const url = `${match.url}/${sample.cid}`;

      navigate(url, 'none', 'replace');
    })();
  };

  const disableBackButton = () => {
    const disableHardwareBackButton = (event: any) =>
      event.detail.register(101, () => null);

    document.addEventListener('ionBackButton', disableHardwareBackButton);

    return () =>
      document.removeEventListener('ionBackButton', disableHardwareBackButton);
  };
  useEffect(disableBackButton);

  useEffect(pickDraftOrCreateSampleWrap, [match.url]);

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
