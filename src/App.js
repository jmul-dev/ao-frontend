// @flow
import React, { Component, Node } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import MainLayout from './layouts/main/MainLayout';
import RegisterLayout from './layouts/register/RegisterLayout';
import BootLayout from './layouts/boot/BootLayout';
import DevelopmentBarContainer from './modules/devbar/containers/DevelopmentBarContainer';
import CssBaseline from '@material-ui/core/CssBaseline';
import './app-variables.css';
import './app.css';


type Props = {
    children: Node,
    data: {
        loading: boolean,
        error?: string,
        state?: string,
        node?: {
            id: string
        }
    }
};

export default class App extends Component<Props> {
    props: Props;
    componentDidMount() {
        const { app, connectedToNetwork } = this.props
        if ( app.web3Available ) {
            window.web3.version.getNetwork((error, networkId) => {
                connectedToNetwork(networkId)
            })
        }
    }
    render() {
        const { data } = this.props
        if ( data.state !== "READY" ) {
            return <BootLayout />
        }
        return (
            <div className={`App ${process.env.NODE_ENV !== 'production' ? 'development-bar-spacing' : ''}`}>
                <CssBaseline />
                <Switch>
                    <Route path="/app" render={(routeProps) => (
                        data.node ? (
                            <MainLayout {...routeProps} />
                        ) : <Redirect to="/" />
                    )} />
                    <Route path="/" render={(routeProps) => (
                        !data.node ? (
                            <RegisterLayout {...routeProps} />
                        ) : <Redirect to="/app/browse" />
                    )} />
                </Switch>
                {process.env.NODE_ENV !== 'production' ? (
                    <DevelopmentBarContainer />
                ):null}
            </div>
        );
    }
}
