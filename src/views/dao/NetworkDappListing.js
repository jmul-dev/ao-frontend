import React from "react";
import withNetworkDapps from "./withNetworkDapps";
import Grid from "@material-ui/core/Grid";
import ContentCard from "../../modules/content/components/ContentCard";

const NetworkDappListing = ({
    networkDappsQuery: { networkContent, loading, error }
}) => {
    if (loading) return null;
    if (error && !networkContent) return `Error loading network dapps...`;
    return (
        <Grid container spacing={24}>
            {networkContent.map(content => {
                return (
                    <Grid item sm={6} md={4}>
                        <ContentCard variant="default" contentId={content.id} />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default withNetworkDapps(NetworkDappListing);
