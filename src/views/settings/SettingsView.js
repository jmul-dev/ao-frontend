// @flow
import React, { Component } from 'react';
import View from '../View';
import ConsoleContainer from '../../modules/console/containers/ConsoleContainer'
import SettingsInput from '../../modules/settings'
import Typography from '@material-ui/core/Typography';

type Props = {

};

export default class SettingsView extends Component<Props> {
    props: Props;
    render() {
        return (
            <View className={'SettingsView'}>
                <Typography variant="display1" gutterBottom align="center">
                    {'Settings'}
                </Typography>
                <section>
                    <Typography variant="headline" gutterBottom>
                        {'Activity Log'}
                    </Typography>
                    <ConsoleContainer />
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
                    <SettingsInput inputName="maxBandwidthUp" />
                    <SettingsInput inputName="maxBandwidthDown" />
                </section>
            </View>
        );
    }
}
