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
import {
  warning,
  locationOutline,
  calendarOutline,
  informationCircle,
} from 'ionicons/icons';
import { IonList, IonLabel, isPlatform } from '@ionic/react';
import waspIcon from 'common/images/wasp.svg';
import DateInput from 'Survey/common/Components/DateInput';
import PhotoPicker from 'Survey/common/Components/PhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import clsx from 'clsx';
import config from 'common/config';
import { Capacitor } from '@capacitor/core';

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

  function fixPreviousVersions(path: string) {
    if (path.includes('file://')) {
      return path.split('/').pop();
    }
    return path;
  }
  const img =
    // occ.media[0].attrs.data ||
    Capacitor.convertFileSrc(
      `${config.dataPath}/${fixPreviousVersions(occ.media[0].attrs.data)}`
    );

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
      <p style={{ maxHeight: '80px', overflow: 'hidden' }}>
        <code>pics count: "{occ.media.length}"</code>
      </p>{' '}
      <p style={{ maxHeight: '80px', overflow: 'hidden' }}>
        <code>data: "{occ.media[0].attrs.data}"</code>
      </p>{' '}
      <p style={{ maxHeight: '80px', overflow: 'hidden' }}>
        <code>path: "{occ.media[0].attrs.path}"</code>
      </p>
      <p style={{ maxHeight: '80px', overflow: 'hidden' }}>
        <code>is android: "{isPlatform('android') ? 'true' : 'false'}"</code>
      </p>{' '}
      <p style={{ maxHeight: '80px', overflow: 'hidden' }}>
        <code>dataPath: "{config.dataPath}"</code>
      </p>{' '}
      <p style={{ maxHeight: '80px', overflow: 'hidden' }}>
        <code>getURL: "{occ.media[0].getURL()}"</code>
      </p>{' '}
      <p style={{ maxHeight: '80px', overflow: 'hidden' }}>
        <code>thumbnail: "{occ.media[0].attrs.thumbnail}"</code>
      </p>{' '}
      <p style={{ maxHeight: '120px', overflow: 'hidden' }}>
        <code>
          convertFileSrc: "
          {Capacitor.convertFileSrc(
            `${config.dataPath}/${fixPreviousVersions(occ.media[0].attrs.data)}`
          )}
          "
        </code>
      </p>
      <IonList lines="full">
        <img src={occ.media[0].attrs.thumbnail} />
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
