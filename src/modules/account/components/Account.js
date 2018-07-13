// @flow
import React, { Component } from 'react';
import EthereumIcon from './EthereumIcon';
import withEthAddress from '../containers/withEthAddress';
import PropTypes from 'prop-types';

const propTypes = {
    display: PropTypes.oneOf(["ethAddress", "ethIcon"]),
}

const Account = ({display, ethAddress}) => {
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