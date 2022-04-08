import React, { FC } from 'react';
import { Page, Main, Header, Section } from '@flumens';
import CONFIG from 'common/config';
import './styles.scss';

const { P, H } = Section;

const About: FC = () => (
  <Page id="about">
    <Header title="About" />
    <Main>
      <Section>
        <P>
          Asian Hornet Watch is an app designed to record and help the early
          detection of Asian Hornet in the UK following the first confirmed
          record in September 2016. Asian Hornet is a non-native species within
          the UK and could have a serious impact on our insects including
          honeybees so early detection is important. There are a number of
          native insects in the UK that look very similar to the Asian Hornet,
          and are common and widespread. Asian Hornet Watch provides an
          identification guide to help check which species you have seen and an
          opportunity to record your sightings. Insect identification can be
          difficult and so please do include a photograph with your record to
          help us confirm the identity of the species you have seen.
        </P>

        <H>Who can use the app?</H>
        <P>
          We encourage everyone to get involved with recording species as it is
          very easy and quick to submit useful records without specialist
          knowledge. It doesn't matter whether you are an amateur enthusiast or
          a qualified biologist, this app is for anyone who wants to contribute
          to our database observations of the natural environment.
        </P>

        <H>App Development</H>
        <P>
          This app was hand crafted with love by the BRC mobile development
          team. For suggestions and feedback please do not hesitate to{' '}
          <a
            href={`mailto:apps%40ceh.ac.uk?subject=Asian%20Hornet%20Watch%20Support%26Feedback&body=%0A%0A%0AVersion%3A%20 ${CONFIG.version}`}
          >
            contact us
          </a>
          .
        </P>
      </Section>
    </Main>
  </Page>
);

export default About;
