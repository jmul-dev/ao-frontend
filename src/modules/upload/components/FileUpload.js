// @flow
import React, { Component } from "react";
import Dropzone from "react-dropzone";
import withUploadFormValue from "../containers/withUploadFormValue";
import { compose } from "react-apollo";
import { withStyles } from "@material-ui/core";
import classNames from "classnames";

type Props = {
    inputName: string,
    inputValue?: any,
    disabled?: boolean,
    accept?: string,
    updateUploadFormField: (string, any) => void,
    onInputChange: any => void,
    inputProps: object
};

const styles = {
    container: {
        position: "relative",
        overflow: "hidden",
        width: "100%",
        border: "1px dashed #333333",
        paddingBottom: "56.25%",
        cursor: "pointer",
        borderRadius: 4,
        "&:focus": {
            border: "1px dashed #666666",
            outline: "none"
        }
    },
    dropzoneActive: {
        background: "rgba(0,0,0,0.5)",
        border: "1px dashed #DDDDDD"
    },
    containerRejected: {
        border: "1px dashed rgb(240, 173, 78)"
    },
    inner: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        backgroundSize: "cover",
        "&:hover": {
            backgroundColor: `rgba(255, 255, 255, 0.1)`
        }
    },
    videoPreview: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
        background: "#000000"
    },
    rejectedMessage: {
        position: "absolute",
        bottom: 8,
        right: 8,
        color: "rgb(240, 173, 78)"
    }
};

class FileUpload extends Component<Props> {
    props: Props;
    state = {
        rejected: false
    };
    _onDrop = (acceptedFiles, rejectedFiles) => {
        const {
            updateUploadFormField,
            inputName,
            onInputChange,
            multiple
        } = this.props;
        let haveAcceptedFiles = false;
        acceptedFiles = acceptedFiles.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file)
            })
        );
        let accepted = acceptedFiles[0];
        if (multiple) {
            accepted = acceptedFiles;
            haveAcceptedFiles = accepted.length > 0;
        } else {
            haveAcceptedFiles = !!accepted;
        }
        if (haveAcceptedFiles) updateUploadFormField(inputName, accepted);
        if (onInputChange && haveAcceptedFiles) onInputChange(accepted);
        if (rejectedFiles.length > 0) {
            this.setState({ rejected: true });
            // TODO: dispatch notification?
            console.warn(`rejected files:`, rejectedFiles);
        }
    };
    render() {
        const {
            inputValue,
            disabled,
            accept,
            multiple,
            style,
            classes,
            directory,
            mozdirectory,
            webkitdirectory
        } = this.props;
        let innerStyles = {};
        let videoPreview = null;
        if (inputValue) {
            if (inputValue.type.indexOf("video") > -1) {
                // We append an actual video element in order to render the preview frame
                videoPreview = (
                    <video
                        className={classes.videoPreview}
                        src={inputValue.preview}
                    />
                );
            } else if (inputValue.type.indexOf("image") > -1) {
                // We simply image preview as background of inner container
                innerStyles = Object.assign({}, styles.inner, {
                    backgroundImage: `url(${inputValue.preview})`
                });
            }
        }
        return (
            <Dropzone
                onDrop={this._onDrop}
                disabled={disabled}
                accept={accept}
                multiple={multiple}
            >
                {({
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    rejectedFiles
                }) => {
                    return (
                        <div
                            {...getRootProps()}
                            className={classNames(classes.container, {
                                [classes.dropzoneActive]: isDragActive,
                                [classes.containerRejected]: this.state.rejected
                            })}
                        >
                            {videoPreview}
                            <div className={classes.inner} style={innerStyles}>
                                {!inputValue ? this.props.children : null}
                            </div>
                            <input
                                {...getInputProps({
                                    directory,
                                    mozdirectory,
                                    webkitdirectory
                                })}
                            />
                            {this.state.rejected && (
                                <div className={classes.rejectedMessage}>
                                    {`files rejected`}
                                </div>
                            )}
                        </div>
                    );
                }}
            </Dropzone>
        );
    }
}
FileUpload.defaultProps = {
    disabled: false,
    multiple: false
    // accept: "*"
};
export default compose(
    withUploadFormValue,
    withStyles(styles)
)(FileUpload);

/*
<Dropzone
    className={`${classes.container} ${
        this.state.rejected ? classes.containerRejected : ""
    }`}
    disabled={disabled}
    onDrop={this._onDrop}
    style={style}
    accept={inputProps.accept || accept}
    multiple={inputProps.multiple || multiple}
    inputProps={inputProps}
>
    {videoPreview}
    <div className={classes.inner} style={innerStyles}>
        {!inputValue ? this.props.children : null}
    </div>
    {this.state.rejected && (
        <div className={classes.rejectedMessage}>
            {`files rejected`}
        </div>
    )}
</Dropzone>
*/
