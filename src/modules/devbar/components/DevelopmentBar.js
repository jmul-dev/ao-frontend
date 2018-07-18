// @flow
import React, { PureComponent } from 'react';
import { AppReducerType } from '../../../store/app.reducer';
import '../styles/development-bar.css';
import packageJson from '../../../../package.json';
import { APP_STATES, getNetworkName } from '../../../store/app.reducer';

type Props = {
    data: {
        loading: boolean,
        error?: string
    },
    app: AppReducerType,
    isElectron: boolean,
};

export default class DevelopmentBar extends PureComponent<Props> {
    props: Props;
    render() {
        const { states, ethNetworkId } = this.props.app
        const { loading, error, version } = this.props.data
        const web3Available = states[APP_STATES.WEB3_AVAILABLE]
        const web3Connected = states[APP_STATES.WEB3_CONNECTED]
        const coreConnected = states[APP_STATES.CORE_CONNECTED]
        if ( loading )
            return null
        return (
            <div className="DevelopmentBar">
                <div className={`status`}>frontend v{packageJson.version}</div>
                <div className={`status`}>core v{version}</div>
                <div className={`status ${coreConnected ? 'success' : 'error'}`}>ao-core</div>
                <div className={`status ${this.props.isElectron ? 'success' : 'error'}`}>electron</div>
                <div className={`status ${web3Available ? 'success' : 'error'}`}>web3</div>
                <div className={`status ${!error ? 'success' : 'error'}`}>graphql</div>
                {web3Connected ? (
                    <div className={`status success`}>{getNetworkName(ethNetworkId)}</div>
                ):null}
            </div>
        );
    }
}
