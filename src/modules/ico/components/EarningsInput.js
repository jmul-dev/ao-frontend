import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { DenominationSelect } from '../../../utils/denominations';


const styles = (theme) => ({
    formControl: {
        borderBottom: `1px solid ${theme.palette.grey['600']}`
    },
    input: {
        color: theme.palette.primary.main,
        padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 2}px`,        
        fontSize: `1.313rem`
    },
    inputDenominationSpacing: {
        paddingRight: theme.spacing.unit * 16,
    },
    inputLabel: {
        left: theme.spacing.unit * 2,
        color: `${theme.palette.grey['600']} !important`,
        fontWeight: 'bold'
    },
    denominationSelect: {
        position: 'absolute',
        right: theme.spacing.unit * 2,
        bottom: theme.spacing.unit,        
    },
    denominationSelectRoot: {
        color: `${theme.palette.grey['600']} !important`,
    },
    percentage: {
        fontSize: `1.313rem`,
        color: theme.palette.primary.main,
        position: 'absolute',
        bottom: 12,
        left: theme.spacing.unit * 2,  // updated based on input length
    },
});

class EarningsInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: props.value,
            denominationValue: props.denominationValue,
            percentageSpacing: 16 + 12,
        }
    }
    _onInputChange = (event) => {
        const characterLength = event.target.value.length || 1
        this.setState({
            inputValue: parseInt(event.target.value) || 1,
            percentageSpacing: 16 + 12 * characterLength
        })
        // TODO: propogate up
    }
    _onDenominationChange = (nextDenom) => {
        this.setState({denominationValue: nextDenom.name})
        // TODO: propogate up
    }
    render() {
        const { 
            classes,  
            label,
            includeDenomination,
            denominationIsPromordial,
            isPercentage,
        } = this.props;
        return (
            <FormControl className={classes.formControl}>
                <InputLabel disableAnimation={true} className={classes.inputLabel}>
                    {label}
                </InputLabel>
                <Input
                    type="number"
                    value={this.state.inputValue}
                    onChange={this._onInputChange}                    
                    className={`${classes.input} ${includeDenomination ? classes.inputDenominationSpacing : null}`}
                    disableUnderline={true}
                />
                {isPercentage ? (
                    <div className={classes.percentage} style={{left: this.state.percentageSpacing}}>{`%`}</div>
                ) : null}
                {includeDenomination ? (
                    <DenominationSelect 
                        value={this.state.denominationValue}
                        onChange={this._onDenominationChange}
                        isPrimordial={denominationIsPromordial}
                        className={classes.denominationSelect}
                        classes={{
                            root: classes.denominationSelectRoot,
                            icon: classes.denominationSelectRoot,
                        }}
                    />
                ) : null}
            </FormControl>
        );
    }
}

EarningsInput.propTypes = {
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    includeDenomination: PropTypes.bool,
    denominationValue: PropTypes.string,
    denominationIsPromordial: PropTypes.bool,
    isPercentage: PropTypes.bool,

    // networkTokensStaked: PropTypes.number.isRequired,
    // primordialTokensStaked: PropTypes.number.isRequired,
    // primordialTokenMultiplier: PropTypes.number.isRequired,
    // networkNodes: PropTypes.number.isRequired,
    // dailyGrowth: PropTypes.number.isRequired,
    // dailyContentRequestRate: PropTypes.number.isRequired,
    // saturation: PropTypes.number.isRequired,
    // creatorShare: PropTypes.number.isRequired,
    // networkInflation: PropTypes.number.isRequired,
    // weightedPrimordialTokenMultiplier: PropTypes.number.isRequired,
};

EarningsInput.defaultProps = {
    value: 1,
    includeDenomination: false,
    isPercentage: false,
}

export default withStyles(styles)(EarningsInput);