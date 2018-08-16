// @flow
import React, { Component } from 'react';
import withIcoState from '../containers/withIcoState';
import BigNumber from 'bignumber.js';
import { TokenBalance } from '../../../utils/denominations';

type Props = {
    // redux bound state
    ico: {
        icoEnded: boolean,
        icoTotalSupply: BigNumber,
        icoMaxSupply: BigNumber,
    },
    // redux bound actions
    updateIcoState: Function,
}

class IcoStats extends Component<Props> {
    props: Props;
    render() {
        const { icoTotalSupply, icoMaxSupply } = this.props.ico
        const icoPercentageComplete = icoTotalSupply.div(icoMaxSupply).times(100).toFixed(0)
        const icoRemainingSupply = icoMaxSupply.minus(icoTotalSupply)
        return (
            <div className={'IcoStats'}>
                {`Primordial Network Exchange: ${icoPercentageComplete}%`}
                <br />
                {`Total exchanged: `}<TokenBalance baseAmount={icoTotalSupply} decimals={0} isPrimordial={true} />
                <br />
                {`Remaining: `}<TokenBalance baseAmount={icoRemainingSupply} decimals={0} isPrimordial={true} />
            </div>
        )
    }
}

export default withIcoState(IcoStats)