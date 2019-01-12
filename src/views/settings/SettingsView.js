import React, { PureComponent } from "react";
import View from "../View";
import SettingsInput from "../../modules/settings";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import "./settings-view.css";
import Export from "../../modules/account/components/Export";
import withStatsContainer from "../../modules/stats/containers/withStatsContainer";

class SettingsView extends PureComponent {
    render() {
        const { ethNetworkName, desktopVersion } = this.props;
        const { statistics } = this.props.query;
        return (
            <View className={"SettingsView"} padding="full">
                <header style={{ display: "flex" }}>
                    <Typography variant="subheading" gutterBottom>
                        {"Settings"}
                    </Typography>
                    <Export />
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
                    <Typography variant="caption" gutterBottom>
                        {`Ethereum network: ${ethNetworkName}`}
                    </Typography>
                    <Typography
                        variant="caption"
                        style={{ marginTop: 16, marginBottom: 32 }}
                    >{`NOTE: you may need to restart AO for settings to go into affect`}</Typography>
                </section>
                <Grid container spacing={16}>
                    <Grid item xs={12} sm={10} md={6}>
                        <section>
                            <Typography variant="subheading" gutterBottom>
                                {"General"}
                            </Typography>
                            <SettingsInput
                                inputName="ethNetworkRpc"
                                inputLabel="Ethereum RPC"
                            />
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
