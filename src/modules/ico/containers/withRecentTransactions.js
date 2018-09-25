import { connect } from 'react-redux'
import { startListeningForRecentTransactions, stopListeningForRecentTransactions } from '../reducers/ico.reducer';

// Redux
const mapDispatchToProps = {
    startListeningForRecentTransactions,
    stopListeningForRecentTransactions,
}

const mapStateToProps = (store) => {
    let lotCreations = Object.values(store.ico.lotCreations).sort((a, b) => {
        if ( a.blockNumber > b.blockNumber )
            return -1
        if ( a.blockNumber > b.blockNumber )
            return 1
        return 0
    })
    return {
        lotCreations
    }
}

export default connect(mapStateToProps, mapDispatchToProps);