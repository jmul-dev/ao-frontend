import React from "react";
import {
    ContentPurchaseAction,
    ContentPurchaseState,
    getContentState
} from "../../video/components/ContentPurchaseActions";
import { Grid, Typography, ButtonBase } from "@material-ui/core";
import { compose } from "react-apollo";
import withUserIdentifiers from "../../account/containers/withUserIdentifiers";
import { withStyles } from "@material-ui/core/styles";
import { PrimaryButton } from "../../../theme";
import withContentById from "../containers/withContentById";
import OfflineIcon from "@material-ui/icons/CloudOff";
import Tooltip from "@material-ui/core/Tooltip";
import TaoContentVerificationState from "./TaoContentVerificationState";

/**
 * ContentCard
 *
 * This component may need some additional work before
 * it is flexible enough to use across the UI.
 *
 * The main thing to note is the difference between
 * user content and network content. If the content exists
 * in the userContent query, that implies the user has begun
 * the injestion process (download, purchase, stake, etc..).
 * Otherwise, the content only exists in the networkContent
 * query which means that it has only been discovered. This
 * distinction is neccesary in order to render the correct
 * set of actions for this given piece of content.
 *
 * @param {string} contentId
 * @param {string} variant default | featured
 *
 * @param {string} ethAddress The current users eth address (withUserIdentifiers)
 * @param {object} query The graphql query for fetching userContent and networkContent (withContentById)
 */
const ContentCard = ({
    contentId,
    variant = "default",
    ethAddress,
    query: { loading, error, userContent, networkContent }
}) => {
    if (loading && !networkContent) return null;
    if (error && !networkContent) return null;
    // Use userContent first, otherwise fall back to networkContent
    let contentForActions = userContent || networkContent[0];
    switch (variant) {
        case "featured":
            return (
                <ContentCardFeatured
                    content={contentForActions}
                    ethAddress={ethAddress}
                />
            );
        case "default":
        default:
            return (
                <ContentCardDefault
                    content={contentForActions}
                    ethAddress={ethAddress}
                />
            );
    }
};

export default compose(
    withUserIdentifiers,
    withContentById
)(ContentCard);

/**
 * ContentCardFeatured
 *
 * The featured variant of the ContentCard. This is a full width
 * side-by-side rendering of the content's featured image on left
 * side and title/description/action on the right side.
 */
const featuredStyles = ({}) => ({
    featuredImage: {
        width: "100%",
        height: "auto",
        display: "block"
    },
    title: {
        fontWeight: "bold",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    description: {
        maxHeight: 96,
        overflow: "auto"
    }
});

const ContentCardFeatured = compose(withStyles(featuredStyles))(
    ({ content, ethAddress, classes }) => (
        <ContentPurchaseAction content={content}>
            {({ action, actionCopy, loading }) => (
                <div>
                    <Grid container spacing={24} alignItems="center">
                        <Grid item xs={6}>
                            <img
                                className={classes.featuredImage}
                                src={`${process.env.REACT_APP_AO_CORE_URL}/${
                                    content.featuredImageUrl
                                }`}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography
                                variant="display1"
                                className={classes.title}
                                gutterBottom
                            >
                                {content.title}
                            </Typography>
                            <Typography
                                variant="body1"
                                style={{ marginBottom: 24 }}
                            >
                                {content.description}
                            </Typography>
                            <PrimaryButton
                                disabled={!action || loading}
                                onClick={action}
                            >
                                <ContentPurchaseState
                                    content={content}
                                    currentUserEthAddress={ethAddress}
                                />
                            </PrimaryButton>
                        </Grid>
                    </Grid>
                </div>
            )}
        </ContentPurchaseAction>
    )
);
ContentCardFeatured.displayName = "ContentCardFeatured";

const defaultStyles = ({}) => ({
    root: {
        marginBottom: 48
    },
    featuredImage: {
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        paddingBottom: "56.25%",
        marginBottom: 8,
        position: "relative"
    },
    offlineOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.75)",
        padding: 16
    },
    offlineText: {
        display: "flex",
        alignItems: "center"
    },
    contentDescription: {
        maxHeight: 120,
        overflow: "auto"
    },
    actionButton: {
        marginTop: 8
    }
});

const ContentCardDefault = compose(withStyles(defaultStyles))(
    ({ content, ethAddress, classes }) => {
        let isOffline = content.recentlySeenHostsCount < 1;
        if (content.nodeEthAddress === ethAddress) {
            isOffline = false;
        }
        return (
            <ContentPurchaseAction content={content}>
                {({ action, actionCopy, loading }) => (
                    <div className={classes.root}>
                        <div
                            className={classes.featuredImage}
                            style={{
                                backgroundImage: `url(${
                                    process.env.REACT_APP_AO_CORE_URL
                                }/${content.featuredImageUrl})`
                            }}
                        >
                            {isOffline && (
                                <div className={classes.offlineOverlay}>
                                    <Typography
                                        variant="caption"
                                        className={classes.offlineText}
                                    >
                                        <OfflineIcon
                                            style={{ marginRight: 8 }}
                                        />
                                        {`currently offline`}
                                    </Typography>
                                </div>
                            )}
                        </div>
                        <Typography variant="subheading" gutterBottom>
                            {content.title}
                        </Typography>
                        {content.contentLicense === "TAO" && (
                            <div style={{ marginBottom: 8 }}>
                                <TaoContentVerificationState
                                    contentId={content.id}
                                />
                            </div>
                        )}
                        <Typography
                            variant="body1"
                            gutterBottom
                            className={classes.contentDescription}
                        >
                            {content.description}
                        </Typography>
                        <PrimaryButton
                            size="small"
                            disabled={!action || loading}
                            onClick={action}
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
        );
    }
);
ContentCardDefault.displayName = "ContentCardDefault";
