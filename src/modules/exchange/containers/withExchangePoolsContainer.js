import { connect } from 'react-redux'
import { listenForAvailableExchangePools, stopListeningForAvailableExchangePools } from '../reducers/exchange.reducer';

// Redux
const mapDispatchToProps = {
    listenForAvailableExchangePools,
    stopListeningForAvailableExchangePools,
}

const mapStateToProps = (store, props) => {
    const { requiredTokenAmount } = props
    const { exchangePools } = store.exchange    
    let targetExchangePool = undefined
    Object.keys(exchangePools).forEach(poolId => {
        const pool = exchangePools[poolId]
        if ( !targetExchangePool )
            targetExchangePool = pool
        else if ( pool.totalQuantityAvailable > requiredTokenAmount && pool.price < targetExchangePool.price )
            targetExchangePool = pool
    })
    return {
        exchangePools,
        targetExchangePool,
        targetExchangeRate: targetExchangePool ? targetExchangePool.price : new BigNumber(0),
    }
}

export default connect(mapStateToProps, mapDispatchToProps);