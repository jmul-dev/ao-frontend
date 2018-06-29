// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import SettingsView from '../../views/settings/SettingsView';
import AccountView from '../../views/account/AccountView';
import MainNavigation from './MainNavigation';
import './main-layout.css';

const MainLayout = () => (
    <div className="MainLayout">
        <main>
            <div>[Browse view goes here]</div>
            <Switch>
                <Route path="/app/account" component={AccountView} />
                <Route path="/app/settings" component={SettingsView} />
                <Route path="/app/upload" render={() => `upload`} />
            </Switch>
        </main>
        <aside>
            <Switch>
                <Route path="/app/browse/play" render={() => `browse/play`} />
            </Switch>
        </aside>
        <MainNavigation />
    </div>
)
export default MainLayout