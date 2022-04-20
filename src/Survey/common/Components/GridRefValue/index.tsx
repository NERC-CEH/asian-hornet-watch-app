import React, { FC } from 'react';
import { IonSpinner } from '@ionic/react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import { prettyPrintLocation } from '@flumens';
import './styles.scss';

function getValue(sample: Sample) {
  if (sample.isGPSRunning()) {
    return <IonSpinner />;
  }

  return prettyPrintLocation(sample.attrs.location);
}

interface Props {
  sample: Sample;
}

const GridRefValue: FC<Props> = ({ sample }) => {
  const value = getValue(sample);

  return <div className="gridref-label">{value}</div>;
};

export default observer(GridRefValue);
