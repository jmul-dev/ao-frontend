// @flow
import React, { Component } from 'react';
import { SettingsType } from '../graphql/settings'

type Props = {
    data: {
        loading: boolean,
        error?: string,
        settings?: SettingsType
    }
};

export default class StorageInputs extends Component<Props> {
    props: Props;
    render() {
        const { loading, error, settings } = this.props.data
        if ( !settings )
            return null
        const { diskSpaceAvailable, maxDiskSpace } = settings
        return (
            <div className="StorageInputs">
                {diskSpaceAvailable}<br/>
                {maxDiskSpace}
            </div>
        );
    }
}
