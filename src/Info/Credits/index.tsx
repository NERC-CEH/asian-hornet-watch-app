import React from 'react';
import { Header, Page, Main, Section } from '@flumens';
import logo from 'common/images/flumens.svg';
import './styles.scss';

const { P, H } = Section;

export default () => (
  <Page id="credits">
    <Header title="Credits" />
    <Main>
      <Section>
        <P>
          We are very grateful for all the people that helped to create this
          app:
        </P>
        <P skipTranslation>
          <b>Karolis Kazlauskis</b> (Flumens)
        </P>
        <P skipTranslation>
          <b>Vilius Stankaitis</b> (Flumens)
        </P>
      </Section>

      <Section>
        <p className="logo">
          <a href="https://flumens.io">
            <img src={logo} alt="" />
          </a>
        </p>
        <P>
          This app was hand crafted with love by{' '}
          <a href="https://flumens.io" style={{ whiteSpace: 'nowrap' }}>
            Flumens.
          </a>{' '}
          A technical consultancy that excels at building bespoke environmental
          science and community focussed solutions. For suggestions and feedback
          please do not hesitate to{' '}
          <a href="mailto:enquiries%40flumens.io?subject=App%20Feedback">
            contact us
          </a>
          .
        </P>
      </Section>

      <Section>
        <H>Graphics</H>
        <P>
          Icons made by{' '}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>{' '}
          from{' '}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </P>
      </Section>
    </Main>
  </Page>
);
