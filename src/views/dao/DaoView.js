import React, { PureComponent } from "react";
import View from "../View";
import Typography from "@material-ui/core/Typography";
import EtherscanLink from "../../modules/etherscan/EtherscanLink";
import { compose } from "react-apollo";
import withEthAddress from "../../modules/account/containers/withEthAddress";
import AccountRequired from "../../modules/account/components/AccountRequired";
import withNetworkDapps from "./withNetworkDapps";
import withUserDapps from "./withUserDapps";
import UserDappListing from "./UserDappListing";
import NetworkDappListing from "./NetworkDappListing";
import { Grid } from "@material-ui/core";

const DaoViewNoUser = () => (
    <React.Fragment>
        <Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="display1">{`The AO`}</Typography>
                <section style={{ marginTop: 48 }}>
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

const DaoViewWithUser = withUserDapps(
    ({ userDappsQuery: { loading, error, node } }) => {
        if (loading) return null;
        if (error && !node) return `Error loading dapps...`;
        const dapps = [].concat(node.stakedContent, node.hostedContent);
        return (
            <React.Fragment>
                <React.Fragment>
                    <Typography variant="subheading" gutterBottom>
                        {"Your Dapps"}
                    </Typography>
                    <UserDappListing dapps={dapps} />
                </React.Fragment>
                <Typography variant="subheading" gutterBottom>
                    {"Discovered Dapps"}
                </Typography>
                <NetworkDappListing />
            </React.Fragment>
        );
    }
);

class DaoView extends PureComponent {
    render() {
        const { ethAddress } = this.props;
        return (
            <View className={"DaoView"} padding="full">
                {!ethAddress ? <DaoViewNoUser /> : <DaoViewWithUser />}
            </View>
        );
    }
}

// const DaoView = ({ethAddress, networkDappsQuery: { loading, error, networkContent }}) => {
//     if (loading) return <Typography>{"loading..."}</Typography>;
//     if (error && !node) return <Typography>{"error loading dapps..."}</Typography>;
//     const featuredDapp = ethAddress && networkContent.filter(content => {

//     })
// }

export default compose(withEthAddress)(DaoView);
