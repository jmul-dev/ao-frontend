// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import SettingsView from '../../views/settings/SettingsView';
import AccountView from '../../views/account/AccountView';
import BrowseView from '../../views/browse/BrowseView';
import MainNavigation from './MainNavigation';
import { AnimatedRoute, AnimatedSwitch } from 'react-router-transition';

import './main-layout.css';

const ViewRoutes = () => (
    <AnimatedSwitch 
        atEnter={{offset: -25, opacity: 0}}
        atLeave={{offset: -25, opacity: 0}}
        atActive={{offset: 0, opacity: 1}}
        mapStyles={(styles) => ({
            transform: `translateX(${styles.offset}%)`,
            opacity: styles.opacity
        })}
        className="overlay-views-wrapper"
        >
        <Route path="/app/view/account" component={AccountView} />
        <Route path="/app/view/settings" component={SettingsView} />
        <Route path="/app/view/upload" render={() => `upload`} />
    </AnimatedSwitch>
)

const ViewRoutesBackdrop = () => (
    <div className="overlay-views-backdrop"></div>
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
        />
        {/* Main navigation */}
        <Switch>
            <Route path="/app/view" render={() => <MainNavigation light />} />
            <Route render={() => <MainNavigation dark />} />
        </Switch>
    </main>
)
export default MainLayout