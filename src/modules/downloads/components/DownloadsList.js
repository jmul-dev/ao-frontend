import React, { Component } from "react";
import withHostedContent from "../containers/withHostedContent";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import DownloadsListItem from "./DownloadsListItem";
import Divider from "@material-ui/core/Divider";
import { Typography } from "@material-ui/core";
import { compose } from "react-apollo";
import withUserIdentifiers from "../../account/containers/withUserIdentifiers";

class DownloadsList extends Component {
    static propTypes = {
        // redux bound state
        recentlyHostedContentIds: PropTypes.arrayOf(PropTypes.string)
            .isRequired,
        // graphql
        hostedContentQuery: PropTypes.shape({
            node: PropTypes.shape({
                hostedContent: PropTypes.arrayOf(PropTypes.object)
            })
        })
    };
    componentDidMount() {
        this.props.hostedContentQuery.startPolling(1500);
    }
    componentWillUnmount() {
        this.props.hostedContentQuery.stopPolling();
    }
    render() {
        const { loading, node } = this.props.hostedContentQuery;
        if (loading && !node) return null;
        if (!node || (node && !node.hostedContent)) return null; // no incomplete hosted content
        const { recentlyHostedContentIds } = this.props;
        const incompleteContent = node.hostedContent.filter(content => {
            // completed recently (still show in enqueued videos)
            if (
                content.state === "DISCOVERABLE" &&
                recentlyHostedContentIds.indexOf(content.id) === -1
            )
                return false;
            return true;
        });
        return incompleteContent.length > 0 ? (
            <div className="DownloadsList">
                <Typography variant="caption" style={{ padding: 16 }}>
                    {"Active Downloads"}
                </Typography>
                <Divider />
                <List dense={true} style={{ paddingTop: 0, paddingRight: 24 }}>
                    {incompleteContent.map((content, index) => (
                        <DownloadsListItem
                            key={content.id}
                            content={content}
                            currentUserEthAddress={this.props.ethAddress}
                            hideBorder={index === 0}
                        />
                    ))}
                </List>
            </div>
        ) : null;
    }
}

export default compose(
    withHostedContent,
    withUserIdentifiers
)(DownloadsList);
