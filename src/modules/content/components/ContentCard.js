import React from "react";
import {
    ContentPurchaseAction,
    ContentPurchaseState,
    getContentState
} from "../../video/components/ContentPurchaseActions";
import { Grid, Typography, ButtonBase } from "@material-ui/core";
import { compose } from "react-apollo";
import withEthAddress from "../../account/containers/withEthAddress";
import { withStyles } from "@material-ui/core/styles";
import { PrimaryButton } from "../../../theme";
import withContentById from "../containers/withContentById";

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
 * @param {string} ethAddress The current users eth address
 * @param {object} query The graphql query for fetching userContent and networkContent
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
    const contentForActions = userContent || networkContent[0];
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
    withEthAddress,
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
        fontWeight: "bold"
    }
});

const ContentCardFeatured = compose(withStyles(featuredStyles))(
    ({ content, ethAddress, classes }) => (
        <ContentPurchaseAction
            currentUserEthAddress={ethAddress}
            content={content}
        >
            {({ action, actionCopy, loading }) => (
                <div>
                    <Grid container spacing={16} alignItems="center">
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
                            <Typography variant="body1" gutterBottom>
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

const defaultStyles = ({}) => ({});

const ContentCardDefault = compose(withStyles(defaultStyles))(
    ({ content, ethAddress, classes }) => (
        <ContentPurchaseAction
            currentUserEthAddress={ethAddress}
            content={content}
        >
            {({ action, actionCopy, loading }) => <div>{`TODO`}</div>}
        </ContentPurchaseAction>
    )
);
ContentCardDefault.displayName = "ContentCardDefault";
