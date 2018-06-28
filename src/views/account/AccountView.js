// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import WalletContainer from '../../modules/wallet/containers/WalletContainer'
import Typography from '@material-ui/core/Typography';


export default class AccountView extends PureComponent {
    render() {
        return (
            <View className={'AccountView'}>
                <header>
                    <Typography variant="display1" gutterBottom align="center">
                        {'Account'}
                    </Typography>
                </header>
                <section>
                    <Typography variant="headline" gutterBottom>
                        {'Wallet'}
                    </Typography>
                    <WalletContainer />
                </section>
            </View>
        );
    }
}
