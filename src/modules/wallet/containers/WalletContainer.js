import Wallet from '../components/Wallet'
import { connect } from 'react-redux'

// Redux
const mapStateToProps = (store) => {
    return {
        wallet: store.wallet,
        app: store.app,
    }
}

export default connect(mapStateToProps)(Wallet);