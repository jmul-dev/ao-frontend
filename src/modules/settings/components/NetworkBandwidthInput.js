// @flow
import React, { Component } from 'react';
import withSettingsMutation, { SettingsMutationProps } from '../containers/withSettingsMutation';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';


type Props = SettingsMutationProps | {
    inputName: 'maxBandwidthUp' | 'maxBandwidthDown',
    inputLabel: string,
}

class NetworkBandwidthInput extends Component<Props> {
    props: Props;
    _handleInputChange = (event) => {
        const { updateSettings, inputName } = this.props
        let updatedValue = event.target.value
        if ( updatedValue === 'Infinity' )
            updatedValue = -1
        updateSettings({
            variables: {
                inputs: {
                    [inputName]: updatedValue
                }
            }
        })
    }
    render() {
        const { inputName, inputLabel, data, updateSettings, updateSettingsError, updateSettingsLoading, updateSettingsResult, ...props } = this.props
        const { settings } = data
        if ( !settings )
            return null
        let inputValue = settings[inputName]
        if ( inputValue < 0 )
            inputValue = Infinity
        let options = [512, 1000, 2500, 5000, 10000, Infinity]
        if ( options.indexOf(inputValue) === -1 ) {
            options.push(inputValue)
            options.sort((a, b) => a - b)
        }
        return (
            <form className="NetworkBandwidthInput">
                <FormControl fullWidth>
                    <InputLabel htmlFor={inputName}>{inputLabel}</InputLabel>
                    <Select
                        native
                        value={inputValue}
                        onChange={this._handleInputChange}
                        inputProps={{
                            name: inputName,
                            id: inputName,
                        }}
                        disableUnderline
                        {...props}
                    >
                        {options.map(option => {
                            let label = ``
                            if ( option === Infinity ) {
                                label = 'No limit'
                            } else if ( option >= 1000 ) {
                                label = `${option / 100.0} Mbps`
                            } else {
                                label = `${option} Kbps`
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
export default withSettingsMutation(NetworkBandwidthInput)