// @flow
import React, { Component } from 'react';
import withIcoState from '../containers/withIcoState';
import BigNumber from 'bignumber.js';
import { TokenBalance } from '../../../utils/denominations';

type Props = {
    // redux bound state
    ico: {
        primordialSaleActive: boolean,
        primordialTotalSupply: BigNumber,
        primordialMaxSupply: BigNumber,
    },
    // redux bound actions
    updateIcoState: Function,
}

class IcoStats extends Component<Props> {
    props: Props;
    componentDidMount() {
        this.props.updateIcoState()
    }
    render() {
        const { primordialTotalSupply, primordialMaxSupply } = this.props.ico
        const icoPercentageComplete = primordialTotalSupply.div(primordialMaxSupply).times(100).toFixed(0)
        const icoRemainingSupply = primordialMaxSupply.minus(primordialTotalSupply)
        return (
            <div className={'IcoStats'}>
                {`Primordial Network Exchange: ${icoPercentageComplete}%`}
                <br />
                {`Total exchanged: `}<TokenBalance baseAmount={primordialTotalSupply} decimals={0} isPrimordial={true} />
                <br />
                {`Remaining: `}<TokenBalance baseAmount={icoRemainingSupply} decimals={0} isPrimordial={true} />
            </div>
        )
    }
}

export default withIcoState(IcoStats)