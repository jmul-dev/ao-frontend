import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import UserContentView from "../../modules/account/components/UserContentView";
import withUserContent from "../../modules/video/containers/withUserContent";
import View from "../View";

const styles = ({ palette }) => ({
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

class AccountContentView extends PureComponent {
    static propTypes = {
        // react-router
        match: PropTypes.shape({
            params: PropTypes.shape({
                contentType: PropTypes.string.isRequired,
                contentId: PropTypes.string.isRequired
            })
        }),
        // withStyles
        classes: PropTypes.object.isRequired
    };
    render() {
        const { match, classes } = this.props;
        return (
            <View className={classes.root} padding="full">
                <AccountContentViewWithQueryWrapped
                    contentId={match.params.contentId}
                />
            </View>
        );
    }
}

class AccountContentViewWithQuery extends PureComponent {
    static propTypes = {
        // withUserContent
        userContentQuery: PropTypes.shape({
            userContent: PropTypes.object,
            loading: PropTypes.boolean,
            error: PropTypes.any
        })
    };
    render() {
        const { userContentQuery } = this.props;
        if (userContentQuery.error) {
            return (
                <Typography>{`An error occured while fetching your content: ${
                    userContentQuery.error.message
                }`}</Typography>
            );
        }
        if (!userContentQuery.userContent) {
            return <Typography>{`Fetching...`}</Typography>;
        }
        return <UserContentView content={userContentQuery.userContent} />;
    }
}

const AccountContentViewWithQueryWrapped = withUserContent(
    AccountContentViewWithQuery
);

export default withStyles(styles)(AccountContentView);
