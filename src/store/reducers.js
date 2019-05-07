// @flow
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import app from "./app.reducer";
import contracts from "./contracts.reducer";
import wallet from "../modules/wallet/reducers/wallet.reducer";
import upload from "../modules/upload/reducers/upload.reducer";
import video from "../modules/video/reducers/video.reducer";
import electron from "../modules/electron/reducers/electron.reducer";
import exchange from "../modules/exchange/reducers/exchange.reducer";
import notifications from "../modules/notifications/reducers/notifications.reducer";
import ico from "../modules/ico/reducers/ico.reducer";
import account from "../modules/account/reducers/account.reducer";
import writer from "../modules/writer/reducers/writer.reducer";

const rootReducer = combineReducers({
    router: routerReducer,
    app,
    wallet,
    upload,
    video,
    electron,
    exchange,
    contracts,
    notifications,
    ico,
    account,
    writer
});

export default rootReducer;
