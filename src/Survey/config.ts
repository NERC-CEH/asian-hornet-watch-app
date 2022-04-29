import { date as dateHelp } from '@flumens';
import {
  calendarOutline,
  chatboxOutline,
  locationOutline,
} from 'ionicons/icons';
import * as Yup from 'yup';
import Occurrence from 'models/occurrence';
import numberIcon from 'common/images/number.svg';

const fixedLocationSchema = Yup.object().shape({
  latitude: Yup.number().required(),
  longitude: Yup.number().required(),
  name: Yup.string().required(),
});

const validateLocation = (val: any) => {
  try {
    fixedLocationSchema.validateSync(val);
    return true;
  } catch (e) {
    return false;
  }
};

export const verifyLocationSchema = Yup.mixed().test(
  'location',
  'Please enter location and its name.',
  validateLocation
);

const numberValues = [
  { isDefault: true, value: 'Present', label: 'Present' },
  { value: '1', id: 665 },
  { value: '2-5', id: 666 },
  { value: '6-20', id: 667 },
  { value: '21-100', id: 668 },
  { value: '101-500', id: 669 },
  { value: '500+', id: 670 },
];

const survey = {
  name: 'survey',
  label: 'Record',
  id: 423,

  getDraftIdKey: () => `draftId:${survey.name}`,

  attrs: {
    comment: {
      menuProps: { icon: chatboxOutline, skipValueTranslation: true },
      pageProps: {
        attrProps: {
          input: 'textarea',
          info: 'Please add any extra info about this record.',
        },
      },
    },

    device: {
      id: 273,
      values: {
        ios: 2398,
        android: 2399,
      },
    },

    appVersion: { id: 1139 },

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
      remote: { values: (date: Date) => dateHelp.print(date, false) },
    },
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

    create() {
      return new Occurrence({
        attrs: {
          comment: null,
          taxon: null,
          number: 'Present',
        },
      });
    },

    verify(attrs: any) {
      try {
        const occurrenceScheme = Yup.object().shape({
          taxon: Yup.object().nullable().required('Species is missing.'),
        });

        occurrenceScheme.validateSync(attrs, { abortEarly: false });
      } catch (attrError) {
        return attrError;
      }

      return null;
    },
  },

  verify(_: any, sample: any) {
    try {
      Yup.object()
        .shape({
          attrs: Yup.object().shape({
            location: verifyLocationSchema,
          }),
        })
        .validateSync(sample, { abortEarly: false });
    } catch (attrError) {
      return attrError;
    }
    return null;
  },

  create(Sample: any, training: string | null) {
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
      },
    });

    const occurrence = survey.occ.create();
    sample.occurrences.push(occurrence);

    sample.startGPS();

    return sample;
  },
};

export default survey;
