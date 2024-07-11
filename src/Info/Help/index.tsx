import {
  settingsOutline,
  arrowUndoSharp,
  personOutline,
  personAddOutline,
  informationCircleOutline,
  exitOutline,
  layersOutline,
} from 'ionicons/icons';
import { Header, Page, Main, Collapse } from '@flumens';
import { IonIcon } from '@ionic/react';
import CONFIG from 'common/config';
import deleteRecordImg from './deleteRecord.jpg';
import './styles.scss';

const Help = () => {
  return (
    <Page id="help">
      <Header title="Help" />
      <Main>
        <h2 className="list-title">Records</h2>
        <div className="rounded-list">
          <Collapse title="How to make a new record">
            <div className="collapse-content-wrapper">
              <p>
                Please press the 'Record' button in the home page. This will
                bring you to the record form page. After selecting the species,
                fill in the details of the sighting, like location, date, number
                seen etc.
              </p>
              <p>
                When finished, set for submission by pressing the
                'Finish'/'Upload' button.
              </p>
            </div>
          </Collapse>

          <Collapse title="Sync. with iRecord">
            <div className="collapse-content-wrapper">
              <p>
                All your saved records will be shown on the 'Records'{' '}
                <IonIcon icon={layersOutline} /> page. Once it has successfully
                reached the database the record becomes unavailable for new
                edits. To further edit it please use the{' '}
                <a href="https://irecord.org.uk">iRecord Website</a>.
              </p>

              <p>
                All records submitted via the Hornet app are initially treated
                as confidential and will not appear in other iRecord reports
                unless the confidential status is retracted.
              </p>

              <p>
                <b>Note:</b> you have to be signed in to your iRecord account
                and have a network connection, for the records to be
                automatically synchronised in the background.
              </p>
            </div>
          </Collapse>

          <Collapse title="Delete a record">
            <div className="collapse-content-wrapper">
              <p>
                To delete a record, swipe it left in the Records page and click
                the delete button.
                <img src={deleteRecordImg} />
              </p>
            </div>
          </Collapse>
        </div>

        <h2 className="list-title">User</h2>
        <div className="rounded-list">
          <Collapse title=" Sign in/out or register">
            <div className="collapse-content-wrapper">
              <p>
                To login, open the app info page{' '}
                <IonIcon icon={informationCircleOutline} />, click Login{' '}
                <IonIcon icon={personOutline} /> or Register{' '}
                <IonIcon icon={personAddOutline} /> buttons and follow the
                instructions.
              </p>

              <p>
                To logout, visit the app info page{' '}
                <IonIcon icon={informationCircleOutline} /> and click the logout{' '}
                <IonIcon icon={exitOutline} /> button.
              </p>

              <p>
                <b>Note:</b> after registering a new account you must verify
                your email address by clicking on a verification link sent to
                your email.
              </p>
            </div>
          </Collapse>
        </div>

        <h2 className="list-title">Other</h2>
        <div className="rounded-list">
          <Collapse title="Reset the application">
            <div className="collapse-content-wrapper">
              <p>
                Go to the application settings page{' '}
                <IonIcon icon={settingsOutline} /> and click on the Reset{' '}
                <IonIcon icon={arrowUndoSharp} /> button.
              </p>
            </div>
          </Collapse>
        </div>

        <p className="mt-2 p-2">
          For more help please visit the iRecord{' '}
          <a href="https://irecord.org.uk/forum">forum</a>. Or drop us an{' '}
          <a
            href={`mailto:apps%40ceh.ac.uk?subject=Asian%20Hornet%20Watch%20Support%26Feedback&body=%0A%0A%0AVersion%3A%20 ${CONFIG.version}`}
          >
            email
          </a>
          .
        </p>
      </Main>
    </Page>
  );
};

export default Help;
