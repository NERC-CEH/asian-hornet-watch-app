/** ****************************************************************************
 * Sample Edit controller.
 *****************************************************************************/
import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import _ from 'lodash';
import Indicia from 'indicia';
import Device from 'helpers/device';
import Validate from 'helpers/validate';
import StringHelp from 'helpers/string';
import ImageHelp from 'helpers/image';
import Analytics from 'helpers/analytics';
import Log from 'helpers/log';
import App from 'app';
import JST from 'JST';
import radio from 'radio';
import appModel from 'app_model';
import userModel from 'user_model';
import savedSamples from 'saved_samples';
import ImageModel from '../../common/models/image';
import MainView from './main_view';
import HeaderView from './header_view';
import FooterView from './footer_view';

const API = {
  show(sampleID) {
    // wait till savedSamples is fully initialized
    if (savedSamples.fetching) {
      const that = this;
      savedSamples.once('fetching:done', () => {
        API.show.apply(that, [sampleID]);
      });
      return;
    }

    Log('Samples:Edit:Controller: showing.');

    const sample = savedSamples.get(sampleID);
    // Not found
    if (!sample) {
      Log('No sample model found.', 'e');
      radio.trigger('app:404:show', { replace: true });
      return;
    }

    // can't edit a saved one - to be removed when sample update
    // is possible on the server
    if (sample.getSyncStatus() === Indicia.SYNCED) {
      radio.trigger('samples:show', sampleID, { replace: true });
      return;
    }


    // MAIN
    const mainView = new MainView({
      model: new Backbone.Model({ sample, appModel }),
    });
    radio.trigger('app:main', mainView);

    // on finish sync move to show
    function checkIfSynced() {
      if (sample.getSyncStatus() === Indicia.SYNCED) {
        radio.trigger('samples:show', sampleID, { replace: true });
      }
    }
    sample.on('request sync error', checkIfSynced);
    mainView.on('destroy', () => {
      // unbind when page destroyed
      sample.off('request sync error', checkIfSynced);
    });


    // HEADER
    const headerView = new HeaderView({
      model: sample,
    });

    headerView.on('save', () => {
      API.save(sample);
    });

    radio.trigger('app:header', headerView);

    // FOOTER
    const footerView = new FooterView({
      model: sample,
    });

    footerView.on('photo:upload', (e) => {
      const photo = e.target.files[0];
      API.photoUpload(sample, photo);
    });

    footerView.on('childview:photo:delete', (view) => {
      const photo = view.model;
      API.photoDelete(photo);
    });

    // android gallery/camera selection
    footerView.on('photo:selection', () => {
      API.photoSelect(sample);
    });

    radio.trigger('app:footer', footerView);
  },


  save(sample) {
    Log('Samples:Edit:Controller: save clicked.');

    const promise = sample.setToSend();

    // invalid sample
    if (!promise) {
      const invalids = sample.validationError;
      API.showInvalidsMessage(invalids);
      return;
    }

    promise
      .then(() => {
        // should we sync?
        if (!Device.isOnline()) {
          radio.trigger('app:dialog:error', {
            message: 'Looks like you are offline!',
          });
          return;
        }

        function onError(err = {}) {
          Log(err, 'e');

          const visibleDialog = App.regions.getRegion('dialog').$el.is(':visible');
          // we don't want to close any other dialog
          if (err.message && !visibleDialog) {
            radio.trigger('app:dialog:error',
              `Sorry, we have encountered a problem while sending the record.
                
                 <p><i>${err.message}</i></p>`
            );
          }
        }

        if (Device.isOnline() && !userModel.hasLogIn()) {
          API.askLogin((user) => {
            sample.metadata.anonymous = true;

            sample.save({
              user_email: user.email,
              firstname: user.firstname,
              secondname: user.secondname,
              phone: user.phone,
            }, { remote: true }).catch(onError);
          });
          return;
        }

        // sync
        sample.save({
            user_email: userModel.get('email'),
            firstname: userModel.get('firstname'),
            secondname: userModel.get('secondname'),
          }, { remote: true }).catch(onError);
        radio.trigger('sample:saved');
      })
      .catch((err) => {
        Log(err, 'e');
        radio.trigger('app:dialog:error', err);
      });
  },

  showInvalidsMessage(invalids) {
    // it wasn't saved so of course this error
    delete invalids.sample.saved; // eslint-disable-line

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

    radio.trigger('app:dialog', {
      title: 'Sorry',
      body: missing,
      timeout: 2000,
    });
  },

  photoUpload(sample, photo) {
    Log('Samples:Edit:Controller: photo uploaded.');

    const occurrence = sample.getOccurrence();
    // todo: show loader
    API.addPhoto(occurrence, photo).catch((err) => {
      Log(err, 'e');
      radio.trigger('app:dialog:error', err);
    });
  },

  askLogin(anonymousCallback) {
    radio.trigger('app:dialog', {
      title: '',
      body: 'Please select <b>Login</b> if you have an iRecord account or would like to register, otherwise select <b>Send</b> and enter your contact details.',
      buttons: [
        {
          title: 'Login',
          class: 'btn-positive',
          onClick() {
            radio.trigger('app:dialog:hide');
            radio.trigger('user:login', { replace: true });
          },
        },
        {
          title: 'Send',
          onClick() {
            API.askAnonymous(anonymousCallback);
          },
        },
      ],
    });
  },

  askAnonymous(callback) {
    const EditView = Marionette.View.extend({
      template: JST['samples/edit/anonymous'],
      getValues() {
        const values = {
          email: StringHelp.escape(this.$el.find('#user-email').val()),
          firstname: StringHelp.escape(this.$el.find('#user-name').val()),
          secondname: StringHelp.escape(this.$el.find('#user-surname').val()),
          phone: StringHelp.escape(this.$el.find('#user-phone').val()),
        };

        return values;
      },

      onFormDataInvalid(errors) {
        const $view = this.$el;
        Validate.updateViewFormErrors($view, errors, '#user-');
      },

      onAttach() {
        const $input = this.$el.find('#user-email');
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
          title: 'Send',
          class: 'btn-positive',
          onClick() {
            // update user
            const user = editView.getValues();
            // validate
            const errors = API.validateAnonymous(user);
            if (errors) {
              editView.onFormDataInvalid(errors);
              return;
            }
            App.regions.getRegion('dialog').hide();
            callback(user); // send record
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

  validateAnonymous(attrs) {
    const errors = {};

    if (!attrs.email) {
      errors.email = "can't be blank";
    } else if (!Validate.email(attrs.email)) {
      errors.email = 'invalid';
    }

    if (!attrs.firstname) {
      errors.name = "can't be blank";
    }

    if (!attrs.secondname) {
      errors.surname = "can't be blank";
    }

    if (!_.isEmpty(errors)) {
      return errors;
    }

    return null;
  },

  photoDelete(photo) {
    radio.trigger('app:dialog', {
      title: 'Delete',
      body: 'Are you sure you want to remove this photo from the sample?' +
      '</br><i><b>Note:</b> it will remain in the gallery.</i>',
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
            // show loader
            photo.destroy({
              success: () => {
                Log('Samples:Edit:Controller: photo deleted.');

                // hide loader
              },
            });
            radio.trigger('app:dialog:hide');
            Analytics.trackEvent('Sample', 'photo remove');
          },
        },
      ],
    });
  },

  photoSelect(sample) {
    Log('Samples:Edit:Controller: photo selection.');
    const occurrence = sample.getOccurrence();

    radio.trigger('app:dialog', {
      title: 'Choose a method to upload a photo',
      buttons: [
        {
          title: 'Camera',
          onClick() {
            ImageHelp.getImage((entry) => {
              API.addPhoto(occurrence, entry.nativeURL, (occErr) => {
                if (occErr) {
                  radio.trigger('app:dialog:error', occErr);
                }
              });
            });
            radio.trigger('app:dialog:hide');
          },
        },
        {
          title: 'Gallery',
          onClick() {
            ImageHelp.getImage((entry) => {
              API.addPhoto(occurrence, entry.nativeURL, (occErr) => {
                if (occErr) {
                  radio.trigger('app:dialog:error', occErr);
                }
              });
            }, {
              sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY,
              saveToPhotoAlbum: false,
            });
            radio.trigger('app:dialog:hide');
          },
        },
      ],
    });
  },

  /**
   * Adds a new image to occurrence.
   */
  addPhoto(occurrence, photo) {
    return ImageHelp.getImageModel(ImageModel, photo)
      .then((image) => {
        occurrence.addMedia(image);
        return occurrence.save();
      });
  },
};

export { API as default };
