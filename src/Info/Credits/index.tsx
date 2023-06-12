import { FC } from 'react';
import { Header, Page, Main, Section } from '@flumens';
import { IonImg } from '@ionic/react';
import BRCLogo from 'common/images/BRC_approved_logo.png';
import CEHLogo from 'common/images/ceh_logo.png';
import './styles.scss';

const { P, H } = Section;

const Credits: FC = () => {
  return (
    <Page id="credits">
      <Header title="Credits" />
      <Main>
        <div className="logos">
          <div>
            <IonImg src={CEHLogo} />
          </div>
          <div>
            <IonImg src={BRCLogo} />
          </div>
        </div>
        <Section>
          <P>
            <b>
              We are very grateful for all the people that helped to create this
              app:
            </b>
            <ul>
              <li>Helen Roy (UKCEH)</li>
              <li>Karolis Kazlauskis (Flumens)</li>
              <li>Vilius Stankaitis (Flumens)</li>
              <li>Marc Botham (UKCEH)</li>
              <li>Niall Moore (APHA)</li>
              <li>Olaf Booy (APHA)</li>
              <li>Lucy Cornwell (APHA)</li>
            </ul>
          </P>
        </Section>

        <Section>
          <H>Photographs:</H>
          <P>
            <b>Front page</b> - Opening (flash): Didier Descouens; <br />
            Background: Laurent Eude; <br />
            <br />
            <b>Species pages</b>
            <br />
            <br />
            <b>Asian Hornet:</b> Jean Haxaire, John Feltwell, Laurent Eude, Luc
            Alary, Steph Cariou, Michel Reynaud, Siga, National Bee Unit, John
            De Carteret;
            <br />
            <b>European Hornet:</b> Steven Falk, Paul Davis, Steven Falk,
            Cristian Arghuis, Steven Falk, Martin D Parr, Nigel Jones, Chris
            Taklis, Colin Pumfrett, Frank Post;
            <br />
            <b>Giant Woodwasp:</b> Steve Covey, Paul Hill, Les Binns, Les Binns,
            Holger Groschl, Nigel Jones, Les Binns, Peter L Herring;
            <br />
            <b>Hornet Hoverfly:</b> Lee Collins, Marc Botham, Steven Falk,
            Joaquim Alves Gaspar, Paul Davis, Matt Smith, Frank Post, Pere Igor,
            Fujnky, Steven Falk;
            <br />
            <b>Hornet comparisons:</b> National Bee Unit, John Feltwell,
            Cristian Arghuis, Jean Marie Rohou, Steven Falk, John Feltwell,
            Frank Post;
            <br />
            <b>Dark Giant Horsefly</b>: Janet Graham, Ron Allen, Geoffrey Foale;
            <br />
            <b>Median wasp</b>: Tim Hodge, Jemima Osbahr, Teresa Fowler, Philip
            Booker, Sandra Bemister, Teresa Fowler, Barry Walter;
          </P>
        </Section>

        <Section>
          <H>Maps:</H>
          <P>Colin Harrower</P>
        </Section>

        <Section>
          <H>Recording Schemes:</H>
          <P>
            Matt Smith and Stuart Roberts (Bees Wasps and Ants Recording
            Scheme); Stuart Ball and Roger Morris (Hoverfly Recording Scheme)
          </P>
        </Section>
      </Main>
    </Page>
  );
};

export default Credits;
