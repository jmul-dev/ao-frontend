// @flow
import { combineReducers } from '../../../../Library/Caches/typescript/2.9/node_modules/redux';
import app from './app.reducer'
import wallet from '../modules/wallet/reducers/wallet.reducer'
import upload from '../modules/upload/reducers/upload.reducer'
import video from '../modules/video/reducers/video.reducer'
import electron from '../modules/electron/reducers/electron.reducer'

const rootReducer = combineReducers({
    app,
    wallet,
    upload,
    video,
    electron,
});

export default rootReducer;
