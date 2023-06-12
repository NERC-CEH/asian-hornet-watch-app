import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { Page, Header } from '@flumens';
import { NavContext } from '@ionic/react';
import Main from 'common/Components/SpeciesList';
import 'common/images/images';
import Sample from 'models/sample';

type Props = {
  sample: Sample;
};
const SpeciesSelect: FC<Props> = ({ sample }) => {
  const { goBack } = useContext(NavContext);

  function onSelect(sp: any) {
    sample.occurrences[0].attrs.taxon = sp; // eslint-disable-line
    sample.save();

    goBack();
  }

  return (
    <Page id="species-attr">
      <Header title="Species" />
      <Main onSelect={onSelect} />
    </Page>
  );
};

export default observer(SpeciesSelect);
