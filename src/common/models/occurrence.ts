import { IObservableArray } from 'mobx';
import { Occurrence, OccurrenceAttrs, validateRemoteModel } from '@flumens';
import Media from './media';
import Sample from './sample';

type Attrs = OccurrenceAttrs & { taxon: any; number: string };

export default class AppOccurrence extends Occurrence<Attrs> {
  static fromJSON(json: any) {
    return super.fromJSON(json, Media);
  }

  declare media: IObservableArray<Media>;

  declare parent?: Sample;

  validateRemote = validateRemoteModel;

  // eslint-disable-next-line
  isDisabled = () => this.isUploaded();
}
