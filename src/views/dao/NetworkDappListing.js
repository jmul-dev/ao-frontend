import React from "react";
import withNetworkDapps from "./withNetworkDapps";

const NetworkDappListing = ({
    networkDappsQuery: { networkContent, loading, error }
}) => {
    if (loading) return null;
    if (error && !networkContent) return `Error loading network dapps...`;
    return (
        <ul>
            {networkContent.map(content => {
                return <li>{content.title}</li>;
            })}
        </ul>
    );
};

export default withNetworkDapps(NetworkDappListing);
