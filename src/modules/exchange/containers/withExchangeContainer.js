import { connect } from 'react-redux'
import { getExchangeRate, exchangeEthForPrimordialTokens, updateTokenExchangeAmount, resetExchange } from '../reducers/exchange.reducer';
import { APP_STATES } from '../../../store/app.reducer';

// Redux
const mapDispatchToProps = {
    getExchangeRate,
    exchangeEthForPrimordialTokens,
    updateTokenExchangeAmount,
    resetExchange,
}

const mapStateToProps = (store) => {
    const { primordialTotalSupply, primordialMaxSupply } = store.ico
    const icoRemainingSupply = primordialMaxSupply.minus(primordialTotalSupply)
    return {
        contractsInitialized: store.app.states[APP_STATES.CONTRACTS_INITIALIZED],
        ethAddress: store.app.ethAddress,
        wallet: store.wallet,
        exchange: store.exchange,
        ico: store.ico,
        icoRemainingSupply,
        isElectron: store.electron.isElectron,
    }
}

export default connect(mapStateToProps, mapDispatchToProps);