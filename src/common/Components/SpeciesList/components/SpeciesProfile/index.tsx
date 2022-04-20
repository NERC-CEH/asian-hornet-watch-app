import React, { FC, useState } from 'react';
import {
  IonCardHeader,
  IonSlides,
  IonSlide,
  IonList,
  IonItem,
  IonIcon,
  IonModal,
  IonHeader,
  IonButtons,
  IonButton,
  IonToolbar,
} from '@ionic/react';
import { Main, Gallery, InfoMessage } from '@flumens';
import { informationCircle, eyeOutline, arrowBack } from 'ionicons/icons';
import ImageWithBackground from '../ImageWithBackground';
import Comparison from '../Comparison';
import 'common/images/images';
import './styles.scss';

type Props = {
  species: any;
};

const SpeciesProfile: FC<Props> = ({ species }) => {
  // static contextType = IonLifeCycleContext;
  const [showGallery, setShowGallery] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [speciesProfile, setSpeciesProfile] = useState<any | null>(null);

  const hideGallery = () => {
    setShowGallery(false);
    setPhotoIndex(0);
  };

  const getSlides = () => {
    const slideOpts = {
      initialSlide: 0,
      speed: 400,
    };

    const getSlide = (_: any, index: number) => {
      const imageURL = `/images/${species.id}_${index}.jpg`;

      const onSpeciesImageClicked = () => {
        setShowGallery(true);
        setPhotoIndex(index);
      };

      return (
        <IonSlide
          key={imageURL}
          onClick={onSpeciesImageClicked}
          className="species-profile-photo"
        >
          <ImageWithBackground src={imageURL} />
        </IonSlide>
      );
    };

    if (!species?.images.length) return null;

    const slideImage = species.images[0].width.map(getSlide);

    return (
      <IonSlides pager options={slideOpts}>
        {slideImage}
      </IonSlides>
    );
  };

  const hideSpeciesModal = () => setSpeciesProfile(null);

  const getGallery = () => {
    const getImageSource = (_: any, index: number) => {
      const imageURL = `/images/${species.id}_${index}.jpg`;

      return {
        src: imageURL,
        width: species.images[0].width[index],
        height: species.images[0].height[index],
        footer: `© ${species.images[0].author[index]}`,
      };
    };

    const items = species?.images[0]?.width?.map(getImageSource) || [];

    return (
      <div>
        <Gallery
          isOpen={showGallery}
          items={items}
          initialSlide={photoIndex}
          onClose={hideGallery}
        />
      </div>
    );
  };

  const openModal = () => setSpeciesProfile(true);

  const isSpeciesAsianOrEuropean =
    species?.common_name === 'Asian hornet' ||
    species?.common_name === 'European hornet';

  return (
    <>
      {getGallery()}

      <Main id="species-profile">
        {getSlides()}

        <IonCardHeader>
          <div className="title">
            <h1>{species?.common_name}</h1>
            <h3>
              <i>{species?.scientific_name}</i>
            </h3>
          </div>
        </IonCardHeader>

        <IonList>
          <p>
            <h3>Distribution:</h3>
            <InfoMessage icon={informationCircle}>
              Asian hornet is often confused with similar species, find out more
              about each below.
            </InfoMessage>

            <img src={`/images/${species?.id}_map.svg`} />
          </p>

          <p>
            <h3>:</h3>
            <InfoMessage icon={informationCircle}>
              Asian hornet is often confused with similar species, find out more
              about each below.
            </InfoMessage>

            <img src={`/images/${species?.id}_timeline.jpg`} />
          </p>

          <p>
            <b>Size:</b> {species?.size}
          </p>

          <p>
            <b>Legs:</b> {species?.legs}
          </p>

          <p>
            <b>Abdomen:</b> {species?.abdomen}
          </p>

          <p>
            <b>Head:</b> {species?.head}
          </p>

          <p>
            <b>Antennae:</b> {species?.antennae}
          </p>

          <p>
            <b>Thorax:</b> {species?.thorax}
          </p>

          <p>
            <b>Other features:</b> {species?.notes}
          </p>

          {isSpeciesAsianOrEuropean && (
            <div className="rounded">
              <IonItem onClick={openModal} detail>
                <IonIcon icon={eyeOutline} size="small" slot="start" />
                Compare species
              </IonItem>
            </div>
          )}

          <IonModal isOpen={!!speciesProfile} backdropDismiss={false} mode="md">
            <IonHeader className="species-modal-header">
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={hideSpeciesModal}>
                    <IonIcon slot="icon-only" icon={arrowBack} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <Comparison />
          </IonModal>

          <p>{species?.description}</p>
        </IonList>
      </Main>
    </>
  );
};

export default SpeciesProfile;
