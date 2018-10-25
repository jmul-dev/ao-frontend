import React, { PureComponent } from 'react';
import View from '../View';
import Typography from '@material-ui/core/Typography';


export default class IngressView extends PureComponent {
    constructor() {
        super()
        this.state = {
            isElectron: !!(window.chrome && window.chrome.ipcRenderer)
        }
        this.webviewRef = React.createRef();
    }
    componentDidMount() {
        if ( this.state.isElectron && this.webviewRef ) {
            this.webviewRef.current.addEventListener('dom-ready', () => {
                this.webviewRef.current.openDevTools()
            })
        }
    }
    render() {
        const { isElectron } = this.state
        return (
            <View className={'IngressView'} padding="none">
                <section style={{height: '100%', width: '100%'}}>
                    {isElectron ? (
                        <webview 
                            ref={this.webviewRef}
                            plugins
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
