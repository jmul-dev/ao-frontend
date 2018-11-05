import { connect } from 'react-redux'
import { listenForAvailableExchangePools, stopListeningForAvailableExchangePools } from '../reducers/exchange.reducer';
import BigNumber from 'bignumber.js'


// Redux
const mapDispatchToProps = {
    listenForAvailableExchangePools,
    stopListeningForAvailableExchangePools,
}

const mapStateToProps = (store, props) => {
    const { exchangePools, exchangeAmountInBaseAo } = store.exchange
    let targetExchangePool = undefined
    Object.keys(exchangePools).forEach(poolId => {
        const pool = exchangePools[poolId]
        if ( !targetExchangePool ) {
            targetExchangePool = pool
        } else if ( targetExchangePool.totalQuantityAvailable.lt(exchangeAmountInBaseAo) && pool.totalQuantityAvailable.gte(exchangeAmountInBaseAo) ) {
            // target does not satisfy qty, but this pool does
            targetExchangePool = pool
        } else if ( pool.totalQuantityAvailable.gte(exchangeAmountInBaseAo) && pool.price.lt(targetExchangePool.price) ) {
            // this pool meets qty requirement & price is less than target
            targetExchangePool = pool
        } else if ( targetExchangePool.totalQuantityAvailable.lt(exchangeAmountInBaseAo) && pool.totalQuantityAvailable.lt(exchangeAmountInBaseAo) ) {
            // both pools do not meet the qty requirement, so just pick the one with highest qty
            if ( targetExchangePool.totalQuantityAvailable.lt(pool.totalQuantityAvailable) ) {
                targetExchangePool = pool
            }
        }
    })
    return {
        targetExchangePool,
        targetExchangeRate: targetExchangePool ? new BigNumber(window.web3.fromWei(targetExchangePool.price)) : new BigNumber(0),
    }
}

export default connect(mapStateToProps, mapDispatchToProps);