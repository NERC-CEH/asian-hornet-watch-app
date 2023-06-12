import React from 'react';
import { AttrPage, RouteWithModels, ModelLocation } from '@flumens';
import CONFIG from 'common/config';
import appModel from 'models/app';
import savedSamples from 'models/savedSamples';
import userModel from 'models/user';
import Species from 'Survey/common/Components/Species';
import Home from './Home';
import StartNewSurvey from './StartNewSurvey';
import survey from './config';

const baseURL = `/survey/${survey.name}`;

const HomeWrap = (props: any) => (
  <Home appModel={appModel} userModel={userModel} {...props} />
);

const ModelLocationWrap = (props: any) => (
  <ModelLocation
    model={props.sample} // eslint-disable-line
    mapProviderOptions={CONFIG.map}
    useGridRef
    useGridMap
    onLocationNameChange={ModelLocation.utils.onLocationNameChange}
    namePlaceholder="Site name eg nearby village"
    onGPSClick={ModelLocation.utils.onGPSClick}
    backButtonProps={{ text: 'Back' }}
  />
);

const { AttrPageFromRoute } = AttrPage;

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, HomeWrap],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/:occId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/location`, ModelLocationWrap],
  [`${baseURL}/:smpId/species`, Species],
];

export default RouteWithModels.fromArray(savedSamples, routes);
