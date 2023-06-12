import { observable } from 'mobx';
import { Capacitor } from '@capacitor/core';
import {
  Filesystem,
  Directory as FilesystemDirectory,
} from '@capacitor/filesystem';
import { Media as MediaOriginal, MediaAttrs } from '@flumens';
import { isPlatform } from '@ionic/react';
import CONFIG from 'common/config';
import Occurrence from './occurrence';
import Sample from './sample';

export type URL = string;

type Attrs = MediaAttrs & { species: any };

export default class Media extends MediaOriginal {
  declare parent?: Sample | Occurrence;

  attrs: Attrs = observable({
    ...this.attrs,
  });

  async destroy(silent?: boolean) {
    // remove from internal storage
    if (!isPlatform('hybrid')) {
      if (!this.parent) return;

      this.parent.media.remove(this);

      if (silent) return;

      this.parent.save();
      return;
    }

    const URL = this.attrs.data;

    try {
      if (this.attrs.path) {
        // backwards compatible - don't delete old media
        await Filesystem.deleteFile({
          path: URL,
          directory: FilesystemDirectory.Data,
        });
      }

      if (!this.parent) return;

      this.parent.media.remove(this);

      if (silent) return;

      this.parent.save();
    } catch (err) {
      console.error(err);
    }
  }

  getURL() {
    const { data: name, path } = this.attrs;

    if (!isPlatform('hybrid') || process.env.NODE_ENV === 'test') {
      return name;
    }

    let pathToFile = CONFIG.dataPath;

    // backwards compatible
    if (!path) {
      pathToFile = CONFIG.dataPath.replace('/Documents/', '/Library/NoCloud/');
    }

    return Capacitor.convertFileSrc(`${pathToFile}/${name}`);
  }

  // eslint-disable-next-line class-methods-use-this
  validateRemote() {
    return null;
  }
}
