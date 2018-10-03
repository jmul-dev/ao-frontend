import React, { PureComponent } from 'react';
import View from '../View';
import Wallet from '../../modules/wallet/components/Wallet';
import Typography from '@material-ui/core/Typography';
import Account from '../../modules/account/components/Account';
import AccountVideoListing from '../../modules/account/components/AccountVideoListing';
import AccountVideoFilters from '../../modules/account/components/AccountVideoFilters';
import Grid from '@material-ui/core/Grid';
import withEthAddress from '../../modules/account/containers/withEthAddress';
import ConsoleContainer from '../../modules/console/containers/ConsoleContainer';


class WalletView extends PureComponent {
    render() {
        const { ethAddress } = this.props
        return (
            <View className={`WalletView ${ethAddress ? 'connected' : 'not-connected'}`} padding="full">                
                <header style={{marginBottom: 36}}>
                    <Typography variant="title" gutterBottom>
                        {'My Account'}         
                    </Typography>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{marginRight: 8}}>
                            <Account display="ethIcon" size={25} className="eth-address-icon" />
                        </div>
                        <div style={{display: 'flex'}}>
                            <Typography variant="body1" style={{flexShrink: 0, marginRight: 6, fontWeight: 'bold', opacity: ethAddress ? 1 : 0.5}}>
                                {'id:'}
                            </Typography>
                            <Typography variant="body1" style={{overflow: 'hidden', wordWrap: 'break-word', opacity: ethAddress ? 1 : 0.5}}>
                                <Account display="ethAddress" />
                            </Typography>
                        </div>
                    </div>
                </header>
                <section>
                    <Grid container spacing={16}> 
                        <Grid item xs={12} sm={6}>
                            <Wallet />
                        </Grid>
                        <Grid item xs={12} sm={5} style={{marginLeft: 'auto'}}>
                            <section className="section-console">
                                <Typography variant="subheading" gutterBottom className="console-heading">
                                    {'Activity Log'}
                                </Typography>
                                <ConsoleContainer style={{maxHeight: `calc(100vh - 340px)`, overflow: 'auto'}}/>
                            </section>
                        </Grid>
                    </Grid>
                </section>
            </View>
        );
    }
}

export default withEthAddress(WalletView)