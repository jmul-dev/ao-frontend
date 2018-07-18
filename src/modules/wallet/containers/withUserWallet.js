import { connect } from 'react-redux'
import { getEthBalanceForAccount, getTokenBalanceForAccount } from '../reducers/wallet.reducer'

// Redux
const mapDispatchToProps = {
    getEthBalanceForAccount,
    getTokenBalanceForAccount,
}
const mapStateToProps = (store) => {
    return {
        ethAddress: store.app.ethAddress,
        wallet: store.wallet,
        isElectron: store.electron.isElectron,
    }
}

export default connect(mapStateToProps, mapDispatchToProps);