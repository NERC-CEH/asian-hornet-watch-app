import { IObservableArray } from 'mobx';
import {
  Occurrence as OccurrenceOriginal,
  OccurrenceOptions,
  OccurrenceAttrs,
  validateRemoteModel,
} from '@flumens';
import Media from './media';
import Sample from './sample';

type Attrs = OccurrenceAttrs & { taxon: any; number: string };

export default class Occurrence extends OccurrenceOriginal<Attrs> {
  declare media: IObservableArray<Media>;

  declare parent?: Sample;

  validateRemote = validateRemoteModel;

  constructor(options: OccurrenceOptions) {
    super({ ...options, Media });
  }
}
