import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { compose } from "redux";
import { AddIcon } from "../../../assets/Icons";
import { PrimaryButton } from "../../../theme";
import { FileSize } from "../../../utils/denominations";
import withUserIdentifiers from "../../account/containers/withUserIdentifiers";
import withUploadFormData from "../containers/withUploadFormData";
import { isFormValid } from "../reducers/upload.reducer";
import FileUpload from "./FileUpload";
import OverviewAside from "./OverviewAside";
import TextInput from "./TextInput";
import { BackButton } from "./UploadFormNavButtons";

const MAX_TEASER_FILE_SIZE = 5.0 * Math.pow(10, 6); // 5MB

class UploadFormContent extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    componentDidMount() {
        this.props.updateLastReachedStep("content");
    }
    _navBack = () => {
        let backRoute = "pricing";
        if (
            this.props.history.location.search &&
            this.props.history.location.search.indexOf("license") > -1
        )
            backRoute = "license";
        this.context.router.history.replace(`/app/view/upload/${backRoute}`);
    };
    _submit = () => {
        const { aoName } = this.props;
        if (!aoName) {
            this.context.router.history.push(`/app/registration`);
        } else {
            this.context.router.history.push("/app/view/upload/submit");
        }
    };
    _onTeaserInputChange = file => {
        if (file.size > MAX_TEASER_FILE_SIZE) {
            this.props.updateUploadFormField("videoTeaser", undefined);
            this.props.addNotification({
                message: `Your teaser video is too large. Currently, the network limits teaser video file sizes to <= ${MAX_TEASER_FILE_SIZE}MB.`,
                variant: "warning"
            });
        }
    };
    _handleTextInput = inputName => event => {
        this.props.updateUploadFormField(inputName, event.target.value);
    };
    render() {
        const { form } = this.props;
        if (!form.content) {
            return <Redirect to={"/app/view/upload/start"} />;
        }
        const formIsSubmittable = isFormValid(form);
        return (
            <div>
                <Typography className="title" variant="subheading">
                    {`Content Upload`}
                </Typography>
                <Grid container spacing={16}>
                    <Grid item xs={3}>
                        <OverviewAside form={form} includePricing={true} />
                    </Grid>
                    <Grid item xs={8} style={{ marginLeft: "auto" }}>
                        <Grid container spacing={24} className="gutter-bottom">
                            <Grid item xs={6}>
                                <Typography variant="body1" gutterBottom>
                                    {`featured image (png, jpg)`}
                                </Typography>
                                <FileUpload
                                    inputName="featuredImage"
                                    accept=".png, .jpg, .jpeg"
                                >
                                    <AddIcon />
                                </FileUpload>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" gutterBottom>
                                    {`teaser (mp4, mov) max size = `}
                                    <FileSize
                                        sizeInBytes={MAX_TEASER_FILE_SIZE}
                                    />
                                </Typography>
                                <FileUpload
                                    inputName="videoTeaser"
                                    accept="video/*"
                                    onInputChange={this._onTeaserInputChange}
                                >
                                    <AddIcon />
                                    {form.content.contentType !== "VOD" && (
                                        <Typography
                                            variant="caption"
                                            color="secondary"
                                            style={{
                                                position: "absolute",
                                                bottom: 8,
                                                right: 8
                                            }}
                                        >{`optional`}</Typography>
                                    )}
                                </FileUpload>
                            </Grid>
                        </Grid>
                        <div className="text-inputs gutter-bottom">
                            <TextInput
                                value={form.title}
                                onChange={this._handleTextInput("title")}
                                label="content title"
                            />
                            <TextInput
                                value={form.description}
                                onChange={this._handleTextInput("description")}
                                label="description"
                                multiline
                                rows={4}
                            />
                            {form.contentLicense === "TAO" && (
                                <TextInput
                                    value={form.taoId}
                                    onChange={this._handleTextInput("taoId")}
                                    label="TAO ID"
                                />
                            )}
                            {form.contentLicense === "CC" && (
                                <TextInput
                                    value={form.contentAttribution}
                                    onChange={this._handleTextInput(
                                        "contentAttribution"
                                    )}
                                    label="Creative Commons content attribution"
                                />
                            )}
                        </div>
                        <nav className="upload-form-nav gutter-bottom">
                            <BackButton onClick={this._navBack}>
                                {"back"}
                            </BackButton>
                            <PrimaryButton
                                onClick={this._submit}
                                disabled={!formIsSubmittable}
                            >
                                {"finish & upload"}
                            </PrimaryButton>
                        </nav>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default compose(
    withUploadFormData,
    withUserIdentifiers
)(UploadFormContent);
