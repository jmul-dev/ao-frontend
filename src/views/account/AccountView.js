import React, { Component } from "react";
import { Switch, Route } from "react-router";
import View from "../View";
import Typography from "@material-ui/core/Typography";
import UserContentListing from "../../modules/account/components/UserContentListing";
import AccountVideoFilters from "../../modules/account/components/AccountVideoFilters";
import Grid from "@material-ui/core/Grid";
import withEthAddress from "../../modules/account/containers/withEthAddress";
import AccountVideoView from "./AccountVideoView";
import "./account-view.css";

class AccountView extends Component {
    render() {
        const { ethAddress } = this.props;
        return (
            <React.Fragment>
                <View
                    className={`AccountView ${
                        ethAddress ? "connected" : "not-connected"
                    }`}
                    padding="full"
                    style={{ paddingTop: 70 }}
                >
                    <section>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Route
                                    path="/app/view/account/:contentType?"
                                    render={({
                                        match: {
                                            params: { contentType }
                                        }
                                    }) => (
                                        <React.Fragment>
                                            <div style={{ marginBottom: 16 }}>
                                                <AccountVideoFilters
                                                    contentType={contentType}
                                                    disabled={!ethAddress}
                                                />
                                            </div>
                                            <UserContentListing
                                                contentType={contentType}
                                            />
                                        </React.Fragment>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </section>
                </View>
                <Route
                    path="/app/view/account/:contentType/:contentId"
                    component={AccountVideoView}
                />
            </React.Fragment>
        );
    }
}

export default withEthAddress(AccountView);
