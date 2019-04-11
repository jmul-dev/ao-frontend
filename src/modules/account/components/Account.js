import React from "react";
import EthereumIcon, { EthereumIconPlaceholder } from "./EthereumIcon";
import withUserIdentifiers from "../containers/withUserIdentifiers";

const Account = ({ display, ethAddress, aoName, dispatch, ...props }) => {
    switch (display) {
        case "ethAddress":
            if (ethAddress)
                return <React.Fragment>{ethAddress}</React.Fragment>;
            else
                return (
                    <span className="placeholder-text">
                        {"0x0000000000000000000000000000000000000000"}
                    </span>
                );
        case "ethIcon":
            if (ethAddress)
                return <EthereumIcon ethAddress={ethAddress} {...props} />;
            else return <EthereumIconPlaceholder {...props} />;
        default:
            return null;
    }
};

export default withUserIdentifiers(Account);
