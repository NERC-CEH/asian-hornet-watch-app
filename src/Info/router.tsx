import React from 'react';
import { Route } from 'react-router-dom';
import About from './About';
import Menu from './Menu';
import Credits from './Credits';
import Privacy from './Privacy';
import BRC from './BRC';
import Help from './Help';

export default [
  <Route path="/info/menu" key="/info/menu" exact component={Menu} />,
  <Route path="/info/help" key="/info/help" exact component={Help} />,
  <Route path="/info/privacy" key="/info/privacy" exact component={Privacy} />,
  <Route path="/info/about" key="/info/about" exact component={About} />,
  <Route path="/info/brc" key="/info/brc" exact component={BRC} />,
  <Route path="/info/credits" key="/info/credits" exact component={Credits} />,
];
