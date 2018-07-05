// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import app from './app.reducer'
import wallet from '../modules/wallet/reducers/wallet.reducer'
import video from '../modules/video/reducers/video.reducer'

const rootReducer = combineReducers({
    app,
    router,
    wallet,
    video,
});

export default rootReducer;
