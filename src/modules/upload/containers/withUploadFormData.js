import { connect } from 'react-redux'
import { updateUploadFormField, updatePricingOption, resetUploadForm, updateLastReachedStep } from '../reducers/upload.reducer'
import { addNotification } from '../../notifications/reducers/notifications.reducer';

// Redux
const mapDispatchToProps = {
    updateUploadFormField,
    updatePricingOption,
    updateLastReachedStep,
    resetUploadForm,
    addNotification,
}
const mapStateToProps = (store, props) => {
    return {
        form: store.upload.form,
        router: store.router,
    }
}

export default connect(mapStateToProps, mapDispatchToProps);