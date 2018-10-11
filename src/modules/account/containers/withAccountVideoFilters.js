import { connect } from 'react-redux';
import { setAccountVideoListingFilter, setAccountVideoListingOrdering, setAccountContentTypeFilter } from '../reducers/account.reducer';

const mapDispatchToProps = {
    setAccountVideoListingFilter,
    setAccountVideoListingOrdering,
    setAccountContentTypeFilter,
}

const mapStateToProps = (state) => ({
    ethAddress: state.app.ethAddress,
    contentTypeFilter: state.account.contentTypeFilter,
    filter: state.account.videoListingFilter,
    ordering: state.account.videoListingOrdering,
})

export default connect(mapStateToProps, mapDispatchToProps);