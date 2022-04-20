import React, { FC, useState } from 'react';
import {
  IonList,
  IonToolbar,
  IonHeader,
  IonLabel,
  IonBadge,
  IonSegmentButton,
  IonSegment,
  IonButton,
} from '@ionic/react';
import { Page, Main, device, useToast } from '@flumens';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import savedSamples from 'models/savedSamples';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import Survey from './components/Survey';
import './images/empty-samples-list-icon.svg';
import './styles.scss';

function byCreateTime(smp1: Sample, smp2: Sample) {
  const date1 = new Date(smp1.metadata.created_on);
  const date2 = new Date(smp2.metadata.created_on);
  return date2.getTime() - date1.getTime();
}

function hasManyPending(pendingSurveys: Sample[]) {
  return pendingSurveys.length > 2;
}

function getPendingSurveys(surveys: any[], uploadIsPrimary: boolean) {
  const byFinishedSurvey = (sample: Sample) => sample.metadata.saved;
  const finishedSurvey = surveys.find(byFinishedSurvey);

  if (!surveys.length) {
    return (
      <IonList lines="full">
        <InfoBackgroundMessage>
          No finished pending surveys.
        </InfoBackgroundMessage>
      </IonList>
    );
  }

  const getSurveyEntry = (sample: Sample) => (
    <Survey
      key={sample.cid}
      sample={sample}
      uploadIsPrimary={uploadIsPrimary}
    />
  );
  const surveysList = surveys.map(getSurveyEntry);

  if (finishedSurvey) {
    return (
      <IonList lines="full">
        {surveysList}

        <InfoBackgroundMessage name="showSurveyUploadTip">
          Please do not forget to upload any pending surveys!
        </InfoBackgroundMessage>
      </IonList>
    );
  }

  return (
    <IonList lines="full">
      {surveysList}

      <InfoBackgroundMessage name="showSurveysDeleteTip">
        To delete any surveys swipe it to the left.
      </InfoBackgroundMessage>
    </IonList>
  );
}

function getUploadedSurveys(surveys: any[]) {
  if (!surveys.length) {
    return (
      <IonList lines="full">
        <InfoBackgroundMessage>No uploaded surveys</InfoBackgroundMessage>
      </IonList>
    );
  }

  const getUploadedSurveyEntry = (sample: Sample) => (
    <Survey key={sample.cid} sample={sample} />
  );
  const surveysList = surveys.map(getUploadedSurveyEntry);

  return <IonList lines="full">{surveysList}</IonList>;
}

interface Props {}

const UserSurveys: FC<Props> = () => {
  const [segment, setSegment] = useState('pending');
  const toast = useToast();

  const onSegmentClick = (e: any) => setSegment(e.detail.value);

  const getSamplesList = (uploaded?: boolean) => {
    const uploadedSamples = (sample: Sample) =>
      uploaded ? sample.metadata.synced_on : !sample.metadata.synced_on;
    return savedSamples.filter(uploadedSamples).sort(byCreateTime);
  };

  const onUploadAll = () => {
    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return;
    }

    savedSamples.uploadAll();
  };

  const showingPending = segment === 'pending';
  const showingUploaded = segment === 'uploaded';

  const pendingSurveys = getSamplesList();
  const uploadedSurveys = getSamplesList(true);

  const getPendingSurveysCount = () => {
    if (!pendingSurveys.length) {
      return null;
    }

    return (
      <IonBadge color="secondary" slot="end">
        {pendingSurveys.length}
      </IonBadge>
    );
  };

  const getUploadedSurveysCount = () => {
    if (!uploadedSurveys.length) {
      return null;
    }

    return (
      <IonBadge color="light" slot="end">
        {uploadedSurveys.length}
      </IonBadge>
    );
  };

  const showUploadAll = hasManyPending(pendingSurveys);

  return (
    <Page id="surveys-list">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonSegment onIonChange={onSegmentClick} value={segment}>
            <IonSegmentButton value="pending">
              <IonLabel className="ion-text-wrap">
                Pending
                {getPendingSurveysCount()}
              </IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value="uploaded">
              <IonLabel className="ion-text-wrap">
                Uploaded
                {getUploadedSurveysCount()}
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <Main>
        {showingPending && showUploadAll && (
          <IonButton
            expand="block"
            size="small"
            className="upload-all-button"
            color="secondary"
            onClick={onUploadAll}
          >
            Upload All
          </IonButton>
        )}

        {showingPending && getPendingSurveys(pendingSurveys, !showUploadAll)}
        {showingUploaded && getUploadedSurveys(uploadedSurveys)}
      </Main>
    </Page>
  );
};

export default observer(UserSurveys);
