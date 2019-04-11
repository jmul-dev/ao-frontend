import { withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { compose } from "react-apollo";
import { withRouter } from "react-router";
import allMediaIconSrc from "../../../assets/media-type-all.svg";
import applicationIconSrc from "../../../assets/media-type-application.svg";
import assetIconSrc from "../../../assets/media-type-digital-asset.svg";
import documentIconSrc from "../../../assets/media-type-document.svg";
import imageIconSrc from "../../../assets/media-type-image.svg";
import musicIconSrc from "../../../assets/media-type-music.svg";
import pdfIconSrc from "../../../assets/media-type-pdf.svg";
import videoIconSrc from "../../../assets/media-type-video.svg";

const styles = ({ palette, spacing }) => ({
    root: {
        backgroundColor: palette.background.default
    },
    tabsRoot: {
        // offset for the nav buttons that show up
        marginLeft: spacing.unit * -7,
        marginRight: spacing.unit * -7
    },
    scrollButtons: {
        color: "#777777"
    },
    tabRoot: {
        color: "white",
        textTransform: "lowercase",
        minHeight: 92,
        paddingBottom: 4
    },
    icon: {
        height: 26,
        width: "auto",
        marginTop: spacing.unit * 2,
        marginBottom: spacing.unit
    }
});

class AccountViewContentTypeNav extends Component {
    static propTypes = {
        contentType: PropTypes.string,
        // withStyles
        classes: PropTypes.object.isRequired
    };
    _onChange = (event, value) => {
        let route = `/app/view/account`;
        if (value !== "all") {
            route = `/app/view/account/${value}`;
        }
        this.props.history.replace(route);
    };
    render() {
        const { classes, contentType } = this.props;
        return (
            <div className={classes.root}>
                <Tabs
                    value={contentType || "all"}
                    onChange={this._onChange}
                    indicatorColor="primary"
                    textColor="inherit"
                    scrollable
                    scrollButtons="on"
                    className={classes.tabsRoot}
                    classes={{
                        scrollButtons: classes.scrollButtons
                    }}
                >
                    <Tab
                        label="all content"
                        value={"all"}
                        icon={
                            <img
                                className={classes.icon}
                                src={allMediaIconSrc}
                                alt="all content icon"
                            />
                        }
                        className={classes.tabRoot}
                    />
                    <Tab
                        label="videos"
                        value={"vod"}
                        icon={
                            <img
                                className={classes.icon}
                                src={videoIconSrc}
                                alt="video content icon"
                            />
                        }
                        className={classes.tabRoot}
                    />
                    <Tab
                        label="dapps"
                        value={"dapp"}
                        icon={
                            <img
                                className={classes.icon}
                                src={applicationIconSrc}
                                alt="application content icon"
                            />
                        }
                        className={classes.tabRoot}
                    />
                    <Tab
                        label="pdfs"
                        value={"pdf"}
                        icon={
                            <img
                                className={classes.icon}
                                src={pdfIconSrc}
                                alt="pdf content icon"
                            />
                        }
                        className={classes.tabRoot}
                    />
                    <Tab
                        disabled
                        label="music"
                        value={"music"}
                        icon={
                            <img
                                className={classes.icon}
                                src={musicIconSrc}
                                alt="music content icon"
                            />
                        }
                        className={classes.tabRoot}
                    />
                    <Tab
                        disabled
                        label="images"
                        value={"img"}
                        icon={
                            <img
                                className={classes.icon}
                                src={imageIconSrc}
                                alt="content type icon"
                            />
                        }
                        className={classes.tabRoot}
                    />
                    <Tab
                        disabled
                        label="digital asset"
                        value={"asset"}
                        icon={
                            <img
                                className={classes.icon}
                                src={assetIconSrc}
                                alt="digital asset content icon"
                            />
                        }
                        className={classes.tabRoot}
                    />
                    <Tab
                        disabled
                        label="documents"
                        value={"doc"}
                        icon={
                            <img
                                className={classes.icon}
                                src={documentIconSrc}
                                alt="document content icon"
                            />
                        }
                        className={classes.tabRoot}
                    />
                </Tabs>
            </div>
        );
    }
}
export default compose(
    withRouter,
    withStyles(styles)
)(AccountViewContentTypeNav);
