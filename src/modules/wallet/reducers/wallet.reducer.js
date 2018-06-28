import BigNumber from 'bignumber.js'

// Constants
export const WEB3_ETH_BALANCE_CHANGE = 'WEB3_ETH_BALANCE_CHANGE'

// Actions
export const getEthBalanceForAccount = ( account ) => {
    return (dispatch, getState) => {
        window.web3.eth.getBalance( account, undefined, function(err, result) {
            if ( err )
                return console.error( 'error fetching balance', err )
            let balance = new BigNumber( window.web3.fromWei(result, 'ether') )
            dispatch({
                type: WEB3_ETH_BALANCE_CHANGE,
                payload: { balance }
            })
        })
    }
}


// State
const initialState = {
    ethBalance: new BigNumber(0),
    tokenBalance: new BigNumber(0),
}
export type WalletReducerType = {
    ethBalance: BigNumber,
    tokenBalance: BigNumber,
}

// Reducer
export default function walletReducer(state = initialState, action) {
    switch (action.type) {
        case WEB3_ETH_BALANCE_CHANGE:
            return {
                ...state,
                ethBalance: action.payload.balance
            }
        default:
            return state
    }
}
