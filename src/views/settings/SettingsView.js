import React, { PureComponent } from 'react';
import View from '../View';
import SettingsInput from '../../modules/settings';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import './settings-view.css';


export default class SettingsView extends PureComponent {
    render() {
        return (
            <View className={'SettingsView'} padding="full">
                <header>
                    <Typography variant="subheading" gutterBottom>
                        {'Settings'}
                    </Typography>
                </header>
                <Grid container spacing={16}>                
                    <Grid item xs={12} sm={10} md={6}>
                        <section>
                            <Typography variant="subheading" gutterBottom>
                                {'General'}
                            </Typography>
                            <SettingsInput disabled inputName="runOnStartup" inputLabel="Run AO on startup" />
                            <SettingsInput disabled inputName="runInBackground" inputLabel="Run AO in background" />
                            <SettingsInput disabled inputName="checkForUpdates" inputLabel="Check for updates on startup" />
                        </section>
                        <section>
                            <Typography variant="subheading" gutterBottom>
                                {'Storage'}
                            </Typography>
                            <SettingsInput disabled inputName="maxDiskSpace" />
                        </section>
                        <section>
                            <Typography variant="subheading" gutterBottom>
                                {'Network'}
                            </Typography>
                            <SettingsInput disabled inputName="maxBandwidthUp" inputLabel="Max upload speed" />
                            <div className="spacer"></div>
                            <SettingsInput disabled inputName="maxBandwidthDown" inputLabel="Max download speed" />
                        </section>
                        <section>
                            <Typography variant="subheading" gutterBottom>
                                {'P2P'}
                            </Typography>
                            <SettingsInput disabled inputName="maxPeerConnections" />
                        </section>
                    </Grid>
                </Grid>                
            </View>
        );
    }
}
