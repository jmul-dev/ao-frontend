import React, { PureComponent } from "react";
import View from "../View";
import { compose } from "react-apollo";
import withEthAddress from "../../modules/account/containers/withEthAddress";
import { userContentQuery } from "../../modules/video/containers/withUserContent";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { ContentFieldsWithFragments } from "../../graphql/fragments/ContentFields";
import gql from "graphql-tag";

class DappView extends PureComponent {
    static propTypes = {
        // react-router
        match: PropTypes.shape({
            params: PropTypes.shape({
                contentId: PropTypes.string.isRequired
            })
        }),
        // withDappContentQuery
        data: PropTypes.shape({
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
            if (this.props.data.userContent) {
                const dappUrl = this.props.data.userContent.fileUrl;
                window.chrome.ipcRenderer.send("OPEN_DAPP_WINDOW", dappUrl);
                this.setState({
                    dappRendered: true
                });
            }
        }
    }
    render() {
        const { contentId } = this.props.match.params;
        const { loading, error, userContent } = this.props.data;
        const { isElectron, dappRendered } = this.state;
        return (
            <View className={"DappView"} padding="none">
                <section style={{ height: "100%", width: "100%" }}>
                    <div className="dapp-status-bar">
                        Dapp status bar (verified, name, close, etc..)
                    </div>
                    <div className="dapp-window-container">
                        {!isElectron && userContent && (
                            <iframe
                                src={userContent.fileUrl}
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
    withEthAddress,
    withDappContentQuery
)(DappView);
