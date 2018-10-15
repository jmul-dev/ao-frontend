import BigNumber from 'bignumber.js'
import { waitForTransactionReceipt } from '../../../contracts/contracts.reducer'
import { denominations } from '../../../utils/denominations'
import { getEthBalanceForAccount, getTokenBalanceForAccount } from '../../wallet/reducers/wallet.reducer'
import { updateIcoState } from '../../ico/reducers/ico.reducer'
import { triggerMetamaskPopupWithinElectron } from '../../../utils/electron';


// Constants
export const EXCHANGE_TRANSACTION = Object.freeze({
    INITIALIZED: 'EXCHANGE_TRANSACTION.INITIALIZED',
    SUBMITTED: 'EXCHANGE_TRANSACTION.SUBMITTED',
    RESULT: 'EXCHANGE_TRANSACTION.RESULT',
    ERROR: 'EXCHANGE_TRANSACTION.ERROR',
    RESET: 'EXCHANGE_TRANSACTION.RESET',
})
export const UPDATE_EXCHANGE_RATE = 'UPDATE_EXCHANGE_RATE'
export const UPDATE_EXCHANGE_DENOMINATION = 'UPDATE_EXCHANGE_DENOMINATION'


// Actions
export const exchangeEthForPrimordialTokens = (ethCost) => {
    return (dispatch, getState) => {
        const dispatchError = (err) => {
            dispatch({
                type: EXCHANGE_TRANSACTION.ERROR,
                payload: err
            })
        }
        const state = getState()
        const { app, contracts, wallet } = state
        if ( !app.ethAddress ) {
            dispatchError(new Error('Unlock your ethereum account to purchase AO'))
        } else if ( wallet.ethBalance.lt( ethCost ) ) {
            dispatchError(new Error('Insufficient Eth balance'))
        } else {
            dispatch({type: EXCHANGE_TRANSACTION.INITIALIZED})
            triggerMetamaskPopupWithinElectron(getState)
            contracts.aoToken.networkExchangeEnded(function(err, ended) {
                if ( err ) {
                    dispatchError(err)
                } else if ( ended ) {
                    dispatchError(new Error('The AO ICO has ended, you can no longer purchase AO tokens directly through the contract.'))
                } else {
                    console.log(ethCost)
                    const ethCostInWei = new BigNumber(window.web3.toWei(ethCost, 'ether'));
                    console.log(ethCostInWei.toNumber())
                    contracts.aoToken.buyPrimordialToken({
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
export const exchangeEthForNetworkTokens = (ethCost) => {
    return (dispatch, getState) => {
        const dispatchError = (err) => {
            dispatch({
                type: EXCHANGE_TRANSACTION.ERROR,
                payload: err
            })
        }
        const state = getState()
        const { app, contracts, wallet } = state
        if ( !app.ethAddress ) {
            dispatchError(new Error('Unlock your ethereum account to purchase AO'))
        } else if ( wallet.ethBalance.lt( ethCost ) ) {
            dispatchError(new Error('Insufficient Eth balance'))
        } else {
            dispatch({type: EXCHANGE_TRANSACTION.INITIALIZED})
            triggerMetamaskPopupWithinElectron(getState)
            // TODO
            // contracts.aoToken.networkExchangeEnded(function(err, ended) {
            //     if ( err ) {
            //         dispatchError(err)
            //     } else if ( ended ) {
            //         dispatchError(new Error('The AO ICO has ended, you can no longer purchase AO tokens directly through the contract.'))
            //     } else {
            //         console.log(ethCost)
            //         const ethCostInWei = new BigNumber(window.web3.toWei(ethCost, 'ether'));
            //         console.log(ethCostInWei.toNumber())
            //         contracts.aoToken.buyPrimordialToken({
            //             from: app.ethAddress,
            //             value: ethCostInWei.toNumber()
            //         }, function(err, transactionHash) {
            //             if ( err ) {
            //                 dispatchError(err)
            //             } else {
            //                 let eventListener = contracts.aoToken.LotCreation({lotOwner: app.ethAddress}, function(error, result) {
            //                     if ( result && result.transactionHash === transactionHash ) {
            //                         dispatch({
            //                             type: EXCHANGE_TRANSACTION.RESULT,
            //                             payload: result.args
            //                         })
            //                         dispatch(getEthBalanceForAccount(app.ethAddress))
            //                         dispatch(getTokenBalanceForAccount(app.ethAddress))
            //                         dispatch(updateIcoState())
            //                         eventListener.stopWatching()
            //                     }
            //                 })
            //                 dispatch({
            //                     type: EXCHANGE_TRANSACTION.SUBMITTED,
            //                     payload: transactionHash
            //                 })
            //                 waitForTransactionReceipt(transactionHash).catch(err => {
            //                     eventListener.stopWatching()
            //                     dispatchError(err)
            //                 })
            //             }
            //         })
            //     }
            // })                
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
        if ( !contracts.aoToken )
            return console.warn(`Attempting to call contract method before contract initialization`)
        // TODO: also fetch network token exchange rate
        contracts.aoToken.primordialBuyPrice(function(err, result) {
            if ( result ) {
                dispatch({
                    type: UPDATE_EXCHANGE_RATE,
                    payload: {
                        primordialExchangeRate: new BigNumber(window.web3.fromWei(result, 'ether'))
                    }
                })
            }
        })
    }
}

// State
const initialState = {   
    primordialExchangeRate: new BigNumber(0),  // eth/AO+
    networkExchangeRate: new BigNumber(0), // eth/AO
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
                primordialExchangeRate: action.payload.primordialExchangeRate,
                networkExchangeRate: action.payload.networkExchangeRate,
            }
        case UPDATE_EXCHANGE_DENOMINATION:
            return {
                ...state,
                ...action.payload,
            }        
        default:
            return state
    }
}
