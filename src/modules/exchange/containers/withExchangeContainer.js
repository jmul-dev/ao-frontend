import { connect } from 'react-redux'
import { getEthBalanceForAccount, getTokenBalanceForAccount } from '../../wallet/reducers/wallet.reducer'
import { getExchangeRate, purchaseTokens, updateTokenExchangeAmount, resetExchange } from '../reducers/exchange.reducer';

// Redux
const mapDispatchToProps = {
    getEthBalanceForAccount,
    getTokenBalanceForAccount,
    getExchangeRate,
    purchaseTokens,
    updateTokenExchangeAmount,
    resetExchange,
}

const mapStateToProps = (store) => {
    const { primordialTotalSupply, primordialMaxSupply, primordialSaleActive } = store.ico
    const icoRemainingSupply = primordialMaxSupply.minus(primordialTotalSupply)
    return {
        ethAddress: store.app.ethAddress,
        wallet: store.wallet,
        exchange: store.exchange,
        ico: store.ico,
        icoRemainingSupply,
        isElectron: store.electron.isElectron,
    }
}

export default connect(mapStateToProps, mapDispatchToProps);