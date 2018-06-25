// @flow
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { NavLink } from 'react-router-dom';

const MainLayout = () => (
    <div className="MainLayout">
        <main>
            <Switch>
                <Route path="/app/browse" render={() => `browse`} />
                <Route path="/app/account" render={() => `account`} />
                <Route path="/app/settings" render={() => `settings`} />
                <Route path="/app/upload" render={() => `upload`} />
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