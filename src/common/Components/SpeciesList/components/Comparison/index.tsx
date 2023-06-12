import React from 'react';
import { informationCircle } from 'ionicons/icons';
import { Main, InfoMessage, Section } from '@flumens';
import { IonRow, IonCol, IonTitle } from '@ionic/react';
import 'common/images/images';
import abdomen1 from './images/abdomen1.jpg';
import abdomen2 from './images/abdomen2.jpg';
import head1 from './images/head1.jpg';
import head2 from './images/head2.jpg';
import legs1 from './images/legs1.jpg';
import legs2 from './images/legs2.jpg';
import thorax1 from './images/thorax1.jpg';
import thorax2 from './images/thorax2.jpg';
import './styles.scss';

const { H } = Section;

const Comparison = () => {
  return (
    <Main id="comparison">
      <IonTitle>Comparison</IonTitle>

      <InfoMessage icon={informationCircle}>
        Asian Hornet is most likely to be confused with European Hornet which is
        slightly larger. Other than size the two species differ in the following
        ways below.
      </InfoMessage>

      <Section>
        <H>Abdomen</H>
        <IonRow>
          <IonCol style={{ display: 'flex', flexDirection: 'column' }}>
            <h5> Asian Hornet</h5>
            <div style={{ flex: 1 }}>
              <img src={abdomen1} />
            </div>{' '}
            <div style={{ flex: 1 }}>
              <p className="message">Mostly dark with orange segment 4</p>
            </div>
          </IonCol>
          <IonCol style={{ display: 'flex', flexDirection: 'column' }}>
            <h5>European Hornet</h5>
            <div style={{ flex: 1 }}>
              <img src={abdomen2} />
            </div>

            <div style={{ flex: 1 }}>
              <p className="message">Extensive yellow/orange</p>
            </div>
          </IonCol>
        </IonRow>
      </Section>

      <Section>
        <H>Head</H>

        <IonRow>
          <IonCol>
            <h5> Asian Hornet</h5>
            <img src={head1} />
            <p className="message">Orange face, black top, dark antennae</p>
          </IonCol>
          <IonCol>
            <h5>European Hornet</h5>
            <img src={head2} />
            <p className="message">Yellow face, yellow top, paler antennae</p>
          </IonCol>
        </IonRow>
      </Section>

      <Section>
        <H>Thorax</H>

        <IonRow>
          <IonCol>
            <h5> Asian Hornet</h5>
            <img src={thorax1} />
            <p className="message">Entirely black</p>
          </IonCol>
          <IonCol>
            <h5>European Hornet</h5>
            <img src={thorax2} />
            <p className="message">Black with extensive brown markings</p>
          </IonCol>
        </IonRow>
      </Section>

      <Section>
        <H>Legs</H>

        <IonRow>
          <IonCol>
            <h5> Asian Hornet</h5>
            <img src={legs1} />
            <p className="message">Dark with yellow ends</p>
          </IonCol>
          <IonCol>
            <h5>European Hornet</h5>
            <img src={legs2} />
            <p className="message">All brown with brown ends</p>
          </IonCol>
        </IonRow>
      </Section>
    </Main>
  );
};

export default Comparison;
