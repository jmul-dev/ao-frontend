import { connect } from 'react-redux'


// Redux
const mapStateToProps = (store) => {
    return {
        contractSettings: store.contracts.settings,
    }
}

export default connect(mapStateToProps)
