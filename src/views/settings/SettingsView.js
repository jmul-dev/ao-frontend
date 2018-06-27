// @flow
import React, { Component } from 'react';
import View from '../View';
import ConsoleContainer from '../../modules/console/containers/ConsoleContainer'

type Props = {

};

export default class SettingsView extends Component<Props> {
    props: Props;
    render() {
        return (
            <View className={'SettingsView'}>
                <h1>Settings</h1>
                <section>
                    <h2>Console</h2>
                    <ConsoleContainer />
                </section>
            </View>
        );
    }
}
