import { SampleCollection } from '@flumens';
import config from 'common/config';
import Occurrence from 'common/models/occurrence';
import Sample from '../sample';
import { samplesStore } from '../store';
import userModel from '../user';

console.log('SavedSamples: initializing');

const samples = new SampleCollection<Sample>({
  store: samplesStore,
  Model: Sample,
  Occurrence,
  url: config.backend.indicia.url,
  getAccessToken: () => userModel.getAccessToken(),
}) as any;

export async function uploadAllSamples(toast: any) {
  console.log('SavedSamples: uploading all.');
  const getUploadPromise = (s: Sample) => !s.isUploaded && s.upload();

  const processError = (err: any) => {
    if (err.isHandled) return;
    toast.error(err);
  };
  await Promise.all(samples.map(getUploadPromise)).catch(processError);

  console.log('SavedSamples: all records were uploaded!');
}

export default samples;
