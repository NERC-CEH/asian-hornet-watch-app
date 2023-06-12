import React from 'react';
import { Route } from 'react-router-dom';
import About from './About';
import Credits from './Credits';
import Help from './Help';
import Menu from './Menu';

export default [
  <Route path="/info/menu" key="/info/menu" exact component={Menu} />,
  <Route path="/info/help" key="/info/help" exact component={Help} />,
  <Route path="/info/about" key="/info/about" exact component={About} />,
  <Route path="/info/credits" key="/info/credits" exact component={Credits} />,
];
