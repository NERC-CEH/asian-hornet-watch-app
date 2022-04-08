import React, { FC } from 'react';
import { Page, Main, Header, Section } from '@flumens';

const { P, H } = Section;

const Privacy: FC = () => (
  <Page id="privacy">
    <Header title="Privacy Policy" />
    <Main>
      <Section>
        <H>Use of your name</H>
        <P>
          If you choose to create a user account for the app, this will be
          created on the{' '}
          <a href="http://irecord.org.uk" rel="external">
            Biological Record Centre's iRecord system
          </a>{' '}
          . This enables you to log in and see your records and those submitted
          by other people for all species. Your name, as specified when you
          create the account, will appear next to your records and will be
          viewable by other users of iRecord.
        </P>
      </Section>
      <Section>
        <H>E-mail address</H>
        <P>
          To create an account you will need to supply your e-mail address,
          which will be used in order to validate your account and to send you
          periodic updates and important information about the project. Your
          email address will not be shown and disseminated with your records but
          will be available to the verifying experts if they need to contact you
          about your sightings. You are able to delete your iRecord account or
          opt out of receiving emails at any time.
        </P>
      </Section>

      <Section>
        <H>Other information collected by the application</H>
        <P>
          All records submitted will be stored permanently on a secure server at
          the Biological Record Centre. Records will be made accessible to Local
          Environmental Record Centres, conservation organisations, scientific
          researchers, the NBN Gateway and the public.
        </P>
      </Section>

      <Section>
        <H>How long will my data be stored?</H>
        <P>
          Your submitted records will be stored permanently and used to inform
          the conservation and study of the recorded species in the future.
        </P>
      </Section>

      <Section>
        <H>Who will have access to my personal data?</H>
        <P>
          Only those directly involved in developing this app and running this
          recording scheme or verifying records as experts or involved in the
          management of Asian Hornets, will have access to your email address.
          Unless required by law, data will not be made available to any third
          parties unless we have obtained your permission to do so.
        </P>
      </Section>

      <Section>
        <H>Use of media submitted with the app</H>
        <P>
          By submitting a photograph with this app you:
          <ul>
            <li>
              Give the project and its partners permission to publish the file/s
              on their respective websites and to use the file/s in any
              publicity materials they produce.
            </li>
            <li>
              Grant the project and its partners a non-exclusive, worldwide
              licence to republish the file/s in any format including, without
              limitation, in print and electronic formats.
            </li>
            <li>
              Warrant that the file is entirely your own work and has not been
              copied in whole, or in part, from any 3rd party and does not
              infringe any 3rd party intellectual property rights.
            </li>
            <li>
              Waive all moral rights in, and arising from your photograph(s),
              but retain ownership of the copyright in your file(s) as its
              author.
            </li>
          </ul>
        </P>
      </Section>

      <Section>
        <P>
          Wherever possible you will receive credit for the reproduction of your
          work on, or next to, your photograph or file, although we reserve the
          right to exclude a direct attribution where this affects the aesthetic
          of the reproduction.
        </P>
      </Section>
    </Main>
  </Page>
);

export default Privacy;
