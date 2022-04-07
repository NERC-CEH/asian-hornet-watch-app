import React from 'react';
import { Route } from 'react-router-dom';
import About from './About';
import Menu from './Menu';
import Credits from './Credits';

export default [
  <Route path="/info/menu" key="/info/menu" exact component={Menu} />,
  <Route path="/info/about" key="/info/about" exact component={About} />,
  <Route path="/info/credits" key="/info/credits" exact component={Credits} />,
];
