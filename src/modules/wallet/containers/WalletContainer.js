import Wallet from '../components/Wallet'
import { connect } from 'react-redux'
import { getEthBalanceForAccount, getTokenBalanceForAccount } from '../reducers/wallet.reducer'

// Redux
const mapDispatchToProps = {
    getEthBalanceForAccount,
    getTokenBalanceForAccount,
}
const mapStateToProps = (store) => {
    return {
        wallet: store.wallet,
        app: store.app,
        isElectron: store.electron.isElectron,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);