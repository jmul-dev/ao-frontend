// @flow
import React, { Component, Node } from 'react';
import { Switch, Route } from 'react-router';
import ConsoleContainer from './modules/console/containers/ConsoleContainer';

type Props = {
  children: Node
};

export default class App extends Component<Props> {
  props: Props;
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" component={ConsoleContainer} />
        </Switch>
      </div>
    );
  }
}
