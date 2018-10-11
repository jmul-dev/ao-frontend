import React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotLoaderContainer } from 'react-hot-loader';
import { configureStore, history } from './store/configureStore';
import RootIco from './RootIco';


const store = configureStore();

render(
    <HotLoaderContainer>
        <RootIco store={store} />
    </HotLoaderContainer>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./RootIco', () => {
        const NextRoot = require('./RootIco'); // eslint-disable-line global-require
        render(
            <HotLoaderContainer>
                <NextRoot store={store} />
            </HotLoaderContainer>,
            document.getElementById('root')
        );
    });
}
