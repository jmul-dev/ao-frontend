import { connect } from 'react-redux'
import { updateIcoState } from '../reducers/ico.reducer';
import { APP_STATES } from '../../../store/app.reducer';

// Redux
const mapDispatchToProps = {
    updateIcoState,
}

const mapStateToProps = (store) => {
    return {
        ico: store.ico,
        web3Connected: store.app.states[APP_STATES.WEB3_CONNECTED],
    }
}

export default connect(mapStateToProps, mapDispatchToProps);