import { useContext } from 'react';
import { Page, Main, Button } from '@flumens';
import { NavContext } from '@ionic/react';
import surveyConfig from 'Survey/config';
import appLogo from './images/app_logo.png';
import homePageBackground from './images/background.jpg';

const Home = () => {
  const { navigate } = useContext(NavContext);

  return (
    <Page id="home-info">
      <Main
        fullscreen={false}
        scrollY={false}
        className="[--background:white] [--padding-top:0]"
      >
        <div className="flex h-[100vh] flex-col justify-between overflow-hidden">
          <div className="">
            <div className="flex w-full flex-col justify-center bg-primary">
              <img
                className="mx-auto my-[5%] w-4/5 p-[5%]"
                src={appLogo}
                alt=""
              />
            </div>

            <h2 className="m-0 w-full bg-primary/70 p-7 text-[1.1em] font-light text-[white]">
              Learn about the Asian hornet and report suspected sightings.
              <br />
              <br />
              Find out about confirmed{' '}
              <a
                href="https://www.gov.uk/government/publications/asian-hornet-uk-sightings"
                className="!text-white underline"
              >
                sightings.
              </a>{' '}
            </h2>
          </div>

          <div className="h-full w-full overflow-hidden pb-[150px]">
            <img
              src={homePageBackground}
              alt=""
              className="h-full w-full self-center object-contain p-3"
            />

            <Button
              className="mx-auto rounded-full bg-secondary-500 px-10 text-xl"
              onPress={() => navigate(`/survey/${surveyConfig.name}`)}
              color="secondary"
            >
              Report a sighting
            </Button>
          </div>
        </div>
      </Main>
    </Page>
  );
};

export default Home;
