import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { DenominationSelect, fromBaseToDenominationValue, fromDenominationValueToBase } from '../../../utils/denominations';
import BigNumber from 'bignumber.js';


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
        top: theme.spacing.unit,
        color: `${theme.palette.grey['600']} !important`,
        fontWeight: 'bold'
    },
    denominationSelect: {
        position: 'absolute',
        right: theme.spacing.unit * 2,
        bottom: theme.spacing.unit - 2,        
    },
    denominationSelectRoot: {
        color: `${theme.palette.grey['600']} !important`,
        '& > select + svg': {
            color: `${theme.palette.grey['600']} !important`,
        }
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
        const characterLength = props.value ? (`${props.value}`.length || 1) : 1
        this.state = {
            inputValue: new BigNumber( props.value ),
            denominationValue: props.denominationValue,
            percentageSpacing: 16 + 12 * characterLength,
        }
    }
    _onInputChange = (event) => {
        const { integerOnly, includeDenomination } = this.props
        const characterLength = event.target.value.length || 1
        let parseFn = integerOnly ? parseInt : parseFloat
        let inputValue = new BigNumber(parseFn(event.target.value) || 1)
        // Need to convert back to baseDenom value
        if ( includeDenomination ) {
            inputValue = fromDenominationValueToBase(inputValue, this.state.denominationValue)
        }
        this.setState({
            inputValue,
            percentageSpacing: 16 + 12 * characterLength
        })
        this.props.onChange(inputValue.toNumber())
    }
    _onDenominationChange = (nextDenom) => {
        // this.state.inputValue === baseValue, converting from baseValue to the new denom baseValue
        let previousDenomInputValue = fromBaseToDenominationValue(this.state.inputValue, this.state.denominationValue)
        let inputValue = fromDenominationValueToBase(previousDenomInputValue, nextDenom.name)
        this.setState({
            denominationValue: nextDenom.name,
            inputValue,
        })
        this.props.onChange(inputValue.toNumber())
    }
    render() {
        const { 
            classes,  
            label,
            includeDenomination,
            isPrimordial,
            isPercentage,
        } = this.props;
        // NOTE: if using denominations, we convert from baseDenom value to the target denom value
        // but the baseDenom value is what is saved/passed around
        let inputValue = this.state.inputValue
        if ( includeDenomination ) {
            inputValue = fromBaseToDenominationValue(inputValue, this.state.denominationValue)
        }
        return (
            <FormControl className={classes.formControl} fullWidth>
                <InputLabel disableAnimation={true} className={classes.inputLabel}>
                    {label}
                </InputLabel>
                <Input
                    type="number"
                    step={1}
                    value={inputValue.toNumber()}
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
                        isPrimordial={isPrimordial}
                        className={classes.denominationSelect}
                        classes={{
                            root: classes.denominationSelectRoot,
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
    value: PropTypes.instanceOf(BigNumber).isRequired,
    label: PropTypes.string.isRequired,
    includeDenomination: PropTypes.bool,
    denominationValue: PropTypes.string,
    isPrimordial: PropTypes.bool,
    isPercentage: PropTypes.bool,
    integerOnly: PropTypes.bool,
};

EarningsInput.defaultProps = {
    value: new BigNumber(1),
    includeDenomination: false,
    isPercentage: false,
    integerOnly: false,
}

export default withStyles(styles)(EarningsInput);