import React from 'react';
import { Main, InfoMessage } from '@flumens';
import {
  IonItemDivider,
  IonRow,
  IonCol,
  IonList,
  IonTitle,
} from '@ionic/react';
import { informationCircle } from 'ionicons/icons';
import abdomen1 from './images/abdomen1.jpg';
import abdomen2 from './images/abdomen2.jpg';
import head1 from './images/head1.jpg';
import head2 from './images/head2.jpg';
import thorax1 from './images/thorax1.jpg';
import thorax2 from './images/thorax2.jpg';
import legs1 from './images/legs1.jpg';
import legs2 from './images/legs2.jpg';
import 'common/images/images';
import './styles.scss';

const Comparison = () => {
  return (
    <>
      <Main id="comparison">
        <IonTitle>Comparison</IonTitle>

        <InfoMessage icon={informationCircle}>
          Asian Hornet is most likely to be confused with European Hornet which
          is slightly larger. Other than size the two species differ in the
          following ways below.
        </InfoMessage>

        <IonList>
          <IonItemDivider>
            <p>Abdomen</p>
          </IonItemDivider>
          <div className="rounded">
            <IonRow>
              <IonCol>
                <h4> Asian Hornet</h4>

                <img src={abdomen1} />
                <p className="message">Mostly dark with orange segment 4</p>
              </IonCol>
              <IonCol>
                <h4>European Hornet</h4>
                <img src={abdomen2} />
                <p className="message">Extensive yellow/orange</p>
              </IonCol>
            </IonRow>
          </div>

          <IonItemDivider>Head</IonItemDivider>
          <div className="rounded">
            <IonRow>
              <IonCol>
                <h4> Asian Hornet</h4>
                <img src={head1} />
                <p className="message">Orange face, black top, dark antennae</p>
              </IonCol>
              <IonCol>
                <h4>European Hornet</h4>
                <img src={head2} />
                <p className="message">
                  Yellow face, yellow top, paler antennae
                </p>
              </IonCol>
            </IonRow>
          </div>

          <IonItemDivider>Thorax</IonItemDivider>
          <div className="rounded">
            <IonRow>
              <IonCol>
                <h4> Asian Hornet</h4>
                <img src={thorax1} />
                <p className="message">Entirely black</p>
              </IonCol>
              <IonCol>
                <h4>European Hornet</h4>
                <img src={thorax2} />
                <p className="message">Black with extensive brown markings</p>
              </IonCol>
            </IonRow>
          </div>

          <IonItemDivider>Legs</IonItemDivider>
          <div className="rounded">
            <IonRow>
              <IonCol>
                <h4> Asian Hornet</h4>
                <img src={legs1} />
                <p className="message">Dark with yellow ends</p>
              </IonCol>
              <IonCol>
                <h4>European Hornet</h4>
                <img src={legs2} />
                <p className="message">All brown with brown ends</p>
              </IonCol>
            </IonRow>
          </div>
        </IonList>
      </Main>
    </>
  );
};

export default Comparison;
