import BigNumber from 'bignumber.js'
import { APP_STATES } from '../../../store/app.reducer';

// Constants
export const BALANCE_CHANGE = 'BALANCE_CHANGE'
export const UPDATE_ACCOUNT_EARNINGS = 'UPDATE_ACCOUNT_EARNINGS'

// Actions
export const updateWallet = () => {
    return (dispatch, getState) => {
        const { app } = getState()
        dispatch( getEthBalanceForAccount(app.ethAddress) )
        dispatch( getTokenBalanceForAccount(app.ethAddress) )
        dispatch( getTokensEarned() )
        dispatch( getTokensStaked() )
    }
}
export const getEthBalanceForAccount = ( account ) => {
    return (dispatch, getState) => {
        if ( !account )
            return console.warn('getEthBalanceForAccount called without an account')        
        window.web3.eth.getBalance( account, undefined, function(err, result) {
            if ( err )
                return console.error( 'error fetching balance', err )
            let balance = new BigNumber( window.web3.fromWei(result, 'ether') )
            dispatch({
                type: BALANCE_CHANGE,
                payload: { 
                    ethBalance: balance 
                }
            })
        })
    }
}
export const getTokenBalanceForAccount = ( account ) => {
    return (dispatch, getState) => {
        if ( !account )
            return console.warn('getTokenBalanceForAccount called without an account')
        const { contracts, app } = getState()
        if ( !app.states[APP_STATES.CONTRACTS_INITIALIZED] )
            return console.warn('Attempting to make contract call before contract initialized')
        contracts.aoToken.balanceOf(account, function(err, result) {
            if ( !err ) {
                dispatch({
                    type: BALANCE_CHANGE,
                    payload: { 
                        networkTokenBalance: new BigNumber(result),
                    }
                })
            }
        })   
        contracts.aoToken.primordialBalanceOf(account, function(err, result) {
            if ( !err ) {
                dispatch({
                    type: BALANCE_CHANGE,
                    payload: {
                        primordialTokenBalance: new BigNumber(result),
                    }
                })
            }
        })        
    }
}
export const getTokensStaked = () => {
    return (dispatch, getState) => {
        const { app, contracts } = getState()
        if ( !app.ethAddress )
            return console.warn(`getTokensStaked called with no ethAddress`)
        // TODO: not sure how to get this value yet
        console.warn(`getTokensStaked not implemented`)
    }
}
export const getTokensEarned = () => {
    return (dispatch, getState) => {
        const { app, contracts } = getState()
        if ( !app.ethAddress )
            return console.warn(`getTokensEarned called with no ethAddress`)
        const account = app.ethAddress
        let stakeContentEarningPromise = new Promise((resolve, reject) => {
            contracts.aoEarning.stakeContentEarning(account, function(err, result) {
                resolve(new BigNumber(result || 0))
            })
        })
        let hostContentEarningPromise = new Promise((resolve, reject) => {
            contracts.aoEarning.hostContentEarning(account, function(err, result) {
                resolve(new BigNumber(result || 0))
            })
        })
        Promise.all([stakeContentEarningPromise, hostContentEarningPromise]).then(results => {
            dispatch({
                type: UPDATE_ACCOUNT_EARNINGS,
                payload: {
                    tokenEarned: new BigNumber(results[0] + results[1]),
                    aoEarnedFromStaking: results[0],
                    aoEarnedFromHosting: results[1],                    
                }
            })
        })
    }
}


// State
const initialState = {
    ethBalance: new BigNumber(0),
    tokenBalance: new BigNumber(0),  // Normal + Primordial AO
    primordialTokenBalance: new BigNumber(0),  // Primordial AO
    networkTokenBalance: new BigNumber(0),  // Normal AO
    tokenStaked: new BigNumber(0),
    tokenEarned: new BigNumber(0),
    aoEarnedFromStaking: new BigNumber(0),
    aoEarnedFromHosting: new BigNumber(0),
}

// Reducer
export default function walletReducer(state = initialState, action) {
    switch (action.type) {
        case BALANCE_CHANGE:
            let updatedState = {
                ...state,
                ...action.payload,
            }
            updatedState.tokenBalance = updatedState.primordialTokenBalance.plus(updatedState.networkTokenBalance)
            return updatedState
        case UPDATE_ACCOUNT_EARNINGS:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}
