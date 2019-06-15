import Button from "@material-ui/core/Button";
import { default as MaterialTextField } from "@material-ui/core/TextField";
import React, { Component } from "react";
import withSettingsMutation, {
    WithSettingsMutationPropTypes
} from "../containers/withSettingsMutation";
import PropTypes from "prop-types";
import { isElectron } from "../../../utils/electron";
import { AO_CONSTANTS } from "ao-library";
import { compose } from "react-apollo";
import withContractSettings from "../containers/withContractSettings";
import { getNetworkName } from "../../../store/app.reducer";
import { Typography } from "@material-ui/core";

class EthNetworkRpcInput extends Component {
    static propTypes = {
        ...WithSettingsMutationPropTypes,
        inputName: PropTypes.string.isRequired,
        inputLabel: PropTypes.string,
        contractSettings: PropTypes.shape({
            recommendedEthNetworkRpcs: PropTypes.object
        }).isRequired
    };
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
                if (isElectron() && inputName === "ethNetworkRpc") {
                    // Since rpc has changed we automatically restart core
                    window.chrome.ipcRenderer.send(
                        AO_CONSTANTS.IPC.RESTART_AO_CORE
                    );
                }
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
        const { data, contractSettings } = this.props;
        const { settings } = data;
        if (!settings) return null;
        return (
            <form
                className="EthNetworkRpcInput"
                style={{
                    marginBottom: 12
                }}
            >
                <div
                    style={{
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
                            >
                                {this.props.inputName === "ethNetworkRpc"
                                    ? `restart`
                                    : `save`}
                            </Button>
                        </div>
                    )}
                </div>
                <Typography
                    component="ul"
                    style={{ listStyle: "none", padding: 0, marginTop: 12 }}
                >
                    {Object.keys(
                        contractSettings.recommendedEthNetworkRpcs
                    ).map(networkId => {
                        const rpc =
                            contractSettings.recommendedEthNetworkRpcs[
                                networkId
                            ];
                        if (!rpc) return null;
                        return (
                            <li key={networkId}>
                                {`${rpc}: `}
                                <span style={{ opacity: 0.6 }}>
                                    {getNetworkName(networkId)}
                                </span>
                            </li>
                        );
                    })}
                </Typography>
            </form>
        );
    }
}
export default compose(
    withSettingsMutation,
    withContractSettings
)(EthNetworkRpcInput);
