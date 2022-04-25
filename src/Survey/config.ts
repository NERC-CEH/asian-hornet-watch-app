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
  'Please select location.',
  validateLocation
);

const numberValues = [
  { value: 'Present', id: 671 },
  { value: '1', id: 665 },
  { value: '2-5', id: 666 },
  { value: '21-100', id: 667 },
  { value: '101-500', id: 669 },
  { value: '500+', id: 670 },
];

const survey = {
  name: 'survey',
  label: 'Record',
  id: 445,

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

    locationAccuracy: { remote: { id: 282 } },
    locationSource: { remote: { id: 760 } },
    locationGridref: { remote: { id: 335 } },
    location: {
      label: 'Location',
      icon: locationOutline,
      remote: {
        id: 'entered_sref',
        values(location: any, submission: any) {
          // convert accuracy for map and gridref sources
          const { accuracy, source, gridref, name } = location;

          const keys = survey.attrs;
          const locationAttributes = {
            location_name: name,
            [keys.locationSource.remote.id]: source,
            [keys.locationGridref.remote.id]: gridref,
            [keys.locationAccuracy.remote.id]: accuracy,
          };

          // add other location related attributes
          // eslint-disable-next-line
          submission.fields = { ...submission.fields, ...locationAttributes };

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

  occ: {
    attrs: {
      taxon: {
        remote: {
          id: 'taxa_taxon_list_id',
          values: ({ warehouseId }: any) => warehouseId,
        },
      },
    },

    create() {
      return new Occurrence({
        attrs: {
          comment: null,
          taxon: null,
        },
      });
    },

    verify(attrs: any) {
      console.log('!', attrs);

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

  create(Sample: any, training: boolean) {
    const sample = new Sample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
        training,
      },

      attrs: {
        location_type: 'latlon',
        size: null,
        number: 'Present',
        location: null,
        activities: [],
      },
    });

    const occurrence = survey.occ.create();
    sample.occurrences.push(occurrence);

    sample.startGPS();

    return sample;
  },
};

export default survey;
