import React, { PureComponent } from 'react';
import View from '../View';
import withEthAddress from '../../modules/account/containers/withEthAddress';
import AccountRequired from '../../modules/account/components/AccountRequired';


class IngressView extends PureComponent {
    constructor() {
        super()
        this.state = {
            isElectron: !!(window.chrome && window.chrome.ipcRenderer),
        }
    }
    componentDidMount() {
        if ( this.state.isElectron && this.props.ethAddress ) {
            window.chrome.ipcRenderer.send('OPEN_DAPP_WINDOW', "https://www.ingress.one")
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
                window.chrome.ipcRenderer.send('OPEN_DAPP_WINDOW', "https://www.ingress.one")
            }
        }
    }
    render() {
        const { isElectron } = this.state
        return (
            <View className={'IngressView'} padding="none">
                <section style={{height: '100%', width: '100%'}}>
                    {!isElectron && (
                        <iframe 
                            src="https://www.ingress.one" 
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

export default withEthAddress(IngressView)