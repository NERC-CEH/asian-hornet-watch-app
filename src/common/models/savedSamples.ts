import { initStoredSamples } from '@flumens';
import Sample from './sample';
import { modelStore } from './store';

console.log('SavedSamples: initializing');

type Collection = Sample[] & {
  ready: Promise<any>;
  resetDefaults: any;
};

const savedSamples: Collection = initStoredSamples(modelStore, Sample);

export async function uploadAllSamples(toast: any) {
  console.log('SavedSamples: uploading all.');
  const getUploadPromise = (s: Sample) => !s.isUploaded() && s.upload();

  const processError = (err: any) => {
    if (err.isHandled) return;
    toast.error(err);
  };
  await Promise.all(savedSamples.map(getUploadPromise)).catch(processError);

  console.log('SavedSamples: all records were uploaded!');
}

export default savedSamples;
