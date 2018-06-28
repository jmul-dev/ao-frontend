import UploadForm from '../components/UploadForm'
import { connect } from 'react-redux'
import { updateCurrentStep } from '../reducers/upload.reducer'

// Redux
const mapDispatchToProps = {
    updateCurrentStep,
}
const mapStateToProps = (store) => {
    return {
        upload: store.upload,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm);