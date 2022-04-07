import React, { FC } from 'react';
import { Page, Header } from '@flumens';
import Main from './Main';

const MenuController: FC = () => {
  return (
    <Page id="menu">
      <Header title="Menu" />
      <Main />
    </Page>
  );
};

export default MenuController;
