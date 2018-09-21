import BigNumber from "../../node_modules/bignumber.js";
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


export const denominations = [
    {
        name: "ao",
        prefix: "",
        powerOfTen: 0,
        fileSizeName: "byte",
        fileSizeSuffix: "B",
    },
    {
        name: "kilo",
        prefix: "Kilo",
        powerOfTen: 3,
        fileSizeName: "kilobyte",
        fileSizeSuffix: "KB",
    },
    {
        name: "mega",
        prefix: "Mega",
        powerOfTen: 6,
        fileSizeName: "megabyte",
        fileSizeSuffix: "MB",
    },
    {
        name: "giga",
        prefix: "Giga",
        powerOfTen: 9,
        fileSizeName: "gigabyte",
        fileSizeSuffix: "GB",
    },
    {
        name: "tera",
        prefix: "Tera",
        powerOfTen: 12,
        fileSizeName: "terabyte",
        fileSizeSuffix: "TB",
    },
    {
        name: "peta",
        prefix: "Peta",
        powerOfTen: 15,
        fileSizeName: "petabyte",
        fileSizeSuffix: "PB",
    },
    {
        name: "exa",
        prefix: "Exa",
        powerOfTen: 18,
        fileSizeName: "exabyte",
        fileSizeSuffix: "EB",
    },
    {
        name: "zetta",
        prefix: "Zetta",
        powerOfTen: 21,
        fileSizeName: "zettabyte",
        fileSizeSuffix: "ZB",
    },
    {
        name: "yotta",
        prefix: "Yotta",
        powerOfTen: 24,
        fileSizeName: "yottabyte",
        fileSizeSuffix: "YB",
    },
    {
        name: "xona",
        prefix: "Xona",
        powerOfTen: 27,
        fileSizeName: "xonabyte",
        fileSizeSuffix: "XB",
    },
]

export const fromBaseToHighestDenomination = (baseAmount) => {
    let highestDenomination = denominations[0];
    let highestDenominationAmount = new BigNumber(0);
    for (let i = 0; i < denominations.length; i++) {
        let denomination = denominations[i];
        const amountInDenomination = new BigNumber(baseAmount / Math.pow(10, denomination.powerOfTen))
        if ( amountInDenomination.gte(1) ) {
            highestDenomination = denomination
            highestDenominationAmount = amountInDenomination
        } else {
            break;
        }
    }
    return {
        denomination: highestDenomination,
        amount: highestDenominationAmount,
    }
}

export const formattedTokenAmount = (baseAmount, decimals = 2, includeAO = true, isPrimordial = false) => {
    const { denomination, amount } = fromBaseToHighestDenomination(baseAmount)
    let value = `${amount.toFixed(decimals)}`
    let label = ''
    if ( denomination.prefix )
        label += ` ${denomination.prefix}`
    if ( includeAO )
        label += ' AO'
    if ( includeAO && isPrimordial )
        label += '+'
    return {
        value, 
        label,
    }
}

export const TokenBalance = ({baseAmount, decimals, includeAO, isPrimordial}) => {
    const { value, label } = formattedTokenAmount(baseAmount, decimals, includeAO, isPrimordial)
    return (
        <Fragment>{value} {label}</Fragment>
    )
}

export const FileSize = ({sizeInBytes, decimals = 1}) => {
    const { amount, denomination } = fromBaseToHighestDenomination(sizeInBytes)
    return (
        <Fragment>{amount.toFixed(decimals)} {denomination.fileSizeSuffix}</Fragment>
    )
}


/**
 * 
 * 
 * Denomination Input Field (wraps text input with denomination select input)
 * 
 * 
 */
const denominationSelectStyles = ({palette}) => ({
    root: {
        width: 100,
        color: 'white'
    },
    select: {
        width: `calc(100% - 24px)`,
        paddingRight: 24,
    },
})

const DenominationSelectPreWrap = ({isPrimordial, theme, onChange, classes, ...props}) => (
    <Select
        native
        disableUnderline={true}
        onChange={event => {
            const nextDenom = denominations.find(function(denom) { return denom.name === event.target.value})
            onChange(nextDenom)
        }}
        classes={classes}
        {...props}
        >
        {denominations.map((denomination) => (
            <option key={denomination.name} value={denomination.name}>{`${denomination.prefix} ${isPrimordial ? 'AO+' : 'AO'}`}</option>
        ))}
    </Select>
)
export const DenominationSelect = withStyles(denominationSelectStyles, {withTheme: true})(DenominationSelectPreWrap)




export class DenominationInput extends Component {
    static propTypes = {
        baseInputValue: PropTypes.instanceOf(BigNumber),
        isPrimordial: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,  // ({baseInputValue, denominationInputValue, denomination})
        disabled: PropTypes.bool,
    }
    constructor(props) {
        super(props)
        const { denomination } = fromBaseToHighestDenomination(props.baseInputValue || Math.pow(10, 9))
        this.state = {
            denomination: denomination,
        }
    }
    componentDidMount() {
        this.props.onChange({
            baseInputValue: this.props.baseInputValue.toNumber(),
            denomination: this.state.denomination
        })
    }
    _onDenominationInputValueChange = (event) => {
        let denominationInputValue = event.target.value
        // TODO: check input value above
        const { denomination } = this.state
        let baseInputValue = new BigNumber(parseFloat(denominationInputValue) * Math.pow(10, denomination.powerOfTen))
        this.props.onChange({
            baseInputValue: baseInputValue.toNumber(),
            denomination,
            denominationInputValue: parseFloat(denominationInputValue),
        })
    }
    _onDenominationInputChange = (nextDenom) => {
        if ( nextDenom ) {
            const baseInputValue = parseInt(this.props.baseInputValue, 10) || Math.pow(10, 9)
            const amountInDenomination = new BigNumber(baseInputValue / Math.pow(10, nextDenom.powerOfTen))
            this.setState({
                denomination: nextDenom,
            })
            this.props.onChange({
                baseInputValue: this.props.baseInputValue,
                denomination: nextDenom,
                denominationInputValue: amountInDenomination.toNumber(),
            })
        }
    }
    render() {
        const { baseInputValue, isPrimordial } = this.props
        const { denomination } = this.state      
        const denominationInputValue = new BigNumber(baseInputValue / Math.pow(10, denomination.powerOfTen))
        return (
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <TextField 
                    fullWidth 
                    InputProps={{
                        disableUnderline: true,
                        type: "number",                        
                    }}
                    // eslint-disable-next-line
                    inputProps={{
                        style: {
                            padding: '0 8px',
                            fontSize: '50px',
                            color: '#FFFFFF',
                            letterSpacing: 0,
                            textAlign: 'right',
                        }
                    }}
                    value={denominationInputValue.toNumber()}
                    onChange={this._onDenominationInputValueChange}
                    disabled={this.props.disabled}                    
                />
                <DenominationSelect
                    value={denomination.name}
                    onChange={this._onDenominationInputChange}
                    isPrimordial={isPrimordial}
                />
            </div>
        )
    }
}
