import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import withAccountVideoFilters from "../containers/withAccountVideoFilters";
import PropTypes from "prop-types";
import AccountViewContentTypeNav from "./AccountViewContentTypeNav";

class AccountVideoFilters extends Component {
    static propTypes = {
        contentType: PropTypes.string,
        // redux bound state
        ethAddress: PropTypes.string,
        filter: PropTypes.oneOf(["downloaded", "uploaded"]),
        ordering: PropTypes.string,
        // redux bound actions
        setAccountVideoListingFilter: PropTypes.func.isRequired,
        setAccountVideoListingOrdering: PropTypes.func.isRequired
    };
    _setActiveFilter = filter => {
        this.props.setAccountVideoListingFilter(filter);
    };
    render() {
        const { disabled, filter, contentType } = this.props;
        return (
            <div className="AccountVideoFilters">
                <AccountViewContentTypeNav contentType={contentType} />
                <div style={{ marginTop: 40, marginLeft: -16 }}>
                    <Button
                        onClick={this._setActiveFilter.bind(this, "downloaded")}
                        disabled={disabled || filter === "downloaded"}
                    >
                        <Typography
                            variant="display3"
                            component="span"
                            style={{
                                color:
                                    filter === "downloaded"
                                        ? "#FFFFFF"
                                        : "#777777"
                            }}
                        >
                            {`Downloaded`}
                        </Typography>
                    </Button>
                    <Button
                        onClick={this._setActiveFilter.bind(this, "uploaded")}
                        disabled={disabled || filter === "uploaded"}
                    >
                        <Typography
                            variant="display3"
                            component="span"
                            style={{
                                color:
                                    filter === "uploaded"
                                        ? "#FFFFFF"
                                        : "#777777"
                            }}
                        >
                            {"Uploaded"}
                        </Typography>
                    </Button>
                </div>
            </div>
        );
    }
}

export default withAccountVideoFilters(AccountVideoFilters);
