// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import Typography from '@material-ui/core/Typography';
import AccountVideoListing from '../../modules/account/components/AccountVideoListing';
import AccountVideoFilters from '../../modules/account/components/AccountVideoFilters';
import Grid from '@material-ui/core/Grid';
import withEthAddress from '../../modules/account/containers/withEthAddress';
import './account-view.css';


class AccountView extends PureComponent {
    render() {
        const { ethAddress } = this.props
        return (
            <View className={`AccountView ${ethAddress ? 'connected' : 'not-connected'}`} padding="full">                
                <header>
                    <Typography variant="title" gutterBottom>
                        {'My Videos'}
                    </Typography>
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