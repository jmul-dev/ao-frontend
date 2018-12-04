import React, { PureComponent } from 'react';
import View from '../View';
import Typography from '@material-ui/core/Typography';


export default class IngressView extends PureComponent {
    constructor() {
        super()
        this.state = {
            isElectron: !!(window.chrome && window.chrome.ipcRenderer)
        }
    }
    componentDidMount() {
        if ( this.state.isElectron ) {
            window.chrome.ipcRenderer.send('open-metamask-notification')
            window.chrome.ipcRenderer.send('OPEN_DAPP_WINDOW', "https://www.ingress.one")
        }
    }
    componentWillUnmount() {
        if ( this.state.isElectron ) {
            window.chrome.ipcRenderer.send('CLOSE_DAPP_WINDOW')
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
                    {/*  */}
                </section>
            </View>
        );
    }
}
