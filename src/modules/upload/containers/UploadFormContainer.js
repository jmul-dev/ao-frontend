import UploadForm from '../components/UploadForm'
import { connect } from 'react-redux'

// Redux
const mapDispatchToProps = {
    
}
const mapStateToProps = (store) => {
    return {
        upload: store.upload
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm);