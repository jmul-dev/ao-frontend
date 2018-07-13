// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import WalletContainer from '../../modules/wallet/containers/WalletContainer';
import Typography from '@material-ui/core/Typography';
import Account from '../../modules/account/components/Account';
import AccountVideoListing from '../../modules/account/components/AccountVideoListing';
import Grid from '@material-ui/core/Grid';


export default class AccountView extends PureComponent {
    render() {
        return (
            <View className={'AccountView'} padding="full">
                <Grid container spacing={16}>                
                    <Grid item xs={6}>
                        <header style={{display: 'flex', alignItems: 'center'}}>
                            <Account display="ethIcon" />
                            <div style={{marginLeft: 16}}>
                                <Typography variant="display3" gutterBottom>
                                    {'Account'}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <Account display="ethAddress" />
                                </Typography>
                            </div>
                        </header>
                    </Grid>
                    <Grid item xs={5} style={{marginLeft: 'auto'}}>
                        <section>
                            <Typography variant="display3" gutterBottom>
                                {'Wallet'}
                            </Typography>
                            <WalletContainer />
                        </section>
                    </Grid>
                    <Grid item xs={12}>
                        <section>
                            <Typography variant="display3" gutterBottom>
                                {'My videos'}
                            </Typography>
                            <AccountVideoListing />
                        </section>
                    </Grid>
                </Grid>
            </View>
        );
    }
}
