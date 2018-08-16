import BigNumber from 'bignumber.js'
import { waitForTransactionReceipt } from '../../../contracts/contracts.reducer'
import { denominations } from '../../../utils/denominations'
import { getEthBalanceForAccount, getTokenBalanceForAccount } from '../../wallet/reducers/wallet.reducer'
import { updateIcoState } from '../../ico/reducers/ico.reducer'


// Constants
export const EXCHANGE_TRANSACTION = Object.freeze({
    INITIALIZED: 'EXCHANGE_TRANSACTION.INITIALIZED',
    SUBMITTED: 'EXCHANGE_TRANSACTION.SUBMITTED',
    RESULT: 'EXCHANGE_TRANSACTION.RESULT',
    ERROR: 'EXCHANGE_TRANSACTION.ERROR',
    RESET: 'EXCHANGE_TRANSACTION.RESET',
})
export const UPDATE_EXCHANGE_RATE = 'UPDATE_EXCHANGE_RATE'
export const UPDATE_EXCHANGE_VALUES = 'UPDATE_EXCHANGE_VALUES'
export const UPDATE_EXCHANGE_DENOMINATION = 'UPDATE_EXCHANGE_DENOMINATION'


// Actions
export const purchaseTokens = ( baseAmount, exchangeRate ) => {
    return (dispatch, getState) => {
        const dispatchError = (err) => {
            dispatch({
                type: EXCHANGE_TRANSACTION.ERROR,
                payload: err
            })
        }
        const state = getState()
        const { app, contracts, electron, wallet } = state
        const ethCost = baseAmount.multipliedBy(exchangeRate)
        if ( !app.ethAddress ) {
            dispatchError(new Error('Unlock your ethereum account to purchase AO'))
        } else if ( wallet.ethBalance.lt( ethCost ) ) {
            dispatchError(new Error('Insufficient Eth balance'))
        } else {
            dispatch({type: EXCHANGE_TRANSACTION.INITIALIZED})
            if ( electron.isElectron ) {
                window.chrome.ipcRenderer.send('open-metamask-popup')
            }                
            contracts.aoToken.icoEnded(function(err, ended) {
                if ( err ) {
                    dispatchError(err)
                } else if ( ended ) {
                    dispatchError(new Error('The AO ICO has ended, you can no longer purchase AO tokens directly through the contract.'))
                } else {
                    const ethCostInWei = new BigNumber(window.web3.toWei(ethCost, 'ether'))                                                
                    contracts.aoToken.buyIcoToken.sendTransaction({
                        from: app.ethAddress,
                        value: ethCostInWei.toNumber()
                    }, function(err, transactionHash) {
                        if ( err ) {
                            dispatchError(err)
                        } else {
                            let eventListener = contracts.aoToken.LotCreation({lotOwner: app.ethAddress}, function(error, result) {
                                if ( result && result.transactionHash === transactionHash ) {
                                    dispatch({
                                        type: EXCHANGE_TRANSACTION.RESULT,
                                        payload: result.args
                                    })
                                    dispatch(getEthBalanceForAccount(app.ethAddress))
                                    dispatch(getTokenBalanceForAccount(app.ethAddress))
                                    dispatch(updateIcoState())
                                    eventListener.stopWatching()
                                }
                            })
                            dispatch({
                                type: EXCHANGE_TRANSACTION.SUBMITTED,
                                payload: transactionHash
                            })
                            waitForTransactionReceipt(transactionHash).catch(err => {
                                eventListener.stopWatching()
                                dispatchError(err)
                            })
                        }
                    })
                }
            })                
        }
    }
}

export const resetExchange = () => ({
    type: EXCHANGE_TRANSACTION.RESET
})

export const getExchangeRate = () => {
    return (dispatch, getState) => {
        const state = getState()
        const { contracts } = state
        contracts.aoToken.icoBuyPrice(function(err, result) {
            if ( result ) {
                dispatch({
                    type: UPDATE_EXCHANGE_RATE,
                    payload: new BigNumber(window.web3.fromWei(result, 'ether'))
                })
                // Update the exchangeAmountEth according to new exchange rate
                dispatch(updateTokenExchangeAmount(getState().exchange.exchangeAmountToken))
            }
        })
    }
}

export const updateTokenExchangeAmount = (tokenAmount) => {
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
    exchangeRate: new BigNumber(0),  // eth/AO
    exchangeAmountEth: new BigNumber(0),  // eth
    exchangeAmountToken: new BigNumber(Math.pow(10, 9)),  // 1 Giga AO
    exchangeDenomination: denominations[2],
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
        case EXCHANGE_TRANSACTION.RESULT:
            return {
                ...state,
                exchangeTransaction: {
                    ...state.exchangeTransaction,
                    result: action.payload,
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
        case UPDATE_EXCHANGE_DENOMINATION:
            return {
                ...state,
                ...action.payload,
            }        
        default:
            return state
    }
}
