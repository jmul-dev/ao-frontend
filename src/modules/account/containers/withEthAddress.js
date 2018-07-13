import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
    ethAddress: state.app.ethAddress
})

export default connect(mapStateToProps);