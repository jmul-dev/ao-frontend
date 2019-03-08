import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

class ContentListItem extends Component {
    static propTypes = {
        content: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired
    };
    render() {
        const { classes, content } = this.props;
        return (
            <div className={classes.root}>
                <Typography variant="subheading">{content.title}</Typography>
            </div>
        );
    }
}

const styles = ({ spacing }) => ({
    root: {},
    previewImageButton: {
        width: "100%",
        display: "block"
    },
    previewImage: {
        position: "relative",
        width: "100%",
        paddingBottom: "56.2%",
        background: "#151515",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        "& > div": {
            position: "absolute",
            bottom: 0,
            right: 0,
            padding: spacing.unit,
            background: "rgba(0,0,0,0.5)",
            color: "white"
        }
    }
});

export default withStyles(styles)(ContentListItem);
