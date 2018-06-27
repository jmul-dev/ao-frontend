// @flow
import React, { Component } from 'react';


type Props = {
    settings: {
        loading: boolean,
        error?: string,
    }
};

export default class Settings extends Component<Props> {
    props: Props;
    render() {
        const { loading, error, state, version } = this.props.settings
        return (
            <div className="Settings">
                <h2>Settings</h2>
                {version}
            </div>
        );
    }
}
