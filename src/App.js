// @flow
import React, { Component, Node } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import MainLayout from './layouts/main/MainLayout';
import RegisterLayout from './layouts/register/RegisterLayout';
import BootLayout from './layouts/boot/BootLayout';
import DevelopmentBarContainer from './modules/devbar/containers/DevelopmentBarContainer';
import { APP_STATES } from './store/app.reducer';
import './app-variables.css';
import './app.css';


type Props = {
    children: Node,
    query: {
        loading: boolean,
        error?: string,
        state?: string,
        node?: {
            id: string
        },
        networkStatus: number,
    },
    // redux connected actions
    updateAppState: Function,
    connectToWeb3: Function,
};

export default class App extends Component<Props> {
    props: Props;
    componentDidMount() {
        const { app, connectToWeb3 } = this.props
        if ( app.states[APP_STATES.WEB3_AVAILABLE] ) {
            window.web3.version.getNetwork((error, networkId) => {
                connectToWeb3(networkId)
            })
        }
    }
    componentWillReceiveProps( nextProps: Props ) {
        const { query, app, updateAppState } = this.props
        if ( !query.state && nextProps.query.state !== undefined ) {
            // no core state -> core state, means our core connection has been established
            updateAppState(APP_STATES.CORE_CONNECTED, true)
        }
        if ( query.networkStatus === 8 && nextProps.query.networkStatus < 8 ) {
            // couldnt connect to core -> now connected to core
            updateAppState(APP_STATES.CORE_CONNECTED, true)
        } else if ( query.networkStatus < 8 && nextProps.query.networkStatus === 8 ) {
            // network error just occured, ie couldnt connect to core
            updateAppState(APP_STATES.CORE_CONNECTED, false)
        }
        if ( query.state !== 'READY' && nextProps.query.state === 'READY' ) {  // TODO: pull READY from ao-core constants
            updateAppState(APP_STATES.CORE_READY, true)
        }
    }
    render() {
        const { query, app } = this.props
        if ( !app.states[APP_STATES.CORE_READY] ) {
            return <BootLayout networkError={query.error} />
        }
        return (
            <div className={`App ${process.env.NODE_ENV !== 'production' ? 'development-bar-spacing' : ''}`}>                
                <Switch>
                    <Route path="/app" render={(routeProps) => (
                        query.node ? (
                            <MainLayout {...routeProps} />
                        ) : <Redirect to="/" />
                    )} />
                    <Route path="/" render={(routeProps) => (
                        !query.node ? (
                            <RegisterLayout {...routeProps} />
                        ) : <Redirect to="/app/browse" />
                    )} />
                </Switch>
                {process.env.NODE_ENV !== 'production' ? (
                    <DevelopmentBarContainer />
                ):null}
                <div style={{color: 'white'}}>{this.props.app.state}</div>
            </div>
        );
    }
}
