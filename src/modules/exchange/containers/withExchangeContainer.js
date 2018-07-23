import { connect } from 'react-redux'
import { getEthBalanceForAccount, getTokenBalanceForAccount } from '../../wallet/reducers/wallet.reducer'
import { getExchangeRate, purchaseTokens, updateTokenExchangeAmount } from '../reducers/exchange.reducer';

// Redux
const mapDispatchToProps = {
    getEthBalanceForAccount,
    getTokenBalanceForAccount,
    getExchangeRate,
    purchaseTokens,
    updateTokenExchangeAmount,
}

const mapStateToProps = (store) => {
    return {
        ethAddress: store.app.ethAddress,
        wallet: store.wallet,
        exchange: store.exchange,
        isElectron: store.electron.isElectron,
    }
}

export default connect(mapStateToProps, mapDispatchToProps);