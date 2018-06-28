import { connect } from 'react-redux'
import { updateUploadFormField } from '../reducers/upload.reducer'

// Redux
const mapDispatchToProps = {
    updateUploadFormField,
}
const mapStateToProps = (store, props) => {
    return {
        inputValue: store.upload.form[props.inputName],
    }
}

export default connect(mapStateToProps, mapDispatchToProps);