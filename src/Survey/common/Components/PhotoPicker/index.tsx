import React, { FC, ComponentProps } from 'react';
import { PhotoPicker, captureImage } from '@flumens';
import { observer } from 'mobx-react';
import { useIonActionSheet } from '@ionic/react';
import Media from 'models/image';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import config from 'common/config';
import './styles.scss';

export function usePromptImageSource() {
  const [presentActionSheet] = useIonActionSheet();

  const message = (
    resolve: (value: boolean | PromiseLike<boolean | null> | null) => void
  ): void => {
    presentActionSheet({
      buttons: [
        { text: 'Gallery', handler: () => resolve(false) },
        { text: 'Camera', handler: () => resolve(true) },
        { text: 'Cancel', role: 'cancel', handler: () => resolve(null) },
      ],
      header: 'Choose a method to upload a photo',
    });
  };
  const promptMessage = () => new Promise<boolean | null>(message);
  return promptMessage;
}

interface Props extends Omit<ComponentProps<typeof PhotoPicker>, 'getImage'> {
  model: Sample | Occurrence;
}

const AppPhotoPicker: FC<Props> = ({ model, ...restProps }) => {
  const promptImageSource = usePromptImageSource();

  async function getImageWrap() {
    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return null;

    const [image] = await captureImage({
      camera: shouldUseCamera,
    });

    if (!image) {
      return null;
    }

    const imageModel = await Media.getImageModel(image, config.dataPath);

    return imageModel;
  }

  return <PhotoPicker getImage={getImageWrap} model={model} {...restProps} />;
};

export default observer(AppPhotoPicker);
