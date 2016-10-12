/** ****************************************************************************
 * Record Edit controller.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import _ from 'lodash';
import Morel from 'morel';
import { Device, ImageHelp, Analytics, Log, StringHelp, Validate } from 'helpers';
import App from 'app';
import JST from 'JST';
import appModel from '../../common/models/app_model';
import userModel from '../../common/models/user_model';
import recordManager from '../../common/record_manager';
import MainView from './main_view';
import HeaderView from './header_view';
import FooterView from './footer_view';

const API = {
  show(recordID) {
    Log('Records:Edit:Controller: showing');
    recordManager.get(recordID, (err, recordModel) => {
      if (err) {
        Log(err, 'e');
      }

      // Not found
      if (!recordModel) {
        Log('No record model found', 'e');
        App.trigger('404:show', { replace: true });
        return;
      }

      // can't edit a saved one - to be removed when record update
      // is possible on the server
      if (recordModel.getSyncStatus() === Morel.SYNCED) {
        App.trigger('records:show', recordID, { replace: true });
        return;
      }


      // MAIN
      const mainView = new MainView({
        model: new Backbone.Model({ recordModel, appModel }),
      });
      App.regions.getRegion('main').show(mainView);

      // on finish sync move to show
      function checkIfSynced() {
        if (recordModel.getSyncStatus() === Morel.SYNCED) {
          App.trigger('records:show', recordID, { replace: true });
          return;
        }
      }
      recordModel.on('request sync error', checkIfSynced);
      mainView.on('destroy', () => {
        // unbind when page destroyed
        recordModel.off('request sync error', checkIfSynced);
      });


      // HEADER
      const headerView = new HeaderView({
        model: recordModel,
      });

      headerView.on('save', () => {
        API.save(recordModel);
      });

      App.regions.getRegion('header').show(headerView);

      // FOOTER
      const footerView = new FooterView({
        model: recordModel,
      });

      footerView.on('photo:upload', (e) => {
        const photo = e.target.files[0];
        API.photoUpload(recordModel, photo);
      });

      footerView.on('childview:photo:delete', (view) => {
        const photo = view.model;
        API.photoDelete(photo);
      });

      // android gallery/camera selection
      footerView.on('photo:selection', () => {
        API.photoSelect(recordModel);
      });

      App.regions.getRegion('footer').show(footerView);
    });
  },

  save(recordModel) {
    const valid = API.saveRecord(recordModel, (saveErr) => {
      if (saveErr) {
        App.regions.getRegion('dialog').error(saveErr);
      }
    });

    // invalid sample
    if (!valid) {
      const invalids = recordModel.validationError;
      API.showInvalidsMessage(invalids);
    }
  },

  saveRecord(recordModel, callback) {
    Log('Records:Edit:Controller: save clicked');

    const valid = recordModel.setToSend((setError) => {
      if (setError) {
        callback(setError);
        return;
      }

      if (Device.isOnline() && !userModel.hasLogIn()) {
        API.askLogin(() => {
          recordModel.metadata.anonymous = true;
          recordModel.save(null, { remote: true });
        });
        return;
      }

      // sync
      // todo: call callback
      recordModel.save(null, { remote: true });
      App.trigger('record:saved');
    });

    return valid;
  },

  showInvalidsMessage(invalids) {
    delete invalids.sample.saved; // it wasn't saved so of course this error

    let missing = '';
    if (invalids.occurrences) {
      _.each(invalids.occurrences, (message, invalid) => {
        missing += `<b>${invalid}</b> - ${message}</br>`;
      });
    }
    if (invalids.sample) {
      _.each(invalids.sample, (message, invalid) => {
        missing += `<b>${invalid}</b> - ${message}</br>`;
      });
    }

    App.regions.getRegion('dialog').show({
      title: 'Sorry',
      body: missing,
      timeout: 2000,
    });
  },

  photoUpload(recordModel, photo) {
    Log('Records:Edit:Controller: photo uploaded');

    const occurrence = recordModel.occurrences.at(0);
    // show loader
    API.addPhoto(occurrence, photo, (occErr) => {
      // hide loader
      if (occErr) {
        App.regions.getRegion('dialog').error(occErr);
      }
    });
  },

  askLogin(anonymousCallback) {
    App.regions.getRegion('dialog').show({
      title: '',
      body: 'Please select <b>Login</b> if you have an iRecord account or would like to register, otherwise select <b>Submit</b> and enter your contact details.',
      buttons: [
        {
          title: 'Login',
          class: 'btn-positive',
          onClick() {
            App.regions.getRegion('dialog').hide();
            App.trigger('user:login', { replace: true });
          },
        },
        {
          title: 'Submit',
          onClick() {
            API.askAnonymous(anonymousCallback);
          },
        },
      ],
    });
  },

  askAnonymous(callback) {
    const EditView = Marionette.View.extend({
      template: JST['records/edit/anonymous'],
      getValues() {
        let values = {
          email: StringHelp.escape(this.$el.find('#email').val()),
          name: StringHelp.escape(this.$el.find('#name').val()),
          surname: StringHelp.escape(this.$el.find('#surname').val()),
        };

        if (!Validate.email(values.email)) {
          values = {};
        }
        return values;
      },

      onAttach() {
        const $input = this.$el.find('#email');
        $input.focus();
        if (Device.isAndroid()) {
          window.Keyboard.show();
          $input.focusout(() => {
            window.Keyboard.hide();
          });
        }
      },
    });

    const editView = new EditView({ model: location });

    App.regions.getRegion('dialog').show({
      title: 'Your details',
      body: editView,
      buttons: [
        {
          title: 'Submit',
          class: 'btn-positive',
          onClick() {
            // update location
            const user = editView.getValues();
            userModel.setContactDetails(user);
            App.regions.getRegion('dialog').hide();
            callback(); // send record
            window.history.back();
          },
        },
        {
          title: 'Cancel',
          onClick() {
            App.regions.getRegion('dialog').hide();
          },
        },
      ],
    });
  },

  photoDelete(photo) {
    App.regions.getRegion('dialog').show({
      title: 'Delete',
      body: 'Are you sure you want to remove this photo from the record?' +
      '</br><i><b>Note:</b> it will remain in the gallery.</i>',
      buttons: [
        {
          title: 'Cancel',
          onClick() {
            App.regions.getRegion('dialog').hide();
          },
        },
        {
          title: 'Delete',
          class: 'btn-negative',
          onClick() {
            // show loader
            photo.destroy({
              success: () => {
                Log('Records:Edit:Controller: photo deleted');

                // hide loader
              },
            });
            App.regions.getRegion('dialog').hide();
            Analytics.trackEvent('Record', 'photo remove');
          },
        },
      ],
    });
  },

  photoSelect(recordModel) {
    Log('Records:Edit:Controller: photo selection');
    const occurrence = recordModel.occurrences.at(0);

    App.regions.getRegion('dialog').show({
      title: 'Choose a method to upload a photo',
      buttons: [
        {
          title: 'Camera',
          onClick() {
            ImageHelp.getImage((entry) => {
              API.addPhoto(occurrence, entry.nativeURL, (occErr) => {
                if (occErr) {
                  App.regions.getRegion('dialog').error(occErr);
                }
              });
            });
            App.regions.getRegion('dialog').hide();
          },
        },
        {
          title: 'Gallery',
          onClick() {
            ImageHelp.getImage((entry) => {
              API.addPhoto(occurrence, entry.nativeURL, (occErr) => {
                if (occErr) {
                  App.regions.getRegion('dialog').error(occErr);
                }
              });
            }, {
              sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY,
              saveToPhotoAlbum: false,
            });
            App.regions.getRegion('dialog').hide();
          },
        },
      ],
    });
  },

  /**
   * Adds a new image to occurrence.
   */
  addPhoto(occurrence, photo, callback) {
    ImageHelp.getImageModel(photo, (err, image) => {
      if (err || !image) {
        const error = new Error('Missing image.');
        callback(error);
        return;
      }
      occurrence.addImage(image);

      occurrence.save(null, {
        success: () => {
          callback();
        },
        error: (error) => {
          Log(error, 'e');
          callback(error);
        },
      });
    });
  },
};

export { API as default };
