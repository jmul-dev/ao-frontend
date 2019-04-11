import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import React, { Fragment } from 'react';
import BigNumber from "../../node_modules/bignumber.js";


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
export const denominationsByName = {
    'ao': denominations[0],
    'kilo': denominations[1],
    'mega': denominations[2],
    'giga': denominations[3],
    'tera': denominations[4],
    'peta': denominations[5],
    'exa': denominations[6],
    'zetta': denominations[7],
    'yotta': denominations[8],
    'zona': denominations[9],
}

/**
 * @param {BigNumber} baseAmount 
 * @param {string} denominationName 
 * @returns {BigNumber}
 */
export const fromBaseToDenominationValue = (baseAmount, denominationName) => {
    for (let i = 0; i < denominations.length; i++) {
        if ( denominations[i].name === denominationName ) {
            const expValue = new BigNumber(10).pow( denominations[i].powerOfTen )
            return baseAmount.dividedBy(expValue)
        }
    }
    return baseAmount
}
/**
 * 
 * @param {BigNumber} amount 
 * @param {string} denominationName 
 * @returns {BigNumber}
 */
export const fromDenominationValueToBase = (amount, denominationName) => {
    for (let i = 0; i < denominations.length; i++) {
        if ( denominations[i].name === denominationName ) {
            const expValue = new BigNumber(10).pow( denominations[i].powerOfTen )
            return expValue.multipliedBy(amount)
        }
    }
    return new BigNumber(amount)
}
/**
 * 
 * @param {BigNumber | number} baseAmount 
 * @returns {{amount: BigNumber, denomination: Object}}
 */
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
 * This method helps determine a sufficient token split between a user's network and primordial
 * token balances. For example, if a user has a balance of 10 AO and 10 AO+, and the targetAmount
 * is 12 AO, we can split this 10 AO and 2 AO+ (if network is preferred) OR 10 AO+ and 2 AO (if 
 * primordial is preferred). All values should be given in base denominations.
 * 
 * @param {Object} params
 * @param {BigNumber} params.networkBalance
 * @param {BigNumber} params.primordialBalance
 * @param {String} params.preferredTokenType Token type that should be preferred if both network & primordial balance exists
 * @param {String} params.requiredTokenType Token type that must be used
 * @param {BigNumber} params.targetAmount The amount
 * @returns {TokenSplit}
 * 
 * @typedef {Object} TokenSplit
 * @property {BigNumber} networkAmount
 * @property {BigNumber} primordialAmount
 * @property {Number} splitPercentage Decimal value ranging from 0 - 100, 100 being 100% primordial, 0 being 100% network
 * @property {Boolean} isSufficient Whether some combination of network and primordial tokens reach the target amount
 * @property {BigNumber} insufficientAmount
 * @property {String} tokenType "both" | "network" | "primordial"
 */
export const getPreferredTokenSplit = ({
    networkBalance,
    primordialBalance,
    preferredTokenType = 'network',
    requiredTokenType = null,
    targetAmount,
}) => {
    let networkAmount = new BigNumber(0)
    let primordialAmount = new BigNumber(0)
    let isSufficient = false
    let insufficientAmount = new BigNumber(0)
    let tokenType = requiredTokenType || preferredTokenType
    if ( requiredTokenType ) {
        if ( requiredTokenType === 'network' ) {
            return {
                networkAmount: networkBalance.gte(targetAmount) ? targetAmount : networkBalance,
                primordialAmount,
                isSufficient: networkBalance.gte(targetAmount),
                insufficientAmount: networkBalance.lt(targetAmount) ? targetAmount.minus(networkBalance) : new BigNumber(0),
                splitPercentage: 0.0,
                tokenType: 'network',
            }
        } else if ( requiredTokenType === 'primordial' ) {
            return {
                networkAmount,
                primordialAmount: primordialBalance.gte(targetAmount) ? targetAmount : primordialBalance,
                isSufficient: primordialBalance.gte(targetAmount),
                insufficientAmount: primordialBalance.lt(targetAmount) ? targetAmount.minus(primordialBalance) : new BigNumber(0),
                splitPercentage: 100.0,
                tokenType: 'primordial',
            }
        }
    } else {
        if ( preferredTokenType === 'network' ) {
            insufficientAmount = BigNumber.max( targetAmount.minus(networkBalance), 0 )
            if ( insufficientAmount.gt(0) ) {
                tokenType = 'both'
                networkAmount = networkBalance                
                insufficientAmount = BigNumber.max( insufficientAmount.minus(primordialBalance), 0 )                
                if ( insufficientAmount.gt(0) ) {
                    primordialAmount = primordialBalance                    
                } else {
                    primordialAmount = targetAmount.minus(networkAmount)
                    isSufficient = true
                }
            } else {
                networkAmount = targetAmount
                isSufficient = true
                tokenType = 'network'
            }
        } else if ( preferredTokenType === 'primordial' ) {
            insufficientAmount = BigNumber.max( targetAmount.minus(primordialBalance), 0 )
            if ( insufficientAmount.gt(0) ) {
                tokenType = 'both'
                primordialAmount = primordialBalance
                insufficientAmount = BigNumber.max( insufficientAmount.minus(networkBalance), 0 )
                if ( insufficientAmount.gt(0) ) {
                    networkAmount = networkBalance                    
                } else {
                    networkAmount = targetAmount.minus(primordialAmount)
                    isSufficient = true                    
                }
            } else {
                primordialAmount = targetAmount
                isSufficient = true
                tokenType = 'primordial'
            }   
        }
        return {
            networkAmount,
            primordialAmount,
            insufficientAmount,
            isSufficient,
            splitPercentage: targetAmount.dividedBy(primordialAmount).multipliedBy(100).toNumber(),
            tokenType,
        }
    }
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
        width: `100%`,
        color: palette.getContrastText(palette.background.paper)
    },
    select: {
        width: `calc(100% - 36px)`,
        padding: `8px 24px 8px 12px`,
        fontSize: '18px',
    },
    icon: {
        right: 4,
    },
})
const DenominationSelectPreWrap = ({isPrimordial, onChange, classes, ...props}) => (
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
export const DenominationSelect = withStyles(denominationSelectStyles)(DenominationSelectPreWrap)
