import { FC, ComponentProps } from 'react';
import { observer } from 'mobx-react';
import { PhotoPicker, captureImage } from '@flumens';
import { useIonActionSheet } from '@ionic/react';
import config from 'common/config';
import Media from 'models/media';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
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

const AppPhotoPicker: FC<Props> = ({ model, isDisabled, ...restProps }) => {
  const promptImageSource = usePromptImageSource();

  if (isDisabled && !model.media.length) return null;

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

  return (
    <PhotoPicker
      getImage={getImageWrap}
      model={model}
      isDisabled={isDisabled}
      {...restProps}
    />
  );
};

export default observer(AppPhotoPicker);
