import React, { FC } from 'react';
import Sample from 'models/sample';
import { useRouteMatch } from 'react-router';
import { observer } from 'mobx-react';
import {
  Main,
  MenuAttrItem,
  MenuAttrItemFromModel,
  InfoMessage,
} from '@flumens';
import { warning, locationOutline, calendarOutline } from 'ionicons/icons';
import {
  IonList,
  IonLabel,
  IonItem,
  IonIcon,
  IonModal,
  IonDatetime,
} from '@ionic/react';
import waspIcon from 'common/images/wasp.svg';
import PhotoPicker from 'Survey/common/Components/PhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';

import './styles.scss';

type Props = {
  sample: Sample;
};

const HomeMain: FC<Props> = ({ sample }) => {
  const { url } = useRouteMatch();

  const isDisabled = sample.isUploaded();

  const [occ] = sample.occurrences;

  const getLocationButton = () => {
    const location = sample.attrs.location || {};

    const value = (
      <IonLabel position="stacked" mode="ios">
        <IonLabel>
          <GridRefValue sample={sample} />
        </IonLabel>
        <IonLabel>{location.name || 'No site name'}</IonLabel>
      </IonLabel>
    );

    return (
      <>
        <MenuAttrItem
          routerLink={`${url}/location`}
          value={value}
          icon={locationOutline}
          label="Location"
          skipValueTranslation
          required
          disabled={isDisabled}
        />
      </>
    );
  };

  const speciesValue = sample?.occurrences[0]?.attrs?.taxon?.common_name;

  const dateValue = sample.attrs.date?.split('T')[0];

  const maxDate: any = new Date().toISOString().split('T');

  const onChangeDate = (e: any) => {
    // eslint-disable-next-line
    sample.attrs.date = e.detail.value;
    sample.save();
  };

  return (
    <Main>
      <InfoMessage icon={warning} className="info-message warning">
        Caution: take care when recording this species as its sting is similar
        to that of a wasp
      </InfoMessage>

      <IonList lines="full">
        <div className="rounded">
          <PhotoPicker model={occ} isDisabled={isDisabled} />

          <MenuAttrItem
            routerLink={`${url}/species`}
            icon={waspIcon}
            value={speciesValue}
            label="Species"
            required
            disabled={isDisabled}
          />

          {getLocationButton()}

          <IonItem
            disabled={isDisabled}
            className="menu-attr-item"
            id="open-modal"
            detail={!isDisabled}
          >
            <IonIcon icon={calendarOutline} slot="start" />
            <IonLabel>Date</IonLabel>
            <IonLabel slot="end">{dateValue}</IonLabel>
          </IonItem>

          <IonModal id="date-time-modal" trigger="open-modal">
            <IonDatetime
              onIonChange={onChangeDate}
              showDefaultButtons
              presentation="date"
              value={dateValue}
              max={maxDate[0]}
            />
          </IonModal>

          <MenuAttrItemFromModel
            attr="number"
            model={occ}
            routerLink={`${url}/${occ.cid}/number`}
          />
          <MenuAttrItemFromModel attr="comment" model={sample} />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(HomeMain);
