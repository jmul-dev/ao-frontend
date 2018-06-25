// @flow
import React, { PureComponent } from 'react';

type Props = {
    data: {
        loading: boolean,
        error?: string
    }
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
        const { loading } = this.props.data
        if ( loading )
            return 'Loading...'
        return (
            <div>
                <div>[web3 status]</div>
                <div>[web3 network]</div>
                <div>[web3 ethAddress]</div>
                {window.IS_ELECTRON ? (
                    <button onClick={this._openMetamask}>open metamask</button>
                ) : (
                    <div>Not rendered within Electron</div>
                )}                
            </div>
        );
    }
}
