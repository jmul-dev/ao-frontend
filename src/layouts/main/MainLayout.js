// @flow
import React from "react";
import { Switch, Route, Redirect } from "react-router";
import { Link } from "react-router-dom";
import SettingsView from "../../views/settings/SettingsView";
import AccountView from "../../views/account/AccountView";
import BrowseView from "../../views/browse/BrowseView";
import UploadView from "../../views/upload/UploadView";
import IcoView from "../../views/ico/IcoView";
import WalletView from "../../views/wallet/WalletView";
import DevelopersView from "../../views/developers/DevelopersView";
import IngressView from "../../views/ingress/IngressView";
import DaoView from "../../views/dao/DaoView";
import ContentView from "../../views/content";
import VideoPlayback from "../../modules/video/components/VideoPlayback";
import MainNavigation from "./MainNavigation";
import { AnimatedRoute } from "react-router-transition";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { lightTheme } from "../../theme";
import "./main-layout.css";

const ViewRoutes = () => (
    <div className="overlay-view-container">
        <Switch>
            <Route path="/app/view/account" component={AccountView} />
            <Route path="/app/view/ico" component={IcoView} />
            <Route path="/app/view/settings" component={SettingsView} />
            <Route path="/app/view/wallet" component={WalletView} />
            <Route path="/app/view/upload/:step?" component={UploadView} />
            <Route path="/app/view/developers" component={DevelopersView} />
            <Route path="/app/view/ingress" component={IngressView} />
            <Route path="/app/view/dao" component={DaoView} />
            <Route path="/app/view/content" component={ContentView} />
        </Switch>
    </div>
);

const MainLayout = () => (
    <main className="MainLayout">
        {/* Browse route always mounted */}
        <Route component={BrowseView} />
        <Route exact path="/" render={() => <Redirect to="/app" exact />} />
        {/* Overlay views */}
        <Route
            path="/app/view"
            component={ViewRoutes}
            className="overlay-views-container"
        />
        {/* <AnimatedRoute
            path="/app/view"
            component={ViewRoutes}
            atEnter={{opacity: 0}}
            atLeave={{opacity: 0}}
            atActive={{opacity: 1}}
            mapStyles={(styles) => ({
                opacity: styles.opacity
            })}
            className="overlay-views-container"
        /> */}
        {/* Main navigation */}
        <MainNavigation />
        {/* Video Playback (always mounted for animation purposes) */}
        <VideoPlayback />
    </main>
);
export default MainLayout;
