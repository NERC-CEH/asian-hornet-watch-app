import { FC, SyntheticEvent, useState } from 'react';
import { observer } from 'mobx-react';
import { arrowBack } from 'ionicons/icons';
import { Main } from '@flumens';
import {
  IonGrid,
  IonModal,
  IonIcon,
  IonButton,
  IonButtons,
  IonToolbar,
  IonHeader,
} from '@ionic/react';
import { Species } from 'common/data/species';
import speciesData from 'common/data/species.json';
import SpeciesCard from './components/Card';
import SpeciesProfile from './components/SpeciesProfile';
import './styles.scss';

type Props = {
  onSelect?: (sp: Species) => void;
};
const SpeciesList: FC<Props> = ({ onSelect }) => {
  const [speciesProfile, setSpeciesProfile] = useState<any | null>(null);

  const hideSpeciesModal = () => setSpeciesProfile(null);

  const isSurvey = !!onSelect;

  const getSpecies = (sp: Species) => {
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
