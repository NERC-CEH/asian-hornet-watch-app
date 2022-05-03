import React, { FC, SyntheticEvent } from 'react';
import { InfoMessage } from '@flumens';
import { IonCard, IonLabel, IonRow, IonIcon } from '@ionic/react';
import { Species } from 'common/data/species';
import {
  informationCircleOutline,
  informationCircle,
  warning,
} from 'ionicons/icons';
import 'common/images/images';
import './styles.scss';

type Props = {
  species: Species;
  viewSpecies?: (e: SyntheticEvent) => void;
  onClick?: any;
  onSelect?: (sp: Species) => void;
};

const SpeciesCard: FC<Props> = ({
  species,
  viewSpecies,
  onClick,
  onSelect,
}) => {
  const isSurvey = !!onSelect;

  const isSpeciesAsianHornet = species.common_name === 'Asian hornet';

  return (
    <IonRow id="card" key={species.id}>
      <IonCard onClick={onClick}>
        {isSurvey && (
          <div className="info-box" onClick={viewSpecies}>
            <IonIcon icon={informationCircleOutline} />
          </div>
        )}

        <div
          className="card"
          style={{ backgroundImage: `url(/images/${species.id}_0.jpg)` }}
        >
          <div className="card-wrapper">
            <div className="card-blur-container">
              <IonLabel className="bold">
                {species.common_name}

                {isSpeciesAsianHornet && (
                  <IonIcon icon={warning} color="danger" />
                )}
              </IonLabel>
            </div>
          </div>
        </div>
      </IonCard>

      {isSpeciesAsianHornet && (
        <InfoMessage icon={informationCircle}>
          Asian hornet is often confused with similar species, find out more
          about each below.
        </InfoMessage>
      )}
    </IonRow>
  );
};

export default SpeciesCard;
