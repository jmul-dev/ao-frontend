// @flow
import React, { PureComponent } from 'react';
import { AppReducerType } from '../../../store/app.reducer';

type Props = {
    data: {
        loading: boolean,
        error?: string
    },
    app: AppReducerType
};

export default class Register extends PureComponent<Props> {
    props: Props;
    /**
     * If running under Electron we need to notify main process to
     * create the Metamask window (otherwise, assume user has access
     * to Metamask extension)
     */
    _openMetamask = () => {
        if ( !window.IS_ELECTRON )
            return null
        window.chrome.ipcRenderer.send('open-metamask-popup')
    }
    render() {
        const { web3Connected, ethNetworkId, ethAddress } = this.props.app
        const { loading } = this.props.data
        if ( loading )
            return 'Loading...'
        return (
            <div>
                <div>web3 status: {web3Connected ? `connected` : `not connected`}</div>
                <div>eth network: {ethNetworkId || `not connected`}</div>
                <div>eth address: {ethAddress || `not connected`}</div>
                {window.IS_ELECTRON ? (
                    <button onClick={this._openMetamask}>open metamask</button>
                ) : (
                    <div>Not rendered within Electron</div>
                )}                
            </div>
        );
    }
}
