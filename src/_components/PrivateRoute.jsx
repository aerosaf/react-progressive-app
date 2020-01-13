import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export function checkPermission(type) {
  const user = JSON.parse(localStorage.getItem('user'));
  return type.includes(user.type);
}

export const PrivateRoute = ({ component: Component, type, ...rest }) => (
  <div>
    <Route { ...rest } render={props => (
      localStorage.getItem('user') ? (
        !type || (type && checkPermission(type)) ? (<Component { ...props } />) : (<Redirect to={{ pathname: '/', state: { from: props.location } }} />)
      ) : (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
    )}
    />
  </div>
);