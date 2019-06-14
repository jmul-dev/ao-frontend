import { Typography } from "@material-ui/core";
import ButtonBase from "@material-ui/core/ButtonBase";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { AO_CONSTANTS } from "ao-library";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import View from "../View";
import { compose } from "react-apollo";
import { connect } from "react-redux";
import { setDaoDappLaunched } from "../../store/app.reducer";

class DaoDappView extends PureComponent {
    static propTypes = {
        daoDappLaunched: PropTypes.bool,
        setDaoDappLaunched: PropTypes.func.isRequired,
        // react-router
        history: PropTypes.any
    };
    constructor() {
        super();
        this.state = {
            isElectron: !!(window.chrome && window.chrome.ipcRenderer),
            dappRendered: false
        };
    }
    componentDidMount() {
        if (this.state.isElectron) {
            this._openDappWindow();
            if (!this.props.daoDappLaunched) this.props.setDaoDappLaunched();
            window.chrome.ipcRenderer.on(
                AO_CONSTANTS.IPC.DAPP_WINDOW_CLOSED,
                this._onClose
            );
        }
    }
    componentWillUnmount() {
        if (this.state.isElectron && this.state.dappRendered) {
            window.chrome.ipcRenderer.removeListener(
                AO_CONSTANTS.IPC.DAPP_WINDOW_CLOSED,
                this._onClose
            );
            window.chrome.ipcRenderer.send(AO_CONSTANTS.IPC.CLOSE_DAPP_WINDOW, {
                dappKey: "ao-tao-frontend"
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.state.isElectron && !this.state.dappRendered) {
            this._openDappWindow();
        }
    }
    _openDappWindow = () => {
        window.chrome.ipcRenderer.send(AO_CONSTANTS.IPC.OPEN_TAO_DAPP_WINDOW);
        this.setState({
            dappRendered: true
        });
    };
    _onClose = () => {
        this.props.history.goBack();
    };
    render() {
        const { classes } = this.props;
        const { isElectron } = this.state;
        return (
            <View className={"DaoDappView"} padding="none">
                <section
                    style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: "black"
                    }}
                >
                    <div className={classes.statusBar}>
                        <ButtonBase
                            title={`Close Dapp`}
                            className={classes.closeButton}
                            onClick={this._onClose}
                        >
                            <CloseIcon />
                        </ButtonBase>
                        <Typography>{`The AO Dapp`}</Typography>
                    </div>
                    <div className={classes.dappWindowContainer}>
                        {!isElectron && (
                            <Typography>{`Dapp not served outside of electron`}</Typography>
                        )}
                    </div>
                </section>
            </View>
        );
    }
}

const styles = ({ palette }) => ({
    statusBar: {
        height: 40,
        backgroundColor: palette.secondary.main,
        color: "white",
        display: "flex",
        alignItems: "center"
    },
    closeButton: {
        height: 40,
        width: 40,
        marginRight: 8
    },
    dappWindowContainer: {
        height: `calc(100% - 40px)`,
        overflow: "auto",
        backgroundColor: "white"
    },
    verificationContainer: {
        marginLeft: "auto",
        marginRight: 16
    }
});

const mapDispatchToProps = { setDaoDappLaunched };
const mapStateToProps = state => ({
    daoDappLaunched: state.app.daoDappLaunched
});

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withStyles(styles, { withTheme: true })
)(DaoDappView);
