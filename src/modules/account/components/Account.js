// @flow
import React from 'react';
import EthereumIcon from './EthereumIcon';
import withEthAddress from '../containers/withEthAddress';

type Props = {
    display: 'ethAddress' | 'ethIcon',
    ethAddress?: string,
}

const Account = ({display, ethAddress}: Props) => {
    switch (display) {
        case "ethAddress":
            return <React.Fragment>{ethAddress}</React.Fragment>;
        case "ethIcon":
            if ( ethAddress )
                return <EthereumIcon ethAddress={ethAddress} />;
            else
                return null;
        default:
            return null;
    }
}

export default withEthAddress(Account);