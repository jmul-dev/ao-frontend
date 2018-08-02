import BigNumber from "../../node_modules/bignumber.js";
import React, { Fragment } from 'react';


export const denominations = [
    {
        name: "ao",
        prefix: "",
        powerOfTen: 0,
    },
    {
        name: "kilo",
        prefix: "Kilo",
        powerOfTen: 3,
    },
    {
        name: "mega",
        prefix: "Mega",
        powerOfTen: 6,
    },
    {
        name: "giga",
        prefix: "Giga",
        powerOfTen: 9,
    },
    {
        name: "tera",
        prefix: "Tera",
        powerOfTen: 12,
    },
    {
        name: "peta",
        prefix: "Peta",
        powerOfTen: 15,
    },
    {
        name: "exa",
        prefix: "Exa",
        powerOfTen: 18,
    },
    {
        name: "zetta",
        prefix: "Zetta",
        powerOfTen: 21,
    },
    {
        name: "yotta",
        prefix: "Yotta",
        powerOfTen: 24,
    },
    {
        name: "xona",
        prefix: "Xona",
        powerOfTen: 27,
    },
]

export const fromBaseToHighestDenomination = (baseAmount) => {
    let highestDenomination = denominations[0];
    let highestDenominationAmount = new BigNumber(0);
    for (let i = 0; i < denominations.length; i++) {
        let denomination = denominations[i];
        const amountInDenomination = new BigNumber(baseAmount / Math.pow(10, denomination.powerOfTen))
        if ( amountInDenomination.gt(1) ) {
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

export const formattedTokenAmount = (baseAmount, decimals = 2, includeAO = true) => {
    const { denomination, amount } = fromBaseToHighestDenomination(baseAmount)
    let value = `${amount.toFixed(decimals)}`
    let label = ''
    if ( denomination.prefix )
        label += ` ${denomination.prefix}`
    if ( includeAO )
        label += ' AO'
    return {
        value, 
        label,
    }
}

export const TokenBalance = ({baseAmount, decimals, includeAO}) => {
    const { value, label } = formattedTokenAmount(baseAmount, decimals, includeAO)
    return (
        <Fragment>{value} {label}</Fragment>
    )
}
