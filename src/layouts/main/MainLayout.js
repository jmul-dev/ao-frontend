// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import SettingsView from '../../views/settings/SettingsView';
import AccountView from '../../views/account/AccountView';
import BrowseView from '../../views/browse/BrowseView';
import UploadView from '../../views/upload/UploadView';
import MainNavigation from './MainNavigation';
import { AnimatedRoute } from 'react-router-transition';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { lightTheme } from '../../theme';
import './main-layout.css';

const muiThemeLight = createMuiTheme(lightTheme)

const ViewRoutes = () => (
    <MuiThemeProvider theme={muiThemeLight}>
        <div className="overlay-view-container">
            <Switch>
                <Route path="/app/view/account" component={AccountView} />
                <Route path="/app/view/settings" component={SettingsView} />
                <Route path="/app/view/upload/:step?" component={UploadView} />
            </Switch>
        </div>
    </MuiThemeProvider>
)

const ViewRoutesBackdrop = () => (
    <Link to="/app" className="overlay-views-backdrop"></Link>
)

const MainLayout = () => (
    <main className="MainLayout">
        {/* Browse route always mounted */}
        <Route component={BrowseView} />
        {/* Overlay views */}
        <AnimatedRoute
            path="/app/view"
            component={ViewRoutesBackdrop}
            atEnter={{opacity: 0}}
            atLeave={{opacity: 0}}
            atActive={{opacity: 1}}
            mapStyles={(styles) => ({
                opacity: styles.opacity
            })}
        />
        <AnimatedRoute
            path="/app/view"
            component={ViewRoutes}
            atEnter={{offset: -25, opacity: 0}}
            atLeave={{offset: -25, opacity: 0}}
            atActive={{offset: 0, opacity: 1}}
            mapStyles={(styles) => ({
                transform: `translateX(${styles.offset}%)`,
                opacity: styles.opacity
            })}
            className="overlay-views-container"
        />
        {/* Main navigation */}
        <Switch>
            <Route path="/app/view" render={() => <MainNavigation light />} />
            <Route render={() => <MainNavigation dark />} />
        </Switch>
    </main>
)
export default MainLayout