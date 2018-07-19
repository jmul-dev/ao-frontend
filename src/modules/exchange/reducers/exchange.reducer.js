import BigNumber from 'bignumber.js'

// Constants
export const EXCHANGE_TRANSACTION_INITIALIZED = 'EXCHANGE_TRANSACTION_INITIALIZED'
export const EXCHANGE_TRANSACTION_ERROR = 'EXCHANGE_TRANSACTION_ERROR'
export const EXCHANGE_TRANSACTION_SUCCESS = 'EXCHANGE_TRANSACTION_SUCCESS'
export const UPDATE_EXCHANGE_RATE = 'UPDATE_EXCHANGE_RATE'
export const UPDATE_EXCHANGE_VALUES = 'UPDATE_EXCHANGE_VALUES'

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
            dispatch({type: EXCHANGE_TRANSACTION_INITIALIZED})
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
export const updateTokenExchangeAmount = (tokenAmount) => {
    console.log(tokenAmount)
    return (dispatch, getState) => {
        const state = getState()
        // Verify that the tokenAmount * exchangeRate <= wallet balance
        const ethBalance = state.wallet.ethBalance
        const exchangeRate = state.exchange.exchangeRate
        let exchangeAmountToken = new BigNumber(parseFloat(tokenAmount) || 0)
        let exchangeAmountEth = exchangeAmountToken.multipliedBy(exchangeRate)
        if ( exchangeAmountToken.lt(0) ) {
            exchangeAmountToken = new BigNumber(0)
            exchangeAmountEth = new BigNumber(0)
        } else if ( exchangeAmountToken.multipliedBy(exchangeRate).gt(ethBalance) ) {
            exchangeAmountToken = ethBalance.dividedBy(exchangeRate)
            exchangeAmountEth = new BigNumber(ethBalance)
        }
        dispatch({
            type: UPDATE_EXCHANGE_VALUES,
            payload: {
                exchangeAmountToken,
                exchangeAmountEth
            }
        })
    }
}

// State
const initialState = {
    exchangeRate: new BigNumber(0),
    exchangeAmountEth: new BigNumber(0),
    exchangeAmountToken: new BigNumber(0),
    exchangeTransaction: {
        initialized: undefined,
        id: undefined,
        result: undefined,
        error: undefined,
    }
}

// Reducer
export default function walletReducer(state = initialState, action) {
    switch (action.type) {
        case EXCHANGE_TRANSACTION_INITIALIZED:
            return {
                ...state,
                exchangeTransaction: {
                    ...state.exchangeTransaction,
                    initialized: true
                }
            }
        case UPDATE_EXCHANGE_RATE:
            return {
                ...state,
                exchangeRate: action.payload
            }
        case EXCHANGE_TRANSACTION_ERROR:
            return {
                ...state,
                exchangeTransaction: {
                    ...state.exchangeTransaction,
                    error: action.payload
                }
            }
        case EXCHANGE_TRANSACTION_SUCCESS:
            return {
                ...state,
                exchangeTransaction: {
                    ...state.exchangeTransaction,
                    result: action.payload,
                    error: undefined
                }
            }
        case UPDATE_EXCHANGE_VALUES:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
