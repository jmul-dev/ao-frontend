import React, { PureComponent } from "react";
import View from "../View";
import Typography from "@material-ui/core/Typography";
import EtherscanLink from "../../modules/etherscan/EtherscanLink";
import { Link } from "react-router-dom";
import { compose } from "react-apollo";
import withUserIdentifiers from "../../modules/account/containers/withUserIdentifiers";
import AccountRequired from "../../modules/account/components/AccountRequired";
import withNetworkDapps from "./withNetworkDapps";
import withTheAoDappId from "./withTheAoDappId";
import ContentCard from "../../modules/content/components/ContentCard";
import NetworkDappListing from "./NetworkDappListing";
import { Grid, ButtonBase } from "@material-ui/core";

const DaoViewNoUser = () => (
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
                        <EtherscanLink type="address" value={`TODO`} />
                    </Typography>
                </section>
                <section style={{ marginTop: 24 }}>
                    <AccountRequired>
                        <div>{/* placeholder */}</div>
                    </AccountRequired>
                </section>
            </Grid>
        </Grid>
    </React.Fragment>
);

const DaoViewWithUser = compose(
    withTheAoDappId,
    withNetworkDapps
)(({ theAoDappId, networkDappsQuery: { loading, error, networkContent } }) => {
    if (loading) return <Typography variant="body1">{`loading...`}</Typography>;
    if (error && !networkContent)
        return (
            <Typography variant="body1">{`Error loading dapps...`}</Typography>
        );
    const featuredDapp = networkContent.filter(content => {
        return content.id === theAoDappId;
    });
    return (
        <React.Fragment>
            <section style={{ minHeight: 400 }}>
                {featuredDapp.length > 0 ? (
                    <ContentCard
                        variant="featured"
                        contentId={featuredDapp[0].id}
                    />
                ) : (
                    <DaoViewNoUser />
                )}
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
                    {"Discovered Dapps"}
                    <ButtonBase
                        component={Link}
                        to={{
                            pathname: `/app/view/account/dapp`
                        }}
                        style={{
                            alignSelf: "flex-end",
                            marginLeft: "auto"
                        }}
                    >
                        <Typography
                            variant="body1"
                            color="textSecondary"
                        >{`View downloaded dapps`}</Typography>
                    </ButtonBase>
                </Typography>
                <NetworkDappListing />
            </section>
        </React.Fragment>
    );
});

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
