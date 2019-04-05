import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import {
    ContentPurchaseAction,
    ContentPurchaseState
} from "../../modules/video/components/ContentPurchaseActions";
import withUserIdentifiers from "../../modules/account/containers/withUserIdentifiers";
import { compose } from "react-apollo";
import { PrimaryButton } from "../../theme";

class DappListItem extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired
    };
    render() {
        const { classes, content, ethAddress } = this.props;
        return (
            <div className={classes.root}>
                <ContentPurchaseAction content={content}>
                    {({ action, actionCopy, loading }) => (
                        <div
                            className={classes.previewImage}
                            style={{
                                backgroundImage: `url(${
                                    process.env.REACT_APP_AO_CORE_URL
                                }/${content.featuredImageUrl})`
                            }}
                        >
                            <PrimaryButton
                                onClick={action}
                                disabled={!action || loading}
                                className={classes.actionButton}
                            >
                                <ContentPurchaseState
                                    content={content}
                                    currentUserEthAddress={ethAddress}
                                />
                            </PrimaryButton>
                        </div>
                    )}
                </ContentPurchaseAction>
                <Typography variant="subheading">{content.title}</Typography>
            </div>
        );
    }
}

const styles = ({ spacing }) => ({
    root: {},
    previewImage: {
        position: "relative",
        width: "100%",
        paddingBottom: "56.2%",
        background: "#151515",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        "& > div": {
            position: "absolute",
            bottom: 0,
            right: 0,
            padding: spacing.unit,
            background: "rgba(0,0,0,0.5)",
            color: "white"
        }
    },
    actionButton: {
        display: "block",
        position: "absolute",
        bottom: 0,
        right: 0
    }
});

export default compose(
    withStyles(styles),
    withUserIdentifiers
)(DappListItem);
