import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '../src/store/configureStore.dev';

const store = configureStore({});

export default function Provider({ story }) {
    return (
        <ReduxProvider store={store}>
            <div>
                {story}
            </div>
        </ReduxProvider>
    );
};