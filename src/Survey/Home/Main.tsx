import React, { FC } from 'react';
import Sample from 'models/sample';
import { useRouteMatch } from 'react-router';
import { observer } from 'mobx-react';
import {
  Attr,
  Main,
  MenuAttrItem,
  MenuAttrItemFromModel,
  InfoMessage,
} from '@flumens';
import { warningOutline, locationOutline } from 'ionicons/icons';
import { IonList, IonItemDivider, IonLabel } from '@ionic/react';
import waspIcon from 'common/images/wasp.svg';
import PhotoPicker from 'Survey/common/Components/PhotoPicker';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import './styles.scss';

type Props = {
  sample: Sample;
};

const HomeMain: FC<Props> = ({ sample }) => {
  const { url } = useRouteMatch();
  const survey = sample.getSurvey();
  const surveyDateProps = survey.attrs.date.pageProps.attrProps.inputProps;

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
        />
      </>
    );
  };

  const speciesValue = sample.occurrences[0].attrs.taxon.common_name;

  return (
    <Main>
      <InfoMessage icon={warningOutline}>
        Caution: take care when recording this species as its sting is similar
        to that of a wasp
      </InfoMessage>

      <IonItemDivider>Please fill in the details</IonItemDivider>
      <IonList lines="full">
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${url}/species`}
            icon={waspIcon}
            value={speciesValue}
            label="Species"
            required
          />

          {getLocationButton()}
          <Attr
            model={sample}
            attr="date"
            input="date"
            inputProps={surveyDateProps}
          />

          <MenuAttrItemFromModel attr="number" model={sample} />
          <MenuAttrItemFromModel attr="comment" model={sample} />
        </div>

        <IonItemDivider>Species Photo</IonItemDivider>
        <div className="rounded">
          <PhotoPicker model={occ} />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(HomeMain);
