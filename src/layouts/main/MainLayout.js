// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import SettingsView from '../../views/settings/SettingsView';
import AccountView from '../../views/account/AccountView';
import BrowseView from '../../views/browse/BrowseView';
import MainNavigation from './MainNavigation';
import OverlayViewContainer from './OverlayViewContainer';
import './main-layout.css';

const ViewRoutes = () => (
    <OverlayViewContainer>
        <Switch>
            <Route path="/app/view/account" component={AccountView} />
            <Route path="/app/view/settings" component={SettingsView} />
            <Route path="/app/view/upload" render={() => `upload`} />
        </Switch>
    </OverlayViewContainer>
)

const MainLayout = () => (
    <main className="MainLayout">
        <Route component={BrowseView} />
        <Route path="/app/view" component={ViewRoutes}></Route>
        <Switch>
            <Route path="/app/view" render={() => <MainNavigation light />} />
            <Route render={() => <MainNavigation dark />} />
        </Switch>
    </main>
)
export default MainLayout