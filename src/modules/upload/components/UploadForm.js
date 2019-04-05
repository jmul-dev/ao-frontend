import React, { Component } from "react";
import { Redirect } from "react-router";
import FileUpload from "../components/FileUpload";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { PrimaryButton } from "../../../theme";
import withUploadFormData from "../containers/withUploadFormData";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "react-apollo";
import CloseIcon from "@material-ui/icons/Remove";
import OpenIcon from "@material-ui/icons/Add";
import AccountRequired from "../../account/components/AccountRequired";

import videoIconSrc from "../../../assets/media-type-video.svg";
import musicIconSrc from "../../../assets/media-type-music.svg";
import imageIconSrc from "../../../assets/media-type-image.svg";
import documentIconSrc from "../../../assets/media-type-document.svg";
import pdfIconSrc from "../../../assets/media-type-pdf.svg";
import applicationIconSrc from "../../../assets/media-type-application.svg";
import assetIconSrc from "../../../assets/media-type-digital-asset.svg";

type Props = {
    asPlaceholder: boolean,
    updatePricingOption: Function,
    updateLastReachedStep: Function
};

class UploadForm extends Component<Props> {
    props: Props;
    componentDidMount() {
        this.props.resetUploadForm();
    }
    _onFileInputChange = value => {
        if (value) {
            // Nav to next view
            this.props.updatePricingOption(1);
            this.props.updateLastReachedStep("license");
        }
    };
    render() {
        const { asPlaceholder, form, classes } = this.props;
        const contentType = form.contentType;
        return form.content ? (
            <Redirect to="/app/view/upload/license" />
        ) : (
            <div className={`UploadForm ${asPlaceholder ? "placeholder" : ""}`}>
                <Typography
                    className="title"
                    variant="subheading"
                    style={{ display: "flex", alignItems: "flex-end" }}
                >
                    {`Upload Content`}
                </Typography>
                <List>
                    {this._renderContentListItem({
                        contentType: "VOD",
                        label: "Video",
                        icon: videoIconSrc,
                        active: contentType === "VOD",
                        disabled: false,
                        fileTypesMessage: "mp4 or mov files",
                        fileInputProps: {
                            accept: "video/mp4,video/mov"
                        }
                    })}
                    {this._renderContentListItem({
                        contentType: "DAPP",
                        label: "Application",
                        icon: applicationIconSrc,
                        active: contentType === "DAPP",
                        disabled: false,
                        fileTypesMessage:
                            "an individual html file or a zip folder of the dapp (with an index.html)",
                        fileInputProps: {
                            accept: "application/zip,text/html"
                        }
                    })}
                    {this._renderContentListItem({
                        contentType: "PDF",
                        label: "PDF",
                        icon: pdfIconSrc,
                        active: contentType === "PDF",
                        disabled: false,
                        fileTypesMessage: "pdf file",
                        fileInputProps: {
                            accept: "application/pdf"
                        }
                    })}
                    {this._renderContentListItem({
                        contentType: "AUDIO",
                        label: "Music",
                        icon: musicIconSrc,
                        active: contentType === "AUDIO",
                        disabled: true
                    })}
                    {this._renderContentListItem({
                        contentType: "PHOTO",
                        label: "Image",
                        icon: imageIconSrc,
                        active: contentType === "PHOTO",
                        disabled: true
                    })}
                    {this._renderContentListItem({
                        contentType: "ASSET",
                        label: "Digital Asset",
                        icon: assetIconSrc,
                        active: contentType === "ASSET",
                        disabled: true
                    })}
                    {this._renderContentListItem({
                        contentType: "DOC",
                        label: "Documents",
                        icon: documentIconSrc,
                        active: contentType === "DOC",
                        disabled: true
                    })}
                </List>
            </div>
        );
    }
    _renderUploadPane = (fileTypesMessage, inputProps = {}) => (
        <li
            className={`${this.props.classes.li} ${
                this.props.classes.liActive
            } ${this.props.classes.liActiveBottom}`}
        >
            <FileUpload
                disabled={this.props.asPlaceholder}
                inputName="content"
                onInputChange={this._onFileInputChange}
                style={{ paddingBottom: "50%" }}
                {...inputProps}
            >
                <div className="video-input">
                    <Typography variant="display2" gutterBottom align="center">
                        {"drag and drop to upload"}
                    </Typography>
                    <Typography
                        variant="caption"
                        align="center"
                        style={{ marginBottom: 24 }}
                    >
                        {fileTypesMessage}
                    </Typography>
                    <AccountRequired>
                        <PrimaryButton disabled={this.props.asPlaceholder}>
                            {"or choose a file"}
                        </PrimaryButton>
                    </AccountRequired>
                </div>
            </FileUpload>
        </li>
    );
    _onClickListItem(contentType) {
        this.props.updateUploadFormField("contentType", contentType);
    }
    _renderContentListItem = ({
        contentType,
        label,
        icon,
        active,
        disabled,
        fileTypesMessage,
        fileInputProps
    }) => {
        const { classes } = this.props;
        let onClickHandler = undefined;
        if (!disabled) {
            onClickHandler = active
                ? this._onClickListItem.bind(this, null)
                : this._onClickListItem.bind(this, contentType);
        }
        return (
            <React.Fragment>
                <ListItem
                    className={`${classes.li} ${
                        active
                            ? `${classes.liActive} ${classes.liActiveTop}`
                            : `${classes.liInactive}`
                    }`}
                    disabled={disabled}
                    button={!disabled}
                    onClick={onClickHandler}
                >
                    <ListItemIcon>
                        <img src={icon} alt={label} className={classes.icon} />
                    </ListItemIcon>
                    <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                            className: classes.liText
                        }}
                    />
                    {disabled ? (
                        <ListItemText
                            secondary={`coming soon`}
                            className={classes.textAlignRight}
                        />
                    ) : (
                        <ListItemIcon>
                            {active ? (
                                <CloseIcon
                                    className={classes.icon}
                                    style={{ opacity: 0.5 }}
                                />
                            ) : (
                                <OpenIcon
                                    className={classes.icon}
                                    style={{ opacity: 0.5 }}
                                />
                            )}
                        </ListItemIcon>
                    )}
                </ListItem>
                {active &&
                    this._renderUploadPane(fileTypesMessage, fileInputProps)}
            </React.Fragment>
        );
    };
}

const styles = ({ palette, spacing }) => ({
    icon: {
        height: 24,
        width: 24
    },
    li: {
        paddingTop: spacing.unit * 3,
        paddingBottom: spacing.unit * 3
    },
    liActive: {
        backgroundColor: `#151515`,
        border: `1px solid #222222`
    },
    liActiveTop: {
        borderBottom: 0
    },
    liActiveBottom: {
        borderTop: 0,
        padding: spacing.unit * 4
    },
    liInactive: {
        border: `1px solid #222222`,
        marginTop: -1
    },
    textAlignRight: {
        textAlign: "right"
    },
    liText: {
        fontWeight: "normal"
    }
});

export default compose(
    withStyles(styles),
    withUploadFormData
)(UploadForm);
