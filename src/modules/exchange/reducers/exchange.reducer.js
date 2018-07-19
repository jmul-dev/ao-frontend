import BigNumber from 'bignumber.js'

// Constants
export const EXCHANGE_TRANSACTION_ERROR = 'EXCHANGE_TRANSACTION_ERROR'
export const EXCHANGE_TRANSACTION_SUCCESS = 'EXCHANGE_TRANSACTION_SUCCESS'
export const UPDATE_EXCHANGE_RATE = 'UPDATE_EXCHANGE_RATE'

// Actions
export const purchaseTokens = ( ethAmount, tokenAmount ) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState()
            if ( state.electron.isElectron ) {
                window.chrome.ipcRenderer.send('open-metamask-popup')
            }
            // Placeholder transaction!
            const exchangeParams = {
                tokenAmount: tokenAmount,
                ethAmount: ethAmount,
            }
            const messageToSign = JSON.stringify(exchangeParams)
            const hashedMessage = window.web3.sha3(messageToSign)
            window.web3.eth.sign(state.app.ethAddress, hashedMessage, function(error, result) {
                if ( error ) {
                    dispatch({
                        type: EXCHANGE_TRANSACTION_ERROR,
                        payload: error
                    })
                    reject(error)
                } else {
                    dispatch({
                        type: EXCHANGE_TRANSACTION_SUCCESS,
                        payload: result
                    })
                    resolve(result)
                }
            })
        })     
    }
}
export const getExchangeRate = () => {
    return (dispatch, getState) => {
        // TODO: contract call
        dispatch({
            type: UPDATE_EXCHANGE_RATE,
            payload: new BigNumber(1)
        })
    }
}

// State
const initialState = {
    exchangeRate: new BigNumber(0),
    exchangeAmountEth: new BigNumber(0),
    exchangeAmountToken: new BigNumber(0),
    exchangeTransaction: {
        result: undefined,
        error: undefined,
    }
}

// Reducer
export default function walletReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_EXCHANGE_RATE:
            return {
                ...state,
                exchangeRate: action.payload
            }
        case EXCHANGE_TRANSACTION_ERROR:
            return {
                ...state,
                exchangeTransaction: {
                    error: action.payload
                }
            }
        case EXCHANGE_TRANSACTION_SUCCESS:
            return {
                ...state,
                exchangeTransaction: {
                    result: action.payload
                }
            }
        default:
            return state
    }
}
