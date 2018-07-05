// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import SettingsView from '../../views/settings/SettingsView';
import AccountView from '../../views/account/AccountView';
import BrowseView from '../../views/browse/BrowseView';
import MainNavigation from './MainNavigation';
import './main-layout.css';


const MainLayout = () => (
    <main className="MainLayout">
        <Route component={BrowseView} />
        <Switch>
            <Route path="/app/account" component={AccountView} />
            <Route path="/app/settings" component={SettingsView} />
            <Route path="/app/upload" render={() => `upload`} />
        </Switch>
        <aside>
            <Switch>
                <Route path="/app/browse/play" render={() => `browse/play`} />
            </Switch>
        </aside>
        <MainNavigation />
    </main>
)
export default MainLayout