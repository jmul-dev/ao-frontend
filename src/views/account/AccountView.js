import React, { PureComponent } from 'react';
import { Route } from 'react-router';
import View from '../View';
import Typography from '@material-ui/core/Typography';
import AccountVideoListing from '../../modules/account/components/AccountVideoListing';
import AccountVideoFilters from '../../modules/account/components/AccountVideoFilters';
import Grid from '@material-ui/core/Grid';
import withEthAddress from '../../modules/account/containers/withEthAddress';
import AccountVideoView from './AccountVideoView';
import Export from '../../modules/account/components/Export';
import './account-view.css';


class AccountView extends PureComponent {
    render() {
        const { ethAddress } = this.props
        return (
            <React.Fragment>
                <View className={`AccountView ${ethAddress ? 'connected' : 'not-connected'}`} padding="full">
                    <header style={{display: 'flex'}}>
                        <Typography variant="subheading" gutterBottom>
                            {'My Videos'}
                        </Typography>
                        <Export />
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
                <Route path="/app/view/videos/:videoId" component={AccountVideoView} />
            </React.Fragment>
        );
    }
}

export default withEthAddress(AccountView)