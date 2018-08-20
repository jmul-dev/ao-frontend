// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import Wallet from '../../modules/wallet/components/Wallet';
import Typography from '@material-ui/core/Typography';
import Account from '../../modules/account/components/Account';
import AccountVideoListing from '../../modules/account/components/AccountVideoListing';
import AccountVideoFilters from '../../modules/account/components/AccountVideoFilters';
import Grid from '@material-ui/core/Grid';
import withEthAddress from '../../modules/account/containers/withEthAddress';
import './account-view.css';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { darkTheme } from '../../theme';


class AccountView extends PureComponent {
    render() {
        const { ethAddress } = this.props
        return (
            <View className={`AccountView ${ethAddress ? 'connected' : 'not-connected'}`} padding="none">                
                <header>
                    <MuiThemeProvider theme={darkTheme}>
                        <Grid container spacing={16}> 
                            <Grid item xs={12} sm={6}>
                                <Account display="ethIcon" size={25} className="eth-address-icon" />
                                <Typography variant="title" gutterBottom>
                                    {'My Account'}
                                </Typography>
                                <div style={{display: 'flex'}}>
                                    <Typography variant="body1" style={{flexShrink: 0, marginRight: 8, fontWeight: 'bold', opacity: ethAddress ? 1 : 0.5}}>
                                        {'id:'}
                                    </Typography>
                                    <Typography variant="body1" style={{overflow: 'hidden', wordWrap: 'break-word'}}>
                                        <Account display="ethAddress" />
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Wallet />
                            </Grid>
                        </Grid>
                    </MuiThemeProvider>
                </header>
                <section>
                    <Grid container spacing={16}> 
                        <Grid item xs={12}>
                            <AccountVideoFilters disabled={!ethAddress} />
                            <AccountVideoListing />
                        </Grid>
                    </Grid>
                </section>
            </View>
        );
    }
}

export default withEthAddress(AccountView)