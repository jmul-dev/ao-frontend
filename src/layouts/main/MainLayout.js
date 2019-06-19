import React from "react";
import { Redirect, Route, Switch } from "react-router";
import VideoPlayback from "../../modules/video/components/VideoPlayback";
import AccountView from "../../views/account/AccountView";
import BrowseView from "../../views/browse/BrowseView";
import ContentView from "../../views/content";
import DaoView from "../../views/dao/DaoView";
import DaoDappView from "../../views/dao/DaoDappView";
import DevelopersView from "../../views/developers/DevelopersView";
import IcoView from "../../views/ico/IcoView";
import IngressView from "../../views/ingress/IngressView";
import NameRegistrationView from "../../views/registration/NameRegistrationView";
import WriterView from "../../views/writer/WriterView";
import SettingsView from "../../views/settings/SettingsView";
import UploadView from "../../views/upload/UploadView";
import WalletView from "../../views/wallet/WalletView";
import TermsView from '../../views/terms/TermsView';
import "./main-layout.css";
import MainNavigation from "./MainNavigation";

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
            <Route path="/app/view/daoDapp" component={DaoDappView} />
            <Route path="/app/view/terms" component={TermsView} />
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
        {/* Registration view (modal overlay) */}
        <Route
            exact
            path="/app/registration"
            component={NameRegistrationView}
        />
        {/* Writer form (modal overlay) */}
        <Route exact path="/app/writerMismatch" component={WriterView} />
    </main>
);
export default MainLayout;
