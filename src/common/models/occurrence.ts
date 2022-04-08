import Occurrence, {
  Attrs as OccurrenceAttrs,
} from '@bit/flumens.apps.models.occurrence';
import { validateRemoteModel } from '@bit/flumens.apps.utils.validation';
import Media from './image';

type Attrs = OccurrenceAttrs;

export default class AppOccurrence extends Occurrence {
  static fromJSON(json: any) {
    return super.fromJSON(json, Media);
  }

  attrs: Attrs = this.attrs;

  media: Media[] = this.media;

  validateRemote = validateRemoteModel;

  isDisabled = () => this.isUploaded();
}
