/** ****************************************************************************
 * Sample List controller.
 *****************************************************************************/
import Indicia from 'indicia';
import radio from 'radio';
import Log from 'helpers/log';
import Analytics from 'helpers/analytics';
import userModel from 'user_model';
import appModel from 'app_model';
import savedSamples from 'saved_samples';
import MainView from './main_view';
import HeaderView from './header_view';

const API = {
  show() {
    // wait till savedSamples is fully initialized
    if (savedSamples.fetching) {
      const that = this;
      savedSamples.once('fetching:done', () => {
        API.show.apply(that);
      });
      return;
    }

    Log(`Samples:List:Controller: showing ${savedSamples.length}.`);

    // clean from drafts
    API.clearDrafts(savedSamples);

    // MAIN
    const mainView = new MainView({
      collection: savedSamples,
      appModel,
      userModel,
    });

    mainView.on('childview:sample:edit:attr', (childView, attr) => {
      radio.trigger('samples:edit:attr', childView.model.cid, attr);
    });

    mainView.on('childview:sample:delete', (childView) => {
      const sample = childView.model;
      API.sampleDelete(sample);
    });
    radio.trigger('app:main', mainView);

    // HEADER
    const headerView = new HeaderView();

    headerView.on('photo:upload', (e) => {
      const photo = e.target.files[0];
      API.photoUpload(photo);
    });

    // android gallery/camera selection
    headerView.on('photo:selection', API.photoSelect);

    radio.trigger('app:header', headerView);

    // FOOTER
    radio.trigger('app:footer:hide');
  },

  sampleDelete(sample) {
    Log('Samples:List:Controller: deleting sample.');

    const syncStatus = sample.getSyncStatus();
    let body = 'This record hasn\'t been saved to iRecord yet, ' +
      'are you sure you want to remove it from your device?';

    if (syncStatus === Indicia.SYNCED) {
      body = 'Are you sure you want to remove this record from your device?';
      body += '</br><i><b>Note:</b> it will remain on the server.</i>';
    }
    radio.trigger('app:dialog', {
      title: 'Delete',
      body,
      buttons: [
        {
          title: 'Cancel',
          onClick() {
            radio.trigger('app:dialog:hide');
          },
        },
        {
          title: 'Delete',
          class: 'btn-negative',
          onClick() {
            sample.destroy();
            radio.trigger('app:dialog:hide');
            Analytics.trackEvent('List', 'sample remove');
          },
        },
      ],
    });
  },

  clearDrafts(savedSamples) {
    savedSamples.each((sample) => {
      if (!sample.metadata.saved) {
        Log(`Samples:List:Controller: clearing sample ${sample.cid}.`);
        sample.destroy();
      }
    });
  },
};

export { API as default };
