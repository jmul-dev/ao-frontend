import { ButtonBase, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, { PureComponent } from "react";
import { compose } from "react-apollo";
import { Link } from "react-router-dom";
import AccountRequired from "../../modules/account/components/AccountRequired";
import withUserIdentifiers from "../../modules/account/containers/withUserIdentifiers";
import WhitepaperLink from "../../modules/ico/components/WhitepaperLink";
import View from "../View";
import NetworkTaoContentListing from "./NetworkTaoContentListing";
import withNetworkTaoContent from "./withNetworkTaoContent";
import { PrimaryButton } from "../../theme";
import LaunchIcon from "@material-ui/icons/Launch";

const DaoViewNoUser = ({ includeTaoLink = false }) => (
    <React.Fragment>
        <Grid container>
            <Grid item xs={12} md={7}>
                <Typography
                    variant="display1"
                    style={{ fontWeight: "bold" }}
                >{`The AO`}</Typography>
                <section style={{ marginTop: 32 }}>
                    <Typography variant="body1">
                        {`Abstract Order (“AO”) is governed by The Autonomous Organization (“The AO”). The User Interface for The AO is accesible via the AO network and, once discovered, will show up below. Reference the AO whitepaper for details on the purpose and operation of The AO.`}
                        <WhitepaperLink style={{ marginTop: 8 }} />
                    </Typography>
                </section>
                <section style={{ marginTop: 24 }}>
                    <AccountRequired>
                        <div>{/* placeholder */}</div>
                    </AccountRequired>
                    {includeTaoLink && (
                        <PrimaryButton
                            component={Link}
                            to={`/app/view/daoDapp`}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <LaunchIcon style={{ marginRight: 8 }} />
                                {`View The AO Dapp`}
                            </div>
                        </PrimaryButton>
                    )}
                </section>
            </Grid>
        </Grid>
    </React.Fragment>
);

const DaoViewWithUser = compose(withNetworkTaoContent)(
    ({ networkTaoContentQuery: { loading, error, networkContent } }) => {
        if (loading && !networkContent)
            return <Typography variant="body1">{`loading...`}</Typography>;
        if (error && !networkContent)
            return (
                <Typography variant="body1">{`Error loading content...`}</Typography>
            );
        return (
            <React.Fragment>
                <section style={{ minHeight: 400 }}>
                    <DaoViewNoUser includeTaoLink={true} />
                </section>
                <section>
                    <Typography
                        variant="subheading"
                        style={{
                            borderBottom: `1px solid #333`,
                            paddingBottom: 8,
                            marginBottom: 24,
                            position: "relative",
                            display: "flex"
                        }}
                    >
                        {"Discovered content governed by The AO"}
                        <ButtonBase
                            component={Link}
                            to={{
                                pathname: `/app/view/account`
                            }}
                            style={{
                                alignSelf: "flex-end",
                                marginLeft: "auto"
                            }}
                        >
                            <Typography
                                variant="body1"
                                color="textSecondary"
                            >{`View my content`}</Typography>
                        </ButtonBase>
                    </Typography>
                    <NetworkTaoContentListing />
                </section>
            </React.Fragment>
        );
    }
);

class DaoView extends PureComponent {
    render() {
        const { ethAddress } = this.props;
        return (
            <View
                className={"DaoView"}
                padding="default"
                style={{ paddingTop: 120, paddingBottom: 120 }}
            >
                {!ethAddress ? <DaoViewNoUser /> : <DaoViewWithUser />}
            </View>
        );
    }
}

export default compose(withUserIdentifiers)(DaoView);
