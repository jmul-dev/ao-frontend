// @flow
import React, { PureComponent } from 'react';
import { AppReducerType } from '../../../store/app.reducer';
import '../styles/development-bar.css';
import packageJson from '../../../../package.json';
import { getNetworkName } from '../../../store/app.reducer';

type Props = {
    data: {
        loading: boolean,
        error?: string
    },
    app: AppReducerType
};

export default class DevelopmentBar extends PureComponent<Props> {
    props: Props;
    render() {
        const { web3Connected, ethNetworkId } = this.props.app
        const { loading, error, version } = this.props.data
        if ( loading )
            return null
        return (
            <div className="DevelopmentBar">
                <div className={`status`}>frontend v{packageJson.version}</div>
                <div className={`status`}>core v{version}</div>
                <div className={`status ${window.IS_ELECTRON ? 'success' : 'error'}`}>electron</div>
                <div className={`status ${web3Connected ? 'success' : 'error'}`}>web3</div>
                <div className={`status ${!error ? 'success' : 'error'}`}>graphql</div>
                {ethNetworkId ? (
                    <div className={`status success`}>{getNetworkName(ethNetworkId)}</div>
                ):null}
            </div>
        );
    }
}
