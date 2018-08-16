import { connect } from 'react-redux'
import { updateIcoState } from '../reducers/ico.reducer';

// Redux
const mapDispatchToProps = {
    updateIcoState,
}

const mapStateToProps = (store) => {
    return {
        ico: store.ico
    }
}

export default connect(mapStateToProps, mapDispatchToProps);