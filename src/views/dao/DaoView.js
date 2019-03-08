import React, { PureComponent } from "react";
import View from "../View";
import Typography from "@material-ui/core/Typography";
import EtherscanLink from "../../modules/etherscan/EtherscanLink";
import { compose } from "react-apollo";
import withEthAddress from "../../modules/account/containers/withEthAddress";
import AccountRequired from "../../modules/account/components/AccountRequired";
import withUserDapps from "./withUserDapps";
import UserDappListing from "./UserDappListing";
import NetworkDappListing from "./NetworkDappListing";

const DaoDescriptionPane = ({ ethAddress }) => (
    <section style={{ marginTop: 48, opacity: 0.5 }}>
        <Typography variant="body1">
            {`Abstract Order (“AO”) is governed by The Autonomous Organization (“The AO”). The User Interface for The AO is accesible via the AO network and, once discovered, will show up below. Reference the AO whitepaper for details on the purpose and operation of The AO.`}
            <EtherscanLink type="address" value={`TODO`} />
        </Typography>
    </section>
);

const DaoViewNoUser = () => (
    <React.Fragment>
        <DaoDescriptionPane />
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <AccountRequired>
                <div>{/* placeholder */}</div>
            </AccountRequired>
        </div>
    </React.Fragment>
);

const DaoViewWithUser = withUserDapps(
    ({ userDappsQuery: { loading, error, node } }) => {
        if (loading) return null;
        if (error && !node) return `Error loading dapps...`;
        const dapps = [].concat(node.stakedContent, node.hostedContent);
        return (
            <React.Fragment>
                {dapps.length === 0 ? (
                    <DaoDescriptionPane />
                ) : (
                    <React.Fragment>
                        <Typography variant="subheading" gutterBottom>
                            {"Your Dapps"}
                        </Typography>
                        <UserDappListing dapps={dapps} />
                    </React.Fragment>
                )}
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
                <header>
                    <Typography variant="subheading" gutterBottom>
                        {"The AO"}
                    </Typography>
                </header>
                {!ethAddress ? <DaoViewNoUser /> : <DaoViewWithUser />}
            </View>
        );
    }
}

export default compose(withEthAddress)(DaoView);
