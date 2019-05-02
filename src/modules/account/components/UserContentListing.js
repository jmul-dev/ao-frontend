import { Divider } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import { compose } from "react-apollo";
import { Link } from "react-router-dom";
import { PrimaryButton } from "../../../theme";
import ExchangeModal from "../../exchange/components/ExchangeModal";
import withUserContent from "../containers/withUserContent";
import withUserIdentifiers from "../containers/withUserIdentifiers";
import "../styles/account-video-listing.css";
import UserContentListItem from "./UserContentListItem";

class UserContentListing extends Component {
    static propTypes = {
        contentType: PropTypes.string,
        ethAddress: PropTypes.string,
        filter: PropTypes.oneOf(["downloaded", "uploaded"]),
        ordering: PropTypes.string
    };
    constructor() {
        super();
        this.state = {
            exchangeModalOpen: false
        };
    }
    componentDidMount() {
        if (this.props.query.refetch) this.props.query.refetch();
    }
    componentWillUpdate = (nextProps, nextState) => {
        if (this.props.contentType !== nextProps.contentType) {
            this.props.query.refetch();
        }
    };
    render() {
        const { ethAddress, filter, contentType } = this.props;
        if (!ethAddress) return this._renderPlaceholderContentListing();
        const { error, node } = this.props.query;
        if (!node) return null; // TODO: loading
        if (error && !node) return this._renderErrorState();
        const contentList =
            filter === "uploaded" ? node.stakedContent : node.hostedContent;
        if (!contentList || contentList.length === 0)
            return this._renderNoUserContent();

        return (
            <div className="UserContentListing">
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {contentList.map((content, index) =>
                        content ? (
                            <li key={content.id}>
                                <Divider />
                                <UserContentListItem
                                    content={content}
                                    filter={filter}
                                    listingContentType={contentType}
                                    currentUserEthAddress={ethAddress}
                                />
                            </li>
                        ) : null
                    )}
                </ul>
            </div>
        );
    }
    _renderErrorState() {
        const errorMessage = `An error occured while trying to fetch your content :/`;
        return (
            <Fragment>
                <Divider />
                <div className="UserContentListing placeholder">
                    <Typography variant="title" className="placeholder-title">
                        {errorMessage}
                    </Typography>
                </div>
            </Fragment>
        );
    }
    _renderNoUserContent() {
        const { filter } = this.props;
        let errorMessage = `Looks like you haven't ${filter} any content.`;
        return (
            <Fragment>
                <Divider />
                <div className="UserContentListing placeholder">
                    <Typography variant="title" className="placeholder-title">
                        {errorMessage}
                    </Typography>
                    <div className="placeholder-actions">
                        {filter === "uploaded" ? (
                            <PrimaryButton
                                component={Link}
                                to={`/app/view/upload`}
                            >{`Upload a video`}</PrimaryButton>
                        ) : (
                            <PrimaryButton
                                component={Link}
                                to={`/app`}
                            >{`Browse videos`}</PrimaryButton>
                        )}
                        <PrimaryButton
                            color="default"
                            onClick={() => {
                                this.setState({ exchangeModalOpen: true });
                            }}
                        >{`Exchange tokens`}</PrimaryButton>
                    </div>
                </div>
                <ExchangeModal
                    open={this.state.exchangeModalOpen}
                    onClose={() => {
                        this.setState({ exchangeModalOpen: false });
                    }}
                    exchangeType="primordialIfActive"
                />
            </Fragment>
        );
    }
    _renderPlaceholderContentListing() {
        const { filter } = this.props;
        return (
            <Fragment>
                <Divider />
                <div className="UserContentListing placeholder">
                    <Typography
                        variant="title"
                        className="placeholder-title"
                    >{`Unlock your account to view your ${filter} content.`}</Typography>
                </div>
            </Fragment>
        );
    }
}

export default compose(
    withUserContent,
    withUserIdentifiers
)(UserContentListing);
