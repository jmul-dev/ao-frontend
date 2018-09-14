import { connect } from 'react-redux'
import { updateWallet } from '../reducers/wallet.reducer'

// Redux
const mapDispatchToProps = {
    updateWallet,
}
const mapStateToProps = (store) => {
    return {
        ethAddress: store.app.ethAddress,
        wallet: store.wallet,
        isElectron: store.electron.isElectron,
    }
}

export default connect(mapStateToProps, mapDispatchToProps);