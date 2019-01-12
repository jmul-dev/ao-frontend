// @flow
import React, { Component } from "react";
import withSettingsMutation, {
    SettingsMutationProps
} from "../containers/withSettingsMutation";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { default as MaterialTextField } from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

type Props =
    | SettingsMutationProps
    | {
          inputName: "ethNetworkRpc",
          inputLabel: string
      };

class TextInput extends Component<Props> {
    props: Props;
    constructor(props) {
        super(props);
        this.state = {
            value: props.data.settings
                ? props.data.settings[props.inputName]
                : "",
            isDirty: false,
            disabled: false,
            errorMessage: null
        };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.data.settings && this.props.data.settings) {
            console.log("Setting initial input value");
            this.setState({
                value: this.props.data.settings[this.props.inputName]
            });
        }
    }
    _onChange = event => {
        this.setState({
            value: event.target.value,
            isDirty: true
        });
    };
    _saveInputChanges = () => {
        const { updateSettings, inputName } = this.props;
        this.setState({ disabled: true, errorMessage: null });
        updateSettings({
            variables: {
                inputs: {
                    [inputName]: this.state.value
                }
            }
        })
            .then(() => {
                this.setState({
                    disabled: false,
                    isDirty: false
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    disabled: false,
                    errorMessage: "Error updating your settings"
                });
            });
    };
    _discardInputChanges = () => {
        this.setState({
            isDirty: false,
            value: this.props.data.settings[this.props.inputName] || ""
        });
    };
    render() {
        const {
            inputName,
            inputLabel,
            data,
            updateSettings,
            updateSettingsError,
            updateSettingsLoading,
            updateSettingsResult,
            ...props
        } = this.props;
        const { settings } = data;
        if (!settings) return null;
        return (
            <form
                className="TextInput"
                style={{
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "flex-end"
                }}
            >
                <MaterialTextField
                    onChange={this._onChange}
                    value={this.state.value}
                    label={this.props.label}
                    disabled={this.state.disabled}
                    fullWidth
                    margin="normal"
                    style={{ marginBottom: 0 }}
                    helperText={this.state.errorMessage}
                />
                {this.state.isDirty && (
                    <div>
                        <Button
                            color="default"
                            size="small"
                            onClick={this._discardInputChanges}
                            disabled={this.state.disabled}
                        >{`cancel`}</Button>
                    </div>
                )}
                {this.state.isDirty && (
                    <div>
                        <Button
                            color="primary"
                            size="small"
                            onClick={this._saveInputChanges}
                            disabled={this.state.disabled}
                        >{`save`}</Button>
                    </div>
                )}
            </form>
        );
    }
}
export default withSettingsMutation(TextInput);
