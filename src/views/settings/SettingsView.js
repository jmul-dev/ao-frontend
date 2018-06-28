// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import ConsoleContainer from '../../modules/console/containers/ConsoleContainer'
import SettingsInput from '../../modules/settings'
import Typography from '@material-ui/core/Typography';


export default class SettingsView extends PureComponent {
    render() {
        return (
            <View className={'SettingsView'}>
                <header>
                    <Typography variant="display1" gutterBottom align="center">
                        {'Settings'}
                    </Typography>
                </header>
                <section>
                    <Typography variant="headline" gutterBottom>
                        {'General'}
                    </Typography>
                    <SettingsInput inputName="runOnStartup" inputLabel="Run AO on startup" />
                    <SettingsInput inputName="runInBackground" inputLabel="Run AO in background" />
                    <SettingsInput inputName="checkForUpdates" inputLabel="Check for updates on startup" />
                </section>
                <section>
                    <Typography variant="headline" gutterBottom>
                        {'Storage'}
                    </Typography>
                    <SettingsInput inputName="maxDiskSpace" />
                </section>
                <section>
                    <Typography variant="headline" gutterBottom>
                        {'Network'}
                    </Typography>
                    <SettingsInput inputName="maxBandwidthUp" inputLabel="Max upload speed" />
                    <SettingsInput inputName="maxBandwidthDown" inputLabel="Max download speed" />
                </section>
                <section>
                    <Typography variant="headline" gutterBottom>
                        {'P2P'}
                    </Typography>
                    <SettingsInput inputName="maxPeerConnections" />
                </section>
                <section>
                    <Typography variant="headline" gutterBottom>
                        {'Activity Log'}
                    </Typography>
                    <ConsoleContainer />
                </section>
            </View>
        );
    }
}
