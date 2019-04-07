import React from "react";
import withContractSettings from "../../settings/containers/withContractSettings";
import { Typography } from "@material-ui/core";

const WhitepaperUrl = ({ contractSettings, dispatch, ...props }) => {
    if (!contractSettings.aoUrl) {
        return null;
    }
    return (
        <Typography
            variant="body1"
            component="a"
            href={contractSettings.aoUrl}
            target="_blank"
            className="whitepaper-link"
            {...props}
        >
            {`whitepaper`}
        </Typography>
    );
};

export default withContractSettings(WhitepaperUrl);
