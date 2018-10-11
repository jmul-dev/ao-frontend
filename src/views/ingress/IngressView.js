import React, { PureComponent } from 'react';
import View from '../View';
import Typography from '@material-ui/core/Typography';


export default class IngressView extends PureComponent {
    render() {
        const isElectron = !!(window.chrome && window.chrome.ipcRenderer)
        return (
            <View className={'IngressView'} padding="full">
                <section style={{height: '100%', width: '100%'}}>
                    {isElectron ? (
                        <webview 
                            src="http://ingress.one" 
                            style={{height: '100%', width: '100%', border: 0}} 
                        />
                    ) : (
                        <iframe 
                            src="http://ingress.one" 
                            style={{height: '100%', width: '100%', border: 0}} 
                        />
                    )}                    
                </section>
            </View>
        );
    }
}
