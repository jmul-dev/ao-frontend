import BigNumber from 'bignumber.js'
import { APP_STATES } from '../../../store/app.reducer';

// Constants
export const BALANCE_CHANGE = 'BALANCE_CHANGE'

// Actions
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
                const icoTokenBalance = getState().wallet.icoTokenBalance
                dispatch({
                    type: BALANCE_CHANGE,
                    payload: { 
                        networkTokenBalance: new BigNumber(result),
                        tokenBalance: icoTokenBalance.plus(result),
                    }
                })
            }
        })   
        contracts.aoToken.icoBalanceOf(account, function(err, result) {
            if ( !err ) {
                const networkTokenBalance = getState().wallet.networkTokenBalance
                dispatch({
                    type: BALANCE_CHANGE,
                    payload: {
                        icoTokenBalance: new BigNumber(result),
                        tokenBalance: networkTokenBalance.plus(result)
                    }
                })
            }
        })        
    }
}


// State
const initialState = {
    ethBalance: new BigNumber(0),
    tokenBalance: new BigNumber(0),  // Normal + Primordial AO
    icoTokenBalance: new BigNumber(0),  // Primordial AO
    networkTokenBalance: new BigNumber(0),  // Normal AO
    tokenStaked: new BigNumber(0),
    tokenEarned: new BigNumber(0),
}
export type WalletReducerType = {
    ethBalance: BigNumber,
    tokenBalance: BigNumber,
    icoTokenBalance: BigNumber,
    tokenStaked: BigNumber,
    tokenEarned: BigNumber,
}

// Reducer
export default function walletReducer(state = initialState, action) {
    switch (action.type) {
        case BALANCE_CHANGE:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
