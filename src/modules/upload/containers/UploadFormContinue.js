import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const UploadFormContinue = ({lastReachedUploadStep}) => (
    <Redirect to={`/app/view/upload/${lastReachedUploadStep}`} />
)

// Redux
const mapStateToProps = (store, props) => {
    return {
        lastReachedUploadStep: store.upload.lastReachedUploadStep,
    }
}

export default connect(mapStateToProps)(UploadFormContinue);