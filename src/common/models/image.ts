import Media, { Attrs as MediaAttrs } from '@bit/flumens.apps.models.media';
import { createImage } from '@bit/flumens.apps.helpers.image';
import { observable } from 'mobx';
import { isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import config from 'common/config';
import {
  Filesystem,
  Directory as FilesystemDirectory,
} from '@capacitor/filesystem';

export type URL = string;

type Attrs = MediaAttrs;

export default class AppMedia extends Media {
  /**
   * Create new image model with a photo
   * @param ImageModel Class representing the model.
   * @param imageURL
   * @param dataDirPath
   * @returns
   */
  static async getImageModel(
    imageURL: URL,
    dataDirPath: string
  ): Promise<AppMedia> {
    if (!imageURL) {
      throw new Error('File not found while creating image model.');
    }

    let width;
    let height;
    let data;

    if (isPlatform('hybrid')) {
      imageURL = Capacitor.convertFileSrc(imageURL); // eslint-disable-line
      const image = await createImage(imageURL);

      width = image.width;
      height = image.height;

      data = imageURL.split('/').pop();
    } else {
      [data, , width, height] = await AppMedia.getDataURI(imageURL, {
        width: 1000,
        height: 1000,
      });
    }

    const imageModel: AppMedia = new AppMedia({
      attrs: {
        data,
        type: 'jpeg',
        width,
        height,
        path: dataDirPath,
      },
    });

    await imageModel.addThumbnail();

    return imageModel;
  }

  attrs: Attrs = observable({
    ...this.attrs,
  });

  async destroy() {
    console.log('MediaModel: destroying.');

    // remove from internal storage
    if (!isPlatform('hybrid') || (window as any).testing) {
      if (!this.parent) {
        return null;
      }

      this.parent.media.remove(this);

      return this.parent.save();
    }

    try {
      if (this.attrs.path) {
        // backwards compatible - don't delete old media
        await Filesystem.deleteFile({
          path: this.attrs.data,
          directory: FilesystemDirectory.Data,
        });
      }

      if (!this.parent) return null;

      this.parent.media.remove(this);

      return this.parent.save();
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  getURL() {
    const { data: name } = this.attrs;

    if (!isPlatform('hybrid') || process.env.NODE_ENV === 'test') {
      return name;
    }

    return Capacitor.convertFileSrc(`${config.dataPath}/${name}`);
  }

  // eslint-disable-next-line class-methods-use-this
  validateRemote = () => null;

  async save() {
    if (!this.parent) {
      return Promise.reject(
        new Error('Trying to save locally without a parent')
      );
    }

    return this.parent.save();
  }
}
