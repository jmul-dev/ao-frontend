import React from "react";
import withNetworkTaoContent from "./withNetworkTaoContent";
import Grid from "@material-ui/core/Grid";
import ContentCard from "../../modules/content/components/ContentCard";
import TaoContentNamePositionWrapper from "../../modules/content/components/TaoContentNamePositionWrapper";

const NetworkTaoContentListing = ({
    networkTaoContentQuery: { networkContent, loading, error }
}) => {
    if (loading) return null;
    if (error && !networkContent) return `Error loading network content...`;
    return (
        <Grid container spacing={24}>
            {networkContent.map(content => {
                return (
                    <TaoContentNamePositionWrapper
                        content={content}
                        key={content.id}
                    >
                        {({
                            userIsInPosition,
                            nameTaoPosition,
                            contentVerified
                        }) => {
                            // Avoid user seeing unverified tao content that they or not in position to see
                            if (!userIsInPosition && !contentVerified)
                                return null;
                            return (
                                <Grid item sm={6} md={4}>
                                    <ContentCard
                                        variant="default"
                                        contentId={content.id}
                                        nameTaoPosition={nameTaoPosition}
                                    />
                                </Grid>
                            );
                        }}
                    </TaoContentNamePositionWrapper>
                );
            })}
        </Grid>
    );
};

export default withNetworkTaoContent(NetworkTaoContentListing);
