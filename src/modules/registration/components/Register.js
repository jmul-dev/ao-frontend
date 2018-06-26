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
    _onDirectorySelect = (event) => {
        console.log(event)
        var theFiles = event.target.files;
        var relativePath = theFiles[0].webkitRelativePath;
        console.log(theFiles, relativePath)
    }
    _register = () => {
        const { ethAddress } = this.props.app

    }
    render() {
        const { web3Available, web3Connected, ethNetworkId, ethAddress } = this.props.app
        const { loading } = this.props.data
        if ( loading )
            return 'Loading...'
        return (
            <div className="Register">
                <h1>Register</h1>
                <p>First step, unlock account via Metamask</p>
                {/* <input type="file" onChange={this._onDirectorySelect} webkitdirectory="true" mozdirectory="true" msdirectory="true" odirectory="true" directory="true" multiple="true" /> */}                
                {window.IS_ELECTRON && web3Available ? (
                    <button onClick={this._openMetamask}>open metamask</button>
                ) : web3Available ? (
                        <div>Use your browser's Metamask extension</div>
                    ) : (
                        <div>Metamask is required</div>
                    )                    
                }
                {ethAddress ? (
                    <div>
                        <div>Current Ethereum account: {ethAddress}</div>
                        <button onClick={this._register}>register</button>
                    </div>
                ):null}
            </div>
        );
    }
}
