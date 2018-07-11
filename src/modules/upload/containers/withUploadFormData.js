import { connect } from 'react-redux'
import { updateUploadFormField, updatePricingOption, updateLastReachedStep } from '../reducers/upload.reducer'
import { push } from 'react-router-redux';

// Redux
const mapDispatchToProps = {
    updateUploadFormField,
    updatePricingOption,
    updateLastReachedStep,
    routerPush: push,
}
const mapStateToProps = (store, props) => {
    return {
        form: store.upload.form,
        router: store.router,
    }
}

export default connect(mapStateToProps, mapDispatchToProps);