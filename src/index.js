import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './Root';
import { configureStore, history } from './store/configureStore';
import ApolloClient from "apollo-boost";

const store = configureStore();

const client = new ApolloClient({
  uri: 'http://localhost:3003/graphql'  // TODO: pull this from env or config
})

render(
  <AppContainer>
    <Root store={store} history={history} client={client} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextRoot = require('./Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} client={client} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
