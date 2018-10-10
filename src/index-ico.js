import React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotLoaderContainer } from 'react-hot-loader';
import { configureStore, history } from './store/configureStore';
import { IcoRoot } from './Root';


const store = configureStore();

render(
    <HotLoaderContainer>
        <IcoRoot store={store} />
    </HotLoaderContainer>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./IcoRoot', () => {
        const NextRoot = require('./IcoRoot'); // eslint-disable-line global-require
        render(
            <HotLoaderContainer>
                <NextRoot store={store} />
            </HotLoaderContainer>,
            document.getElementById('root')
        );
    });
}
