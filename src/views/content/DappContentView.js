import { Typography } from "@material-ui/core";
import ButtonBase from "@material-ui/core/ButtonBase";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { AO_CONSTANTS } from "ao-library";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { compose, graphql } from "react-apollo";
import { ContentFieldsWithFragments } from "../../graphql/fragments/ContentFields";
import TaoContentVerificationState from "../../modules/content/components/TaoContentVerificationState";
import View from "../View";

class DappContentView extends PureComponent {
    static propTypes = {
        // react-router
        match: PropTypes.shape({
            params: PropTypes.shape({
                contentId: PropTypes.string.isRequired
            })
        }),
        history: PropTypes.any,
        // withDappContentQuery
        userContentQuery: PropTypes.shape({
            loading: PropTypes.bool.isRequired,
            error: PropTypes.error,
            userContent: PropTypes.any
        })
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
            window.chrome.ipcRenderer.send("CLOSE_DAPP_WINDOW");
        }
    }
    componentDidUpdate(prevProps) {
        if (this.state.isElectron && !this.state.dappRendered) {
            this._openDappWindow();
        }
    }
    _openDappWindow = () => {
        const { userContentQuery } = this.props;
        const dappUrl = userContentQuery.userContent
            ? userContentQuery.userContent.fileUrl
            : undefined;
        if (!dappUrl) return null;
        window.chrome.ipcRenderer.send("OPEN_DAPP_WINDOW", dappUrl);
        this.setState({
            dappRendered: true
        });
    };
    _onClose = () => {
        this.props.history.goBack();
    };
    render() {
        const { classes } = this.props;
        const { contentId } = this.props.match.params;
        const { loading, error, userContent } = this.props.userContentQuery;
        const { isElectron, dappRendered } = this.state;
        return userContent ? (
            <View className={"DappContentView"} padding="none">
                <section style={{ height: "100%", width: "100%" }}>
                    <div className={classes.statusBar}>
                        <ButtonBase
                            title={`Close Dapp`}
                            className={classes.closeButton}
                            onClick={this._onClose}
                        >
                            <CloseIcon />
                        </ButtonBase>
                        <Typography>{userContent.title}</Typography>
                        {userContent.contentLicense === "TAO" && (
                            <div className={classes.verificationContainer}>
                                <TaoContentVerificationState
                                    contentId={userContent.id}
                                />
                            </div>
                        )}
                    </div>
                    <div className={classes.dappWindowContainer}>
                        {!isElectron && userContent && (
                            <iframe
                                src={`${process.env.REACT_APP_AO_CORE_URL}/${
                                    userContent.fileUrl
                                }`}
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    border: 0
                                }}
                            />
                        )}
                    </div>
                </section>
            </View>
        ) : null;
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

const dappContentQuery = gql(`
    query userContent($id: ID!) {
        userContent(id: $id) {
            ${ContentFieldsWithFragments}
        }
    }
`);

const withDappContentQuery = graphql(dappContentQuery, {
    name: "userContentQuery",
    options: ({
        match: {
            params: { contentId }
        }
    }) => ({
        variables: { id: contentId },
        fetchPolicy: "cache-and-network"
    })
});

export default compose(
    withStyles(styles, { withTheme: true }),
    withDappContentQuery
)(DappContentView);
