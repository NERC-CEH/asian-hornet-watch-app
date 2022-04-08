import React from 'react';
import { Route } from 'react-router-dom';
import userModel from 'models/user';
import Login from './Login';
import Register from './Register';
import Reset from './Reset';

const LoginWrap = () => <Login userModel={userModel} />;
const RegistrationWrap = () => <Register userModel={userModel} />;
const ResetWrap = () => <Reset userModel={userModel} />;

export default [
  <Route path="/user/login" key="/user/login" exact render={LoginWrap} />,
  <Route
    path="/user/register"
    key="/user/register"
    exact
    render={RegistrationWrap}
  />,
  <Route path="/user/reset" key="/user/reset" exact render={ResetWrap} />,
];
