// @flow
import React, { Component, Node } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import MainLayout from './layouts/MainLayout';

type Props = {
    children: Node,
    data: {
        loading: boolean,
        error?: string,
        isRegistered: boolean
    }
};

export default class App extends Component<Props> {
    props: Props;
    render() {
        const { data } = this.props
        return (
            <div className="App">
                <Switch>
                    <Route path="/app" render={(routeProps) => (
                        data.isRegistered ? (
                            <MainLayout {...routeProps} />
                        ) : <Redirect to="/" />
                    )} />
                    <Route path="/" render={(routeProps) => (
                        !data.isRegistered ? (
                            <div>{`Not registered`}</div>
                        ) : <Redirect to="/app/browse" />                        
                    )} />
                </Switch>
            </div>
        );
    }
}
