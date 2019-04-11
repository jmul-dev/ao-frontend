import Grid from "@material-ui/core/Grid";
import React, { Component } from "react";
import { Route } from "react-router";
import UserContentFilters from "../../modules/account/components/UserContentFilters";
import UserContentListing from "../../modules/account/components/UserContentListing";
import withUserIdentifiers from "../../modules/account/containers/withUserIdentifiers";
import View from "../View";
import "./account-view.css";
import AccountContentView from "./AccountContentView";

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
                                                <UserContentFilters
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
                    component={AccountContentView}
                />
            </React.Fragment>
        );
    }
}

export default withUserIdentifiers(AccountView);
