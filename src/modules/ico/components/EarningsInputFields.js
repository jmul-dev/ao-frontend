import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import EarningsInput from "./EarningsInput";

const styles = theme => ({
    containerInputs: {
        background: theme.palette.common.black
    },
    stakeInputs: {
        display: "flex"
    }
});

class EarningsInputFields extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: props.inputs
        };
    }
    _handleInputChange = inputName => value => {
        const updatedInputs = {
            ...this.state.inputs,
            [inputName]: value
        };
        this.setState({
            inputs: updatedInputs
        });
        this.props.onChange(updatedInputs);
    };
    render() {
        const { classes } = this.props;
        const { inputs } = this.state;
        return (
            <div className={classes.containerInputs}>
                <EarningsInput
                    label={`Staked AO`}
                    value={inputs.networkTokensStaked}
                    onChange={this._handleInputChange("networkTokensStaked")}
                    includeDenomination={true}
                    denominationValue={"giga"}
                />
                <EarningsInput
                    label={`Staked AO+`}
                    value={inputs.primordialTokensStaked}
                    onChange={this._handleInputChange("primordialTokensStaked")}
                    includeDenomination={true}
                    denominationValue={"giga"}
                    isPrimordial={true}
                />
                <EarningsInput
                    label={`AO+ Multiplier`}
                    value={inputs.primordialTokenMultiplier}
                    onChange={this._handleInputChange(
                        "primordialTokenMultiplier"
                    )}
                />
                <EarningsInput
                    label={`Network Nodes`}
                    value={inputs.networkNodes}
                    onChange={this._handleInputChange("networkNodes")}
                    integerOnly={true}
                />
                <EarningsInput
                    label={`Daily node growth`}
                    value={inputs.dailyGrowth}
                    onChange={this._handleInputChange("dailyGrowth")}
                    integerOnly={true}
                    isPercentage={true}
                />
                <EarningsInput
                    label={`Daily content request rate`}
                    value={inputs.dailyContentRequestRate}
                    onChange={this._handleInputChange(
                        "dailyContentRequestRate"
                    )}
                    integerOnly={true}
                    isPercentage={true}
                />
                <EarningsInput
                    label={`Saturation`}
                    value={inputs.saturation}
                    onChange={this._handleInputChange("saturation")}
                    integerOnly={true}
                    isPercentage={true}
                />
                <EarningsInput
                    label={`Creator share`}
                    value={inputs.creatorShare}
                    onChange={this._handleInputChange("creatorShare")}
                    integerOnly={true}
                    isPercentage={true}
                />
                <EarningsInput
                    label={`Network inflation`}
                    value={inputs.networkInflation}
                    onChange={this._handleInputChange("networkInflation")}
                    integerOnly={true}
                    isPercentage={true}
                />
                {/* <EarningInput
                    label={`Weighted AO+ multiplier`}
                    value={inputs.weightedPrimordialTokenMultiplier}
                    onChange={this._handleInputChange('weightedPrimordialTokenMultiplier')}
                    integerOnly={true}
                    isPercentage={true}
                    disabled={true}
                /> */}
            </div>
        );
    }
}

EarningsInputFields.propTypes = {
    classes: PropTypes.object.isRequired,
    inputs: PropTypes.shape({
        networkTokensStaked: PropTypes.number.isRequired,
        primordialTokensStaked: PropTypes.number.isRequired,
        primordialTokenMultiplier: PropTypes.number.isRequired,
        networkNodes: PropTypes.number.isRequired,
        dailyGrowth: PropTypes.number.isRequired,
        dailyContentRequestRate: PropTypes.number.isRequired,
        saturation: PropTypes.number.isRequired,
        creatorShare: PropTypes.number.isRequired,
        networkInflation: PropTypes.number.isRequired,
        weightedPrimordialTokenMultiplier: PropTypes.number.isRequired
    }),
    onChange: PropTypes.func.isRequired
};

EarningsInputFields.defaultProps = {
    inputs: {}
};

export default withStyles(styles)(EarningsInputFields);
