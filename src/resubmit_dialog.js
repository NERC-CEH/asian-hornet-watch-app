import savedSamples from 'saved_samples';
import radio from 'radio';
import appModel from 'app_model';
import Analytics from 'helpers/analytics';
import Device from 'helpers/device';

const missingRecordId = 'e36b987a-b273-4050-b786-f6134d404589';

function isMissingRecordOwner() {
  const sample = savedSamples.get(missingRecordId);
  return !!sample;
}

function showDialog() {
  radio.trigger('app:dialog', {
    title: 'Please contact us',
    body: `Looks like you have sent a record and photo from Holloway (London) 
      relating to a sighting in the summer. Please could you contact 
      <a href='mailto:alert_nonnative%40ceh.ac.uk?subject=Asian%20Hornets%20Watch%20Support&body=Hi,%20I%20have%20sent%20the%20asian%20hornet%20record%20from%20the%20Holloway%20area.'>alert_nonnative@ceh.ac.uk</a>`,
    buttons: [
      {
        title: 'Send Email',
        onClick() {
          window.location.href =
            'mailto:alert_nonnative%40ceh.ac.uk?subject=Asian%20Hornets%20Watch%20Support&body=Hi,%20I%20have%20sent%20the%20asian%20hornet%20record%20from%20the%20Holloway%20area.';
          radio.trigger('app:dialog:hide');
        },
      },
    ],
  });
}

function run() {
  if (isMissingRecordOwner()) {
    if (!appModel.get('dialogWasShown')) {
      Analytics.trackEvent('App', 'found_the_missing_user');
      showDialog();
      appModel.set('dialogWasShown', true).save();
    }
  }
}

export default () => {
  if (!Device.isAndroid()) {
    return;
  }

  if (savedSamples.fetching) {
    savedSamples.once('fetching:done', run);
    return;
  }

  run();
};
