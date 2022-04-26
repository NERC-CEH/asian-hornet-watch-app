import React, { FC, useEffect, useState } from 'react';
import {
  IonCardHeader,
  IonSlides,
  IonSlide,
  IonItem,
  IonIcon,
  IonModal,
  IonHeader,
  IonButtons,
  IonButton,
  IonToolbar,
  IonCardContent,
} from '@ionic/react';
import { Trans as T } from 'react-i18next';
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
  const [showGallery, setShowGallery] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [speciesProfile, setSpeciesProfile] = useState<any | null>(null);

  const hideGallery = () => {
    setShowGallery(false);
    setPhotoIndex(0);
  };

  const disableBackButton = () => {
    const disableHardwareBackButton = (event: any) =>
      event.detail.register(101, () => null);

    document.addEventListener('ionBackButton', disableHardwareBackButton);

    const removeEventListener = () =>
      document.removeEventListener('ionBackButton', disableHardwareBackButton);
    return removeEventListener;
  };
  useEffect(disableBackButton);

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
        footer:
          species.images[0]?.author[index] &&
          `© ${species.images[0]?.author[index]}`,
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

  const isSpeciesAsianOrEuropeanHornet =
    species?.common_name === 'Asian hornet' ||
    species?.common_name === 'European hornet';

  const isSpeciesAsianHornet = species?.common_name === 'Asian hornet';

  if (!species) null;

  return (
    <>
      {getGallery()}

      <Main id="species-profile">
        {getSlides()}

        <IonCardHeader>
          <div className="title">
            <h1>{species.common_name}</h1>
            <h3>
              <i>{species.scientific_name}</i>
            </h3>
          </div>
        </IonCardHeader>

        <IonCardContent>
          {!isSpeciesAsianHornet && (
            <>
              <h3>Distribution:</h3>
              <p>
                <img src={`/images/${species?.id}_map.svg`} />
              </p>
            </>
          )}

          {isSpeciesAsianHornet && (
            <>
              <h3>Distribution:</h3>
              <InfoMessage icon={informationCircle}>
                Asian hornet is not currently established in the UK.
              </InfoMessage>
            </>
          )}

          <h3>Flight period:</h3>
          <img src={`/images/${species.id}_timeline.jpg`} />

          {species.size && (
            <>
              <h3>Size:</h3>
              <p>{species.size}</p>
            </>
          )}
          {species.legs && (
            <>
              <h3>Legs:</h3>
              <p>{species.legs}</p>
            </>
          )}

          {species.abdomen && (
            <>
              <h3>Abdomen:</h3>
              <p>{species.abdomen}</p>
            </>
          )}

          {species.head && (
            <>
              <h3>Head:</h3>
              <p>{species.head}</p>
            </>
          )}

          {species.antennae && (
            <>
              <h3>Antennae:</h3>
              <p>{species.antennae}</p>
            </>
          )}

          {species.thorax && (
            <>
              <h3>Thorax:</h3>
              <p>{species.thorax}</p>
            </>
          )}

          {species.notes && (
            <>
              <h3>Other features:</h3>
              <p>
                <T>{species.notes}</T>
              </p>
            </>
          )}

          {isSpeciesAsianOrEuropeanHornet && (
            <div className="container-wrapper">
              <IonItem onClick={openModal} lines="none" detail>
                <IonIcon icon={eyeOutline} size="small" slot="start" />
                Compare species
              </IonItem>
            </div>
          )}

          <h3>Description:</h3>
          <p>
            <T>{species.description} </T>
            {species.factsheet && <a href={species.factsheet}>fact sheet</a>}
          </p>
        </IonCardContent>

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
      </Main>
    </>
  );
};

export default SpeciesProfile;
