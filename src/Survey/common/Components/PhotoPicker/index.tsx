import { FC, ComponentProps } from 'react';
import { observer } from 'mobx-react';
import { Capacitor } from '@capacitor/core';
import { PhotoPicker, captureImage, useToast } from '@flumens';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import Media from 'models/media';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import './styles.scss';

type URL = string;

interface Props extends Omit<ComponentProps<typeof PhotoPicker>, 'getImage'> {
  model: Sample | Occurrence;
}

const AppPhotoPicker: FC<Props> = ({ model, isDisabled, ...restProps }) => {
  const toast = useToast();

  if (isDisabled && !model.media.length) return null;

  async function onAddNew(shouldUseCamera: boolean) {
    try {
      const photoURLs = await captureImage({
        camera: shouldUseCamera,
        multiple: true,
      });
      if (!photoURLs.length) return;

      const getImageModel = async (imageURL: URL) =>
        Media.getImageModel(
          isPlatform('hybrid') ? Capacitor.convertFileSrc(imageURL) : imageURL,
          config.dataPath
        );
      const imageModels: Media[] = await Promise.all<any>(
        photoURLs.map(getImageModel)
      );

      model.media.push(...imageModels);
      model.save();
    } catch (e: any) {
      toast.error(e);
    }
  }

  return (
    <PhotoPicker
      onAddNew={onAddNew}
      model={model}
      isDisabled={isDisabled}
      {...restProps}
    />
  );
};

export default observer(AppPhotoPicker);
