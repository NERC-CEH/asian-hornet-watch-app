import React from 'react';
import { Page, Main, Header, Section } from '@flumens';
import './styles.scss';

const { P } = Section;

const Component: React.FC = () => (
  <Page id="about">
    <Header title="About" />
    <Main className="ion-padding">
      <Section>
        <P>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </P>
      </Section>
    </Main>
  </Page>
);

export default Component;
