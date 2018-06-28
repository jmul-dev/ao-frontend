// @flow
import React, { Component } from 'react';
import withSettingsMutation, { SettingsMutationProps } from '../containers/withSettingsMutation';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';


class MaxPeerConnectionsInput extends Component<SettingsMutationProps> {
    props: SettingsMutationProps;
    _handleInputChange = (event) => {
        const { updateSettings } = this.props
        let updatedValue = event.target.value
        if ( updatedValue === 'Infinity' )
            updatedValue = -1
        updateSettings({
            variables: {
                inputs: {
                    maxPeerConnections: updatedValue
                }
            }
        })
    }
    render() {
        const { loading, error, settings } = this.props.data
        if ( !settings )
            return null
        let { maxPeerConnections } = settings
        if ( maxPeerConnections < 0 )
            maxPeerConnections = Infinity
        let options = [16, 32, 64, 128, 256, Infinity]
        if ( options.indexOf(maxPeerConnections) === -1 ) {
            options.push(maxPeerConnections)
            options.sort((a, b) => a - b)
        }
        return (
            <form className="MaxPeerConnectionsInput">
                <FormControl>
                    <InputLabel htmlFor="max-peer-connections">Max peer connections</InputLabel>
                    <Select
                        native
                        value={maxPeerConnections}
                        onChange={this._handleInputChange}
                        inputProps={{
                            name: 'max-peer-connections',
                            id: 'max-peer-connections',
                        }}
                    >
                        {options.map(option => {
                            let label = ``
                            if ( option === Infinity ) {
                                label = 'No limit'
                            } else {
                                label = `${option} Peers`
                            }
                            return (
                                <option key={option} value={option}>{label}</option>
                            )
                        })}
                    </Select>
                </FormControl>
            </form>
        );
    }
}
export default withSettingsMutation(MaxPeerConnectionsInput)