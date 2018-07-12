import { connect } from 'react-redux'
import { updateUploadFormField, updatePricingOption, resetUploadForm, updateLastReachedStep } from '../reducers/upload.reducer'
import { push } from 'connected-react-router';

// Redux
const mapDispatchToProps = {
    updateUploadFormField,
    updatePricingOption,
    updateLastReachedStep,
    resetUploadForm,
    routerPush: push,
}
const mapStateToProps = (store, props) => {
    return {
        form: store.upload.form,
        router: store.router,
    }
}

export default connect(mapStateToProps, mapDispatchToProps);