/**
 * BootLayout is rendered when:
 *   ao-core is not connected && ready
 * This is a chance to render what is happening in the background
 * and possibly notify user that we cannot connect to ao-core.
 */
import React, { Component } from "react";
import IpcLogs from "../../modules/electron/components/IpcLogs";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { LogoIcon } from "../../assets/Icons";
import {
    addNotification,
    dismissNotification
} from "../../modules/notifications/reducers/notifications.reducer";
import { OnlyRenderUnderElectronContext } from "../../utils/electron";
import EthereumRpcInputPrompt from "../../modules/electron/components/EthereumRpcInputPromt";

class BootLayout extends Component {
    componentDidMount() {
        // NOTE: if this app is running outside of electron the only method of communication
        // with core is through core's http interface. If we do not see that in a timely fashion
        // we warn the user
        if (!this.props.isElectron) {
            this._connectionTimeout = setTimeout(() => {
                this._networkErrorNotId = this.props.addNotification({
                    message: `Unable to connect to ao-core, make sure it is running at: ${
                        process.env.REACT_APP_AO_CORE_URL
                    }`,
                    variant: "warning"
                });
            }, 8000);
        }
    }
    componentWillUnmount() {
        clearTimeout(this._connectionTimeout);
        if (this._networkErrorNotId) {
            this.props.dismissNotification(this._networkErrorNotId);
        }
    }
    render() {
        return (
            <div className="BootLayout">
                <div className="loading-container" style={{ padding: 16 }}>
                    <Typography
                        variant="body1"
                        style={{
                            color: "#03B742",
                            position: "relative",
                            zIndex: 1
                        }}
                    >
                        {"starting up..."}
                    </Typography>
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "#000000",
                            zIndex: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <LogoIcon width={96} height={96} />
                    </div>
                </div>
                <OnlyRenderUnderElectronContext>
                    <IpcLogs />
                </OnlyRenderUnderElectronContext>
                <OnlyRenderUnderElectronContext>
                    <EthereumRpcInputPrompt />
                </OnlyRenderUnderElectronContext>
            </div>
        );
    }
}

const mapDispatchToProps = {
    addNotification,
    dismissNotification
};

const mapStateToProps = state => ({
    states: state.app.states,
    isElectron: state.electron.isElectron
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BootLayout);
