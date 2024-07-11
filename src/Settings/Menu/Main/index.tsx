import { FC } from 'react';
import { observer } from 'mobx-react';
import { arrowUndoSharp, schoolOutline, shareOutline } from 'ionicons/icons';
import { Main, useAlert, InfoMessage, Toggle } from '@flumens';
import { IonIcon, IonList, IonItem } from '@ionic/react';
import './styles.scss';

const useResetDialog = (resetApp: any) => {
  const alert = useAlert();

  const alertDialog = () =>
    alert({
      header: 'Reset',
      skipTranslation: true,
      message: (
        <>
          Are you sure you want to reset the application to its initial state?
          <p>
            <b>This will wipe all the locally stored app data!</b>
          </p>
        </>
      ),
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Reset',
          cssClass: 'secondary',
          handler: resetApp,
        },
      ],
    });
  return alertDialog;
};

type Props = {
  resetApp: () => void;
  sendAnalytics: boolean;
  useTraining: boolean;
  onToggle: (prop: string, checked: boolean) => void;
};

const MenuMain: FC<Props> = ({
  resetApp,
  sendAnalytics,
  useTraining,
  onToggle,
}) => {
  const showAlertDialog = useResetDialog(resetApp);

  const onSendAnalyticsToggle = (checked: boolean) =>
    onToggle('sendAnalytics', checked);

  const onTrainingToggle = (checked: boolean) => onToggle('training', checked);

  return (
    <Main>
      <IonList lines="full">
        <div className="rounded-list">
          <Toggle
            prefix={<IonIcon src={shareOutline} className="size-6" />}
            label="Share App Analytics"
            defaultSelected={sendAnalytics}
            onChange={onSendAnalyticsToggle}
          />
          <InfoMessage inline>
            Share app crash data so we can make the app more reliable.
          </InfoMessage>
        </div>

        <div className="rounded-list mt-4">
          <Toggle
            prefix={<IonIcon src={schoolOutline} className="size-6" />}
            label="Training Mode"
            defaultSelected={useTraining}
            onChange={onTrainingToggle}
          />
          <InfoMessage inline>
            Mark any new records as 'training' and exclude from all reports.
          </InfoMessage>
        </div>

        <div className="rounded-list mt-4">
          <IonItem id="app-reset-btn" onClick={showAlertDialog}>
            <IonIcon icon={arrowUndoSharp} size="small" slot="start" />
            Reset App
          </IonItem>
          <InfoMessage inline>
            You can reset the app data to its default settings.
          </InfoMessage>
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MenuMain);
