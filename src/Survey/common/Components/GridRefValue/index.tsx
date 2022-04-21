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
  requiredMessage?: string;
}

const GridRefValue: FC<Props> = ({ sample, requiredMessage = '' }) => {
  const value = getValue(sample);

  return <div className="gridref-label">{value || requiredMessage}</div>;
};

export default observer(GridRefValue);
