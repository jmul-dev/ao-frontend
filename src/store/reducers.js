// @flow
import { combineReducers } from 'redux';
import app from './app.reducer'
import wallet from '../modules/wallet/reducers/wallet.reducer'
import upload from '../modules/upload/reducers/upload.reducer'
import video from '../modules/video/reducers/video.reducer'

const rootReducer = combineReducers({
    app,
    wallet,
    upload,
    video,
});

export default rootReducer;
