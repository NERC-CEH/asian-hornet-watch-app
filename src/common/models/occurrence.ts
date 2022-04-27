import Occurrence, {
  Attrs as OccurrenceAttrs,
} from '@bit/flumens.apps.models.occurrence';
import { validateRemoteModel } from '@flumens';
import Media from './image';

type Attrs = OccurrenceAttrs & { taxon: any; number: number | string };

export default class AppOccurrence extends Occurrence {
  static fromJSON(json: any) {
    return super.fromJSON(json, Media);
  }

  attrs: Attrs = this.attrs;

  media: Media[] = this.media;

  validateRemote = validateRemoteModel;

  // eslint-disable-next-line
  isDisabled = () => this.isUploaded();
}
