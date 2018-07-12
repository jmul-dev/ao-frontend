// @flow
import React, { Component } from 'react';
import withSettingsMutation, { SettingsMutationProps } from '../containers/withSettingsMutation';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';


class MaxStorageInput extends Component<SettingsMutationProps> {
    props: SettingsMutationProps;
    _handleMaxDiskSpaceChange = (event) => {
        const { updateSettings } = this.props
        let updatedValue = event.target.value
        if ( updatedValue === 'Infinity' )
            updatedValue = -1
        updateSettings({
            variables: {
                inputs: {
                    maxDiskSpace: updatedValue
                }
            }
        })
    }
    render() {
        const { settings } = this.props.data
        if ( !settings )
            return null
        let { maxDiskSpace } = settings
        if ( maxDiskSpace < 0 )
            maxDiskSpace = Infinity
        let options = [512, 1000, 5000, 10000, 50000, Infinity]
        if ( options.indexOf(maxDiskSpace) === -1 ) {
            options.push(maxDiskSpace)
            options.sort((a, b) => a - b)
        }
        return (
            <form className="MaxStorageInput">
                <FormControl fullWidth>
                    <InputLabel htmlFor="max-disk-space">Max disk space</InputLabel>
                    <Select
                        native
                        value={maxDiskSpace}
                        onChange={this._handleMaxDiskSpaceChange}
                        inputProps={{
                            name: 'max-disk-space',
                            id: 'max-disk-space',
                        }}
                        disableUnderline
                    >
                        {options.map(option => {
                            let label = ``
                            if ( option === Infinity ) {
                                label = 'No limit'
                            } else if ( option >= 1000 ) {
                                label = `${option / 1000} GB`
                            } else {
                                label = `${option} MB`
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
export default withSettingsMutation(MaxStorageInput)