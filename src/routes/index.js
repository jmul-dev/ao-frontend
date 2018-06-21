import React from 'react';
import { Switch, Route } from 'react-router';
import App from '../App';
import ConsoleContainer from '../modules/console/containers/ConsoleContainer';

export default () => (
  <App>
    <Switch>
      <Route path="/" component={ConsoleContainer} />
    </Switch>
  </App>
);
