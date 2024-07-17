import { calendarOutline, locationOutline } from 'ionicons/icons';
import { z, object } from 'zod';
import { dateFormat } from '@flumens';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import numberIcon from 'common/images/number.svg';
import Occurrence from 'models/occurrence';

const numberValues = [
  { isDefault: true, label: 'Present' },
  { value: '1', id: 665 },
  { value: '2-5', id: 666 },
  { value: '6-20', id: 667 },
  { value: '21-100', id: 668 },
  { value: '101-500', id: 669 },
  { value: '500+', id: 670 },
];

export const commentAttr = {
  id: 'comment',
  type: 'text_input',
  title: 'Comment',
  description: 'Any extra info about this report.',
  appearance: 'multiline',
} as const;

const survey = {
  name: 'main',
  label: 'Record',
  id: 423,

  getDraftIdKey: () => `draftId:${survey.name}`,

  attrs: {
    device: {
      id: 273,
      values: { iOS: 2398, Android: 2399 },
    },

    device_version: { id: 759 },
    app_version: { id: `smpAttr:1139` },

    location: {
      menuProps: { icon: locationOutline },
      remote: {
        id: 'entered_sref',
        values(location: any, submission: any) {
          // convert accuracy for map and gridref sources
          const {
            accuracy,
            source,
            gridref,
            altitude,
            name,
            altitudeAccuracy,
          } = location;

          // add other location related attributes
          // eslint-disable-next-line
          submission.values = { ...submission.values };

          submission.values['smpAttr:760'] = source; // eslint-disable-line
          submission.values['smpAttr:335'] = gridref; // eslint-disable-line
          submission.values['smpAttr:282'] = accuracy; // eslint-disable-line
          submission.values['smpAttr:283'] = altitude; // eslint-disable-line
          submission.values['smpAttr:284'] = altitudeAccuracy; // eslint-disable-line
          submission.values['location_name'] = name; // eslint-disable-line

          const lat = parseFloat(location.latitude);
          const lon = parseFloat(location.longitude);
          if (Number.isNaN(lat) || Number.isNaN(lat)) {
            return null;
          }

          return `${lat.toFixed(7)}, ${lon.toFixed(7)}`;
        },
      },
    },

    date: {
      menuProps: { parse: 'date', icon: calendarOutline },
      pageProps: {
        attrProps: {
          input: 'date',
          inputProps: {
            max: () => new Date(),
            label: 'Date',
            icon: calendarOutline,
            autoFocus: false,
          },
        },
      },
      remote: { values: (date: Date) => dateFormat.format(new Date(date)) },
    },

    // anonymous user info
    firstname: { remote: { id: 6 } },
    secondname: { remote: { id: 7 } },
    user_email: { remote: { id: `8` } }, // email key is taken
    // user_email: { remote: { id: `smpAttr:8` } }, // email key is taken
    phone: { remote: { id: 20 } },
  },

  occ: {
    attrs: {
      taxon: {
        remote: {
          id: 'taxa_taxon_list_id',
          values: (taxon: any) => taxon.warehouse_id,
        },
      },

      number: {
        menuProps: { icon: numberIcon },
        pageProps: {
          attrProps: {
            input: 'radio',
            info: 'How many individuals of this type',
            inputProps: { options: numberValues },
          },
        },
        remote: { id: 523, values: numberValues },
      },
    },

    create(training: string | null) {
      return new Occurrence({
        metadata: {
          confidential: 't',
          release_status: 'P',
          sensitivity_precision: 100000,
          // training is required for backwards compatibility - some verification pages don't use sample lvl flag
          training,
        },
        attrs: {
          comment: null,
          taxon: null,
          number: null,
        },
      });
    },

    verify: (attrs: any) =>
      object({
        taxon: z.object(
          { warehouse_id: z.number() },
          { invalid_type_error: 'Species is missing.' }
        ),
      }).safeParse(attrs).error,
  },

  verify: (attrs: any) =>
    object({
      location: object(
        { latitude: z.number(), longitude: z.number() },
        { invalid_type_error: 'Please select location.' }
      ),
    }).safeParse(attrs).error,

  create(
    Sample: any,
    training: string | null,
    deviceVersion: string | undefined
  ) {
    const sample = new Sample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
        training,
      },

      attrs: {
        input_form: 'enter-app-record',
        location_type: 'latlon',
        location: null,
        device: isPlatform('android') ? 'Android' : 'iOS',
        device_version: deviceVersion,
        app_version: config.version,
      },
    });

    const occurrence = survey.occ.create(training);
    sample.occurrences.push(occurrence);

    sample.startGPS();

    return sample;
  },
};

export default survey;
