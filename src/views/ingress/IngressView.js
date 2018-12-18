import React, { PureComponent } from 'react';
import View from '../View';
import { compose } from 'react-apollo';
import withEthAddress from '../../modules/account/containers/withEthAddress';
import AccountRequired from '../../modules/account/components/AccountRequired';
import withContractSettings from '../../modules/settings/containers/withContractSettings';


class IngressView extends PureComponent {
    constructor() {
        super()
        this.state = {
            isElectron: !!(window.chrome && window.chrome.ipcRenderer),
        }
    }
    componentDidMount() {
        if ( this.state.isElectron && this.props.ethAddress ) {
            window.chrome.ipcRenderer.send('OPEN_DAPP_WINDOW', this.props.contractSettings.ingressUrl)
        }
    }
    componentWillUnmount() {
        if ( this.state.isElectron ) {
            window.chrome.ipcRenderer.send('CLOSE_DAPP_WINDOW')
        }
    }
    componentDidUpdate(prevProps) {
        if ( this.state.isElectron ) {
            if (prevProps.ethAddress && !this.props.ethAddress) {
                window.chrome.ipcRenderer.send('CLOSE_DAPP_WINDOW')
            } else if (!prevProps.ethAddress && this.props.ethAddress) {
                window.chrome.ipcRenderer.send('OPEN_DAPP_WINDOW', this.props.contractSettings.ingressUrl)
            }
        }
    }
    render() {
        const { contractSettings } = this.props
        const { isElectron } = this.state
        if ( !contractSettings.ingressUrl )
            return null;
        return (
            <View className={'IngressView'} padding="none">
                <section style={{height: '100%', width: '100%'}}>
                    {!isElectron && (
                        <iframe 
                            src={contractSettings.ingressUrl} 
                            style={{height: '100%', width: '100%', border: 0}} 
                        />
                    )}
                    {isElectron && (
                        <div style={{height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <AccountRequired>
                                <div>{/*placeholder*/}</div>
                            </AccountRequired>
                        </div>
                    )}
                </section>
            </View>
        );
    }
}

export default compose(
    withEthAddress,
    withContractSettings,
)(IngressView)