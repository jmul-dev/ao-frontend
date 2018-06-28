// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import app from './app.reducer'
import console from '../modules/console/reducers/console.reducer'
import wallet from '../modules/wallet/reducers/wallet.reducer'
import upload from '../modules/upload/reducers/upload.reducer'

const rootReducer = combineReducers({
    app,
    console,
    router,
    wallet,
    upload,
});

export default rootReducer;
