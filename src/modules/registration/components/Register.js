// @flow
import React, { PureComponent } from 'react';
import { AppReducerType, APP_STATES } from '../../../store/app.reducer';

type Props = {
    register: Function,
    registerLoading: boolean,
    registerError?: Error,
    registerResult: any,
    app: AppReducerType,
    isElectron: boolean,
};

export default class Register extends PureComponent<Props> {
    props: Props;
    /**
     * If running under Electron we need to notify main process to
     * create the Metamask window (otherwise, assume user has access
     * to Metamask extension)
     */
    _openMetamask = () => {
        if ( this.props.isElectron )
            window.chrome.ipcRenderer.send('open-metamask-popup')
    }
    _onDirectorySelect = (event) => {
        console.log(event)
        var theFiles = event.target.files;
        var relativePath = theFiles[0].webkitRelativePath;
        console.log(theFiles, relativePath)
    }
    _register = () => {
        this.props.register()
    }
    render() {
        const { states, ethAddress } = this.props.app
        const { register, registerLoading, isElectron } = this.props
        const web3Available = states[APP_STATES.WEB3_AVAILABLE]
        return (
            <div className="Register">
                <h1>Register</h1>
                <p>First step, unlock account via Metamask</p>
                {/* <input type="file" onChange={this._onDirectorySelect} webkitdirectory="true" mozdirectory="true" msdirectory="true" odirectory="true" directory="true" multiple="true" /> */}                
                {isElectron && web3Available ? (
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
                        <button onClick={register}>register</button>
                    </div>
                ):null}
                {registerLoading ? (
                    'loading...'
                ):null}
            </div>
        );
    }
}
