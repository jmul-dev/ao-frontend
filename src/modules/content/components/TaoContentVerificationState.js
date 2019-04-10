import React, { Component } from "react";
import PropTypes from "prop-types";
import withTaoContentState from "../containers/withTaoContentState";
import { compose } from "redux";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

class TaoContentVerificationState extends Component {
    static propTypes = {
        contentId: PropTypes.string.isRequired,
        // redux
        taoContentState: PropTypes.string,
        getTaoContentState: PropTypes.func.isRequired,
        // withStyles
        classes: PropTypes.object.isRequired
    };
    componentDidMount() {
        if (!this.props.taoContentState) {
            this.props.getTaoContentState(this.props.contentId);
        }
    }
    render() {
        const { classes, taoContentState } = this.props;
        let label = "";
        let color = "";
        switch (taoContentState) {
            case "Pending Review":
                label = "pending review";
                color = classes.indicatorWarning;
                break;
            case "Accepted to TAO":
                label = "verified";
                color = classes.indicatorSuccess;
                break;
            case "Submitted":
            default:
                label = "unverified";
                color = classes.indicatorError;
                break;
        }
        return (
            <Tooltip title="The status of this content is derived from The AO">
                <Typography variant="caption" className={classes.typography}>
                    <span
                        className={`${classes.indicator} ${color}`}
                        style={{ backgroundColor: color }}
                    />
                    {label}
                </Typography>
            </Tooltip>
        );
    }
}

const taoContentStyles = ({ palette }) => ({
    typography: {},
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
        textAlign: "center",
        display: "inline-block"
    },
    indicatorWarning: {
        backgroundColor: palette.warning.main
    },
    indicatorError: {
        backgroundColor: palette.error.main
    },
    indicatorSuccess: {
        backgroundColor: palette.primary.main
    }
});

export default compose(
    withStyles(taoContentStyles, { withTheme: true }),
    withTaoContentState
)(TaoContentVerificationState);
