import React, { Component } from "react";
import withStatsContainer from "../containers/withStatsContainer";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";

class Stats extends Component {
    render() {
        const { statistics, error } = this.props.query;
        if (error || !statistics) return null;
        return (
            <Fade in={true}>
                <div className="Stats" style={{ display: "flex" }}>
                    {statistics.totalContentHosts && (
                        <Typography
                            variant="caption"
                            component="div"
                            style={{ marginLeft: 24 }}
                        >
                            {`Total content hosts: ${
                                statistics.totalContentHosts
                            }`}
                        </Typography>
                    )}
                    <Typography
                        variant="caption"
                        component="div"
                        style={{ marginLeft: 24 }}
                    >
                        {`Content hosts online: ${
                            statistics.p2pRecentlySeenHostsCount
                        }`}
                    </Typography>
                    <Typography
                        variant="caption"
                        component="div"
                        style={{ marginLeft: 24 }}
                    >
                        {`Peers connected: ${statistics.p2pPeersConnected}`}
                    </Typography>
                    <Typography
                        variant="caption"
                        component="div"
                        style={{ marginLeft: 24 }}
                    >
                        {`ao-core v${statistics.coreVersion}`}
                    </Typography>
                </div>
            </Fade>
        );
    }
}
export default withStatsContainer(Stats);
