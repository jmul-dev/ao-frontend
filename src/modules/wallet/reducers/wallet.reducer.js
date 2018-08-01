import BigNumber from 'bignumber.js'

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
        if ( !contracts.initialized )
            return console.warn('Attempting to make contract call before contract initialized')
        contracts.aoToken.balanceOf(account, function(err, result) {
            if ( !err ) {
                dispatch({
                    type: BALANCE_CHANGE,
                    payload: { 
                        tokenBalance: new BigNumber(result) 
                    }
                })
            }
        })   
        contracts.aoToken.icoBalanceOf(account, function(err, result) {
            if ( !err ) {
                dispatch({
                    type: BALANCE_CHANGE,
                    payload: {
                        icoTokenBalance: new BigNumber(result) 
                    }
                })
            }
        })        
    }
}


// State
const initialState = {
    ethBalance: new BigNumber(0),
    tokenBalance: new BigNumber(0),
    icoTokenBalance: new BigNumber(0),
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
