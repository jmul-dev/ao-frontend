// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import Wallet from '../../modules/wallet/components/Wallet';
import Typography from '@material-ui/core/Typography';
import Account from '../../modules/account/components/Account';
import AccountVideoListing from '../../modules/account/components/AccountVideoListing';
import Grid from '@material-ui/core/Grid';
import withEthAddress from '../../modules/account/containers/withEthAddress';
import './account-view.css';


class AccountView extends PureComponent {
    render() {
        const { ethAddress } = this.props
        return (
            <View className={`AccountView ${ethAddress ? 'connected' : 'not-connected'}`} padding="full">
                <Grid container spacing={16}> 
                    <Grid item xs={12}>
                        <header style={{display: 'flex', alignItems: 'center', marginBottom: 24}}>
                            <Typography variant="title">
                                {'My Account'}
                            </Typography>
                        </header>
                    </Grid>
                    <Grid item xs={6}>
                        <section className="account-card">
                            <div className="triangle"></div>
                            <div style={{display: 'flex'}}>
                                <Typography variant="display3" gutterBottom style={{width: 60, flexShrink: 0, fontWeight: 'bold', opacity: ethAddress ? 1 : 0.5}}>
                                    {'id:'}
                                </Typography>
                                <Typography variant="display3" gutterBottom style={{overflow: 'hidden', wordWrap: 'break-word'}}>
                                    <Account display="ethAddress" />
                                </Typography>
                            </div>                            
                        </section>                            
                    </Grid>
                    <Grid item xs={6}>
                        <section className="account-card" style={{padding: 0}}>
                            <Wallet />
                        </section>
                    </Grid>
                    <Grid item xs={12}>
                        <section style={{marginTop: 48}}>
                            <Typography variant="title" gutterBottom className={ethAddress ? '' : 'placeholder-text'}>
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

export default withEthAddress(AccountView)