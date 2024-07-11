import { AttrPage, RouteWithModels } from '@flumens';
import appModel from 'models/app';
import savedSamples from 'models/savedSamples';
import userModel from 'models/user';
import ModelLocation from 'Survey/common/Components/ModelLocationMap';
import Species from 'Survey/common/Components/Species';
import Home from './Home';
import StartNewSurvey from './StartNewSurvey';
import survey from './config';

const baseURL = `/survey/${survey.name}`;

const HomeWrap = (props: any) => (
  <Home appModel={appModel} userModel={userModel} {...props} />
);

const { AttrPageFromRoute } = AttrPage;

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, HomeWrap],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/:occId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/location`, ModelLocation],
  [`${baseURL}/:smpId/species`, Species],
];

export default RouteWithModels.fromArray(savedSamples, routes);
