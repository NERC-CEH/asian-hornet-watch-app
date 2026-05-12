import { observer } from 'mobx-react';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { PhotoPicker, captureImage, useToast } from '@flumens';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import Media from 'models/media';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import './styles.scss';

type Props = {
  model: Sample | Occurrence;
};

const AppPhotoPicker = ({ model }: Props) => {
  const toast = useToast();
  async function onAdd(shouldUseCamera: boolean) {
    const res = await Camera.checkPermissions();
    if (shouldUseCamera && res.camera !== 'granted') {
      toast.warn(
        'You have previously denied camera permissions. Please allow them in your device settings to use the camera.',
        { duration: 5000, position: 'bottom' }
      );
      return;
    }
    if (!shouldUseCamera && res.photos !== 'granted') {
      toast.warn(
        'You have previously denied photo library permissions. Please allow them in your device settings to select photos from your library.',
        { duration: 5000, position: 'bottom' }
      );
      return;
    }

    const images = await captureImage(
      shouldUseCamera ? { camera: true } : { multiple: true }
    );
    if (!images.length) return;

    const getImageModel = async (image: any) => {
      const imageModel: any = await Media.getImageModel(
        isPlatform('hybrid') ? Capacitor.convertFileSrc(image) : image,
        config.dataPath,
        true
      );

      return imageModel;
    };

    const imageModels: Media[] = await Promise.all<any>(
      images.map(getImageModel)
    );

    model.media.push(...imageModels);
    model.save();
  }

  const onRemove = (m: any) => m.destroy();

  return (
    <PhotoPicker
      onAdd={onAdd}
      onRemove={onRemove}
      value={model.media}
      isDisabled={model.isUploaded}
    />
  );
};

export default observer(AppPhotoPicker);
