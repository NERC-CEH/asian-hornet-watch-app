import React, { FC, SyntheticEvent, useState } from 'react';
import { observer } from 'mobx-react';
import {
  IonGrid,
  IonModal,
  IonIcon,
  IonButton,
  IonButtons,
  IonToolbar,
  IonHeader,
} from '@ionic/react';
import { Main, InfoMessage } from '@flumens';
import { arrowBack, informationCircle } from 'ionicons/icons';
import speciesData from 'common/data/species.json';
import SpeciesProfile from './components/SpeciesProfile';
import SpeciesCard from './components/Card';
import './styles.scss';

type Props = {
  onSelect?: (sp: any) => void;
};
const SpeciesList: FC<Props> = ({ onSelect }) => {
  const [speciesProfile, setSpeciesProfile] = useState<any | null>(null);

  const hideSpeciesModal = () => setSpeciesProfile(null);

  const isSurvey = !!onSelect;

  const getSpecies = (sp: any) => {
    const viewSpecies = (e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setSpeciesProfile(sp);
    };

    const selectSpecies = () => onSelect && onSelect(sp);

    const onClick = isSurvey ? selectSpecies : viewSpecies;

    return (
      <SpeciesCard
        species={sp}
        onClick={onClick}
        viewSpecies={viewSpecies}
        onSelect={onSelect}
        key={sp.id}
      />
    );
  };

  const getSpeciesData = () => speciesData.map(getSpecies);

  return (
    <Main className="species-list">
      <InfoMessage icon={informationCircle}>
        Asian hornet is often confused with similar species, find out more about
        each below.
      </InfoMessage>

      <IonGrid>{getSpeciesData()}</IonGrid>

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

        <SpeciesProfile species={speciesProfile} />
      </IonModal>
    </Main>
  );
};

export default observer(SpeciesList);
