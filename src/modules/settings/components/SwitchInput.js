// @flow
import React, { Component } from 'react';
import withSettingsMutation, { SettingsMutationProps } from '../containers/withSettingsMutation';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


type Props = SettingsMutationProps | {
    inputName: 'runOnStartup' | 'checkForUpdates' | 'runInBackground',
    inputLabel: string,
}

class SwitchInput extends Component<Props> {
    props: Props;
    _handleInputChange = (event) => {
        const { updateSettings, inputName } = this.props
        updateSettings({
            variables: {
                inputs: {
                    [inputName]: event.target.checked
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
        return (
            <form className="SwitchInput">
                <FormControl>
                    <FormControlLabel
                        label={inputLabel}
                        control={
                            <Switch
                                color="primary"
                                checked={inputValue}
                                onChange={this._handleInputChange}
                                {...props}
                            />
                        }
                    />
                </FormControl>
            </form>
        );
    }
}
export default withSettingsMutation(SwitchInput)