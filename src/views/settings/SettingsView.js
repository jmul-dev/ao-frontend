import React, { PureComponent } from "react";
import View from "../View";
import SettingsInput from "../../modules/settings";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import "./settings-view.css";
import Export from "../../modules/account/components/Export";
import withStatsContainer from "../../modules/stats/containers/withStatsContainer";
import { getNetworkName } from "../../store/app.reducer";
import DebugLog from "../../modules/settings/components/DebugLog";
import GraphiqlButton from "../../modules/settings/components/GraphiqlButton";

class SettingsView extends PureComponent {
    render() {
        const { ethNetworkName, ethNetworkId, desktopVersion } = this.props;
        const { statistics } = this.props.query;
        let networkMismatch =
            statistics && `${statistics.ethNetworkId}` !== `${ethNetworkId}`;
        return (
            <View className={"SettingsView"} padding="full">
                <header style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subheading" gutterBottom>
                        {"Settings"}
                    </Typography>
                    <div style={{ marginLeft: "auto" }}>
                        <DebugLog />
                    </div>
                    <div style={{ marginLeft: 16 }}>
                        <GraphiqlButton />
                    </div>
                    <div style={{ marginLeft: 16 }}>
                        <Export />
                    </div>
                </header>
                <section>
                    {desktopVersion && (
                        <Typography variant="caption" gutterBottom>
                            {`AO Desktop v${desktopVersion}`}
                        </Typography>
                    )}
                    {statistics && statistics.coreVersion && (
                        <Typography variant="caption" gutterBottom>
                            {`AO Core v${statistics.coreVersion}`}
                        </Typography>
                    )}
                    <Typography variant="caption" gutterBottom>
                        {`AO Frontend v${process.env.REACT_APP_VERSION}`}
                    </Typography>
                    {!networkMismatch ? (
                        <Typography variant="caption" gutterBottom>
                            {`Ethereum network: ${ethNetworkName}`}
                        </Typography>
                    ) : (
                        <Typography
                            color="error"
                            variant="caption"
                            gutterBottom
                        >
                            {`Network mismatch:`}
                            <br />
                            <div style={{ marginLeft: 8 }}>
                                {`ao-frontend running on network: ${ethNetworkName}`}
                                <br />
                                {`ao-core running on network: ${getNetworkName(
                                    statistics.ethNetworkId
                                )}`}
                                <br />
                                <span
                                    style={{
                                        color: "rgba(255, 255, 255, 0.7)"
                                    }}
                                >{`Update the Ethereum RPC below or switch networks in Metamask`}</span>
                            </div>
                        </Typography>
                    )}
                </section>
                <Grid container spacing={16}>
                    <Grid item xs={12} sm={10} md={6}>
                        <section style={{ marginTop: -8, marginBottom: 32 }}>
                            <SettingsInput
                                inputName="ethNetworkRpc"
                                inputLabel="Ethereum RPC"
                            />
                        </section>
                        <section style={{ opacity: 0.3 }}>
                            <Typography variant="subheading" gutterBottom>
                                {"General"}
                            </Typography>
                            <SettingsInput
                                disabled
                                inputName="runOnStartup"
                                inputLabel="Run AO on startup"
                            />
                            <SettingsInput
                                disabled
                                inputName="runInBackground"
                                inputLabel="Run AO in background"
                            />
                            <SettingsInput
                                disabled
                                inputName="checkForUpdates"
                                inputLabel="Check for updates on startup"
                            />
                        </section>
                        <section style={{ opacity: 0.3 }}>
                            <Typography variant="subheading" gutterBottom>
                                {"Storage"}
                            </Typography>
                            <SettingsInput disabled inputName="maxDiskSpace" />
                        </section>
                        <section style={{ opacity: 0.3 }}>
                            <Typography variant="subheading" gutterBottom>
                                {"Network"}
                            </Typography>
                            <SettingsInput
                                disabled
                                inputName="maxBandwidthUp"
                                inputLabel="Max upload speed"
                            />
                            <div className="spacer" />
                            <SettingsInput
                                disabled
                                inputName="maxBandwidthDown"
                                inputLabel="Max download speed"
                            />
                        </section>
                        <section style={{ opacity: 0.3 }}>
                            <Typography variant="subheading" gutterBottom>
                                {"P2P"}
                            </Typography>
                            <SettingsInput
                                disabled
                                inputName="maxPeerConnections"
                            />
                        </section>
                    </Grid>
                </Grid>
            </View>
        );
    }
}

export default withStatsContainer(SettingsView);
