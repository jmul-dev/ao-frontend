// @flow
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { NavLink } from 'react-router-dom';
import SettingsView from '../../views/settings/SettingsView';
import AccountView from '../../views/account/AccountView';
import UploadView from '../../views/upload/UploadView';

const MainLayout = () => (
    <div className="MainLayout">
        <main>
            <Switch>
                <Route path="/app/browse" render={() => `browse`} />
                <Route path="/app/account" component={AccountView} />
                <Route path="/app/settings" component={SettingsView} />
                <Route path="/app/upload" component={UploadView} />
            </Switch>
        </main>
        <nav>
            <NavLink to="/app/browse">Browse</NavLink>
            <NavLink to="/app/account">Account</NavLink>
            <NavLink to="/app/settings">Settings</NavLink>
            <NavLink to="/app/upload">Upload</NavLink>
        </nav>
        <aside>
            <Switch>
                <Route path="/app/browse/play" render={() => `browse/play`} />
            </Switch>
        </aside>
    </div>
)
export default MainLayout