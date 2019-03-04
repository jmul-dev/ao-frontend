import React, { PureComponent } from "react";
import View from "../View";
import { compose } from "react-apollo";
import withEthAddress from "../../modules/account/containers/withEthAddress";
import { userContentQuery } from "../../modules/video/containers/withUserContent";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { ContentFieldsWithFragments } from "../../graphql/fragments/ContentFields";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import CloseIcon from "@material-ui/icons/Close";

class DappView extends PureComponent {
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
        if (this.state.isElectron && this.props.ethAddress) {
            window.chrome.ipcRenderer.send(
                "OPEN_DAPP_WINDOW",
                this.props.contractSettings.ingressUrl
            );
        }
    }
    componentWillUnmount() {
        if (this.state.isElectron && this.state.dappRendered) {
            window.chrome.ipcRenderer.send("CLOSE_DAPP_WINDOW");
        }
    }
    componentDidUpdate(prevProps) {
        if (this.state.isElectron && !this.state.dappRendered) {
            if (this.props.userContentQuery.userContent) {
                const dappUrl = this.props.userContentQuery.userContent.fileUrl;
                window.chrome.ipcRenderer.send("OPEN_DAPP_WINDOW", dappUrl);
                this.setState({
                    dappRendered: true
                });
            }
        }
    }
    _onClose = () => {
        this.props.history.goBack();
    };
    render() {
        const { classes } = this.props;
        const { contentId } = this.props.match.params;
        const { loading, error, userContent } = this.props.userContentQuery;
        const { isElectron, dappRendered } = this.state;
        return (
            <View className={"DappView"} padding="none">
                <section style={{ height: "100%", width: "100%" }}>
                    <div className={classes.statusBar}>
                        <ButtonBase
                            title={`Close Dapp`}
                            className={classes.closeButton}
                            onClick={this._onClose}
                        >
                            <CloseIcon />
                        </ButtonBase>
                        Dapp status bar (verified, name, close, etc..)
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
    withEthAddress,
    withDappContentQuery
)(DappView);
