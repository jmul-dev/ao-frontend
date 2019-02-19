import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { compose } from "react-apollo";
import withUserContent from "../../modules/video/containers/withUserContent";
import View from "../View";
import AccountVideo from "../../modules/account/components/AccountVideo";

const styles = ({ palette, spacing }) => ({
    root: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: palette.background.default
    }
});

class AccountVideoView extends PureComponent {
    static propTypes = {
        // react-router
        match: PropTypes.shape({
            params: PropTypes.shape({
                videoId: PropTypes.string.isRequired
            })
        }),
        // withStyles
        classes: PropTypes.object.isRequired
    };
    render() {
        const { match, classes } = this.props;
        return (
            <View className={classes.root} padding="full">
                <AccountVideoViewWithQueryWrapped
                    contentId={match.params.videoId}
                />
            </View>
        );
    }
}

class AccountVideoViewWithQuery extends PureComponent {
    static propTypes = {
        // withUserContent
        userContentQuery: PropTypes.shape({
            video: PropTypes.object,
            loading: PropTypes.boolean,
            error: PropTypes.any
        })
    };
    render() {
        const { match, classes, userContentQuery, metrics } = this.props;
        if (userContentQuery.error) {
            return (
                <Typography>{`An error occured while fetching your video: ${
                    userContentQuery.error.message
                }`}</Typography>
            );
        }
        if (!userContentQuery.userContent) {
            return <Typography>{`Fetching...`}</Typography>;
        }
        return <AccountVideo video={userContentQuery.userContent} />;
    }
}

const AccountVideoViewWithQueryWrapped = withUserContent(
    AccountVideoViewWithQuery
);

export default withStyles(styles)(AccountVideoView);
