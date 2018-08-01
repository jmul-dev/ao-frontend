import BigNumber from 'bignumber.js'

// Constants
export const EXCHANGE_TRANSACTION = Object.freeze({
    INITIALIZED: 'EXCHANGE_TRANSACTION.INITIALIZED',
    SUBMITTED: 'EXCHANGE_TRANSACTION.SUBMITTED',
    SUCCESS: 'EXCHANGE_TRANSACTION.SUCCESS',
    ERROR: 'EXCHANGE_TRANSACTION.ERROR',
    RESET: 'EXCHANGE_TRANSACTION.RESET',
})
export const UPDATE_EXCHANGE_RATE = 'UPDATE_EXCHANGE_RATE'
export const UPDATE_EXCHANGE_VALUES = 'UPDATE_EXCHANGE_VALUES'

// Actions
export const purchaseTokens = ( ethAmount, tokenAmount ) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const rejectAndDispatchError = (err) => {
                dispatch({
                    type: EXCHANGE_TRANSACTION.ERROR,
                    payload: err
                })
                reject(err)
            }
            const state = getState()
            const { app, contracts, electron, wallet } = state
            if ( !app.ethAddress ) {
                rejectAndDispatchError(new Error('Unlock your ethereum account to purchase AO'))
            } else if ( wallet.ethBalance.lt( ethAmount ) ) {
                rejectAndDispatchError(new Error('Insufficient Eth balance'))
            } else {
                dispatch({type: EXCHANGE_TRANSACTION.INITIALIZED})
                if ( electron.isElectron ) {
                    window.chrome.ipcRenderer.send('open-metamask-popup')
                }
                contracts.aoToken.icoEnded(function(err, ended) {
                    if ( err ) {
                        rejectAndDispatchError(err)
                    } else if ( ended ) {
                        rejectAndDispatchError(new Error('The AO ICO has ended, you can no longer purchase AO tokens directly through the contract.'))
                    } else {
                        const ethAmountInWei = new BigNumber(window.web3.toWei(ethAmount, 'ether'))
                        contracts.aoToken.buyIcoToken.sendTransaction({
                            from: app.ethAddress,
                            value: ethAmountInWei.toNumber()
                        }, function(err, transactionHash) {
                            if ( err ) {
                                rejectAndDispatchError(err)
                            } else {
                                dispatch({
                                    type: EXCHANGE_TRANSACTION.SUBMITTED,
                                    payload: transactionHash
                                })
                                // TODO: listen for tx status
                            }
                        })
                    }
                })                
            }
        })     
    }
}
export const resetExchange = ({
    type: EXCHANGE_TRANSACTION.RESET
})
export const getExchangeRate = () => {
    return (dispatch, getState) => {
        // TODO: contract call
        // TODO: update the exchangeAmountToken & exchangeAmountEth according to new exchange rate
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
        transactionHash: undefined,
        result: undefined,
        error: undefined,
    }
}

// Reducer
export default function walletReducer(state = initialState, action) {
    switch (action.type) {
        case EXCHANGE_TRANSACTION.INITIALIZED:
            return {
                ...state,
                exchangeTransaction: {
                    initialized: true,                    
                }
            }
        case EXCHANGE_TRANSACTION.SUBMITTED:
            return {
                ...state,
                exchangeTransaction: {
                    ...state.exchangeTransaction,
                    transactionHash: action.payload,
                }
            }
        case EXCHANGE_TRANSACTION.ERROR:
            return {
                ...state,
                exchangeTransaction: {
                    ...state.exchangeTransaction,
                    error: action.payload
                }
            }
        case EXCHANGE_TRANSACTION.SUCCESS:
            return {
                ...state,
                exchangeTransaction: {
                    ...state.exchangeTransaction,
                    result: action.payload,
                    error: undefined
                }
            }
        case EXCHANGE_TRANSACTION.RESET:
            return {
                ...state,
                exchangeTransaction: {
                    ...initialState.exchangeTransaction
                }
            }
        case UPDATE_EXCHANGE_RATE:
            return {
                ...state,
                exchangeRate: action.payload
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
