import React, { FC, useEffect, useState } from 'react';
import {
  informationCircle,
  eyeOutline,
  arrowBack,
  expandOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Main, Gallery, InfoMessage } from '@flumens';
import {
  IonCardHeader,
  IonItem,
  IonIcon,
  IonModal,
  IonHeader,
  IonButtons,
  IonButton,
  IonToolbar,
  IonCardContent,
} from '@ionic/react';
import '@ionic/react/css/ionic-swiper.css';
import 'common/images/images';
import Comparison from '../Comparison';
import ImageWithBackground from '../ImageWithBackground';
import './styles.scss';

type Props = {
  species: any;
};

const SpeciesProfile: FC<Props> = ({ species }) => {
  const [showGallery, setShowGallery] = useState<any>(false);

  const [speciesProfile, setSpeciesProfile] = useState<any | null>(null);

  const hideGallery = () => setShowGallery(false);

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

      const onSpeciesImageClicked = () => setShowGallery(index);

      return (
        <SwiperSlide
          key={imageURL}
          onClick={onSpeciesImageClicked}
          className="species-profile-photo"
        >
          <ImageWithBackground src={imageURL} />
        </SwiperSlide>
      );
    };

    if (!species?.images.length) return null;

    const slideImage = species.images[0].width.map(getSlide);

    return (
      <Swiper
        modules={[Pagination]}
        pagination={{
          type: 'fraction',
        }}
        {...slideOpts}
      >
        {slideImage}
      </Swiper>
    );
  };

  const hideSpeciesModal = () => setSpeciesProfile(null);

  const getGallery = () => {
    let items = [];
    let className = 'white-background';
    let pageTitle = '';
    let initialSlide = 0;

    if (Number.isInteger(showGallery)) {
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

      items = species?.images[0]?.width?.map(getImageSource) || [];
      className = '';
      initialSlide = showGallery;
    }

    if (showGallery === 'map') {
      items.push({ src: `/images/${species.id}_map.svg` });
      pageTitle = 'Distribution';
    }

    return (
      <div>
        <Gallery
          isOpen={showGallery || showGallery === 0}
          items={items}
          className={className}
          title={pageTitle}
          mode="md"
          initialSlide={initialSlide}
          onClose={hideGallery}
        />
      </div>
    );
  };

  const getMapGallery = () => setShowGallery('map');

  const openModal = () => setSpeciesProfile(true);

  const getMap = () => {
    return (
      <div className="fullscreen-tappable map" onClick={getMapGallery}>
        <img src={`/images/${species?.id}_map.svg`} />
        <div className="fullscreen-btn">
          <IonIcon src={expandOutline} slot="end" color="secondary" />
        </div>
      </div>
    );
  };

  if (!species) return null;

  const isSpeciesAsianOrEuropeanHornet =
    species.common_name === 'Asian hornet' ||
    species.common_name === 'European hornet';

  const isSpeciesAsianHornet = species.common_name === 'Asian hornet';

  if (!species) return null;

  return (
    <>
      {getGallery()}

      <Main id="species-profile">
        {getSlides()}

        <IonCardHeader>
          <div className="title">
            <h1>{species.common_name}</h1>
            <h4>
              <i>{species.scientific_name}</i>
            </h4>
          </div>
        </IonCardHeader>

        <IonCardContent>
          <>
            <h3>Flight period:</h3>
            {species.hasFlightPeriodImage && (
              <img src={`/images/${species.id}_timeline.jpg`} />
            )}
            {!species.hasFlightPeriodImage && <p>{species.flight}</p>}
          </>

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

          {!isSpeciesAsianHornet && (
            <>
              <h3>Distribution:</h3>
              {species.hasMap && getMap()}
              {species.distribution}
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
