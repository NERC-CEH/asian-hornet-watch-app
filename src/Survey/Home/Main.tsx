import React, { FC } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import {
  warning,
  locationOutline,
  calendarOutline,
  informationCircle,
} from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import {
  Main,
  MenuAttrItem,
  MenuAttrItemFromModel,
  InfoMessage,
} from '@flumens';
import { IonList, IonLabel } from '@ionic/react';
import waspIcon from 'common/images/wasp.svg';
import Sample from 'models/sample';
import DateInput from 'Survey/common/Components/DateInput';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import PhotoPicker from 'Survey/common/Components/PhotoPicker';
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
    const hasLocation = location.latitude;
    const empty = !hasLocation;

    const value = (
      <IonLabel position="stacked" mode="ios">
        <IonLabel color={clsx(empty && hasLocation && 'dark')}>
          <GridRefValue sample={sample} requiredMessage="No location" />
        </IonLabel>
        <IonLabel color="dark">{location.name || 'No site name'}</IonLabel>
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
          className={clsx({ empty })}
          disabled={isDisabled}
        />
      </>
    );
  };

  const speciesValue = sample?.occurrences[0]?.attrs?.taxon?.common_name;

  const onChangeDate = (value: string) => {
    // eslint-disable-next-line
    sample.attrs.date = value;
    sample.save();
  };

  // backwards compatible: dates were objects in previous version
  const dateValue = new Date(sample.attrs.date as any).toISOString();

  return (
    <Main>
      {isDisabled ? (
        <InfoMessage icon={informationCircle}>
          This record has been submitted and cannot be edited within this App.
        </InfoMessage>
      ) : (
        <InfoMessage icon={warning} className="info-message warning">
          Caution: take care when recording this species as its sting is similar
          to that of a wasp
        </InfoMessage>
      )}

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

          <DateInput
            value={dateValue}
            onChange={onChangeDate}
            presentation="date"
            label="Date"
            autoFocus={false}
            icon={calendarOutline}
            disabled={isDisabled}
            max={new Date().toISOString()}
          />

          <MenuAttrItemFromModel
            attr="number"
            model={occ}
            routerLink={`${url}/${occ?.cid}/number`}
          />
          <MenuAttrItemFromModel
            attr="comment"
            model={occ}
            routerLink={`${url}/${occ?.cid}/comment`}
          />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(HomeMain);
