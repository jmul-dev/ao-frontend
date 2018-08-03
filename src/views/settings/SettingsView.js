// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import ConsoleContainer from '../../modules/console/containers/ConsoleContainer';
import SettingsInput from '../../modules/settings';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import './settings-view.css';


export default class SettingsView extends PureComponent {
    render() {
        return (
            <View className={'SettingsView'} padding="full">
                <header>
                    <Typography variant="display3" gutterBottom>
                        {'Settings'}
                    </Typography>
                </header>
                <Grid container spacing={16}>                
                    <Grid item xs={4}>
                        <section>
                            <Typography variant="subheading" gutterBottom>
                                {'General'}
                            </Typography>
                            <SettingsInput inputName="runOnStartup" inputLabel="Run AO on startup" />
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
                    <Grid item xs={6} style={{marginLeft: 'auto'}}>     
                        <section className="section-console">
                            <Typography variant="subheading" gutterBottom className="console-heading">
                                {'Activity Log'}
                            </Typography>
                            <ConsoleContainer />
                        </section>
                    </Grid>
                </Grid>                
            </View>
        );
    }
}
