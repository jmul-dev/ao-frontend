import { connect } from 'react-redux'
import { updateUploadFormField, updateLastReachedStep } from '../reducers/upload.reducer'
import { push } from 'react-router-redux';

// Redux
const mapDispatchToProps = {
    updateUploadFormField,
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