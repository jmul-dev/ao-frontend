import React from "react";
import withNetworkTaoContent from "./withNetworkTaoContent";
import Grid from "@material-ui/core/Grid";
import ContentCard from "../../modules/content/components/ContentCard";

const NetworkTaoContentListing = ({
    networkTaoContentQuery: { networkContent, loading, error }
}) => {
    if (loading) return null;
    if (error && !networkContent) return `Error loading network content...`;
    return (
        <Grid container spacing={24}>
            {networkContent.map(content => {
                return (
                    <Grid key={content.id} item sm={6} md={4}>
                        <ContentCard variant="default" contentId={content.id} />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default withNetworkTaoContent(NetworkTaoContentListing);
