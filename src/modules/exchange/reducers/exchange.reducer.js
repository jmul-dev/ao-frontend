/**
 * Sorry for any confusion, but the following reducer is accounting
 * for two types of exchanges (both AO+ and regular AO). These exchanges
 * occur through very different mechanisms.
 */
import BigNumber from "bignumber.js";
import { waitForTransactionReceipt } from "../../../store/contracts.reducer";
import { triggerMetamaskPopupWithinElectron } from "../../../utils/electron";
import { updateIcoState } from "../../ico/reducers/ico.reducer";
import {
    getEthBalanceForAccount,
    getTokenBalanceForAccount
} from "../../wallet/reducers/wallet.reducer";

// Constants
export const EXCHANGE_TRANSACTION = Object.freeze({
    INITIALIZED: "EXCHANGE_TRANSACTION.INITIALIZED",
    SUBMITTED: "EXCHANGE_TRANSACTION.SUBMITTED",
    RESULT: "EXCHANGE_TRANSACTION.RESULT",
    ERROR: "EXCHANGE_TRANSACTION.ERROR",
    RESET: "EXCHANGE_TRANSACTION.RESET"
});
export const UPDATE_EXCHANGE_RATE = "UPDATE_EXCHANGE_RATE";
export const UPDATE_EXCHANGE_DENOMINATION = "UPDATE_EXCHANGE_DENOMINATION";
export const SET_CREATE_POOL_EVENT = "SET_CREATE_POOL_EVENT";
export const CREATE_POOL_EVENT_RECEIVED = "CREATE_POOL_EVENT_RECEIVED";
export const ADD_EXCHANGE_POOL = "ADD_EXCHANGE_POOL";
export const UPDATE_TOKEN_EXCHANGE_AMOUNT = "UPDATE_TOKEN_EXCHANGE_AMOUNT";

// Actions
export const exchangeEthForPrimordialTokens = ethCost => {
    return (dispatch, getState) => {
        const dispatchError = err => {
            dispatch({
                type: EXCHANGE_TRANSACTION.ERROR,
                payload: err
            });
        };
        const state = getState();
        const { app, contracts, wallet } = state;
        if (!app.ethAddress) {
            dispatchError(
                new Error("Unlock your ethereum account to purchase AO")
            );
        } else if (wallet.ethBalance.lt(ethCost)) {
            dispatchError(new Error("Insufficient Eth balance"));
        } else {
            dispatch({ type: EXCHANGE_TRANSACTION.INITIALIZED });
            triggerMetamaskPopupWithinElectron(getState);
            contracts.aoIon.networkExchangeEnded(function(err, ended) {
                if (err) {
                    dispatchError(err);
                } else if (ended) {
                    dispatchError(
                        new Error(
                            "The AO ICO has ended, you can no longer purchase AO tokens directly through the contract."
                        )
                    );
                } else {
                    console.log(ethCost);
                    const ethCostInWei = new BigNumber(
                        window.web3.toWei(ethCost, "ether")
                    );
                    console.log(ethCostInWei.toNumber());
                    contracts.aoIon.buyPrimordial(
                        {
                            from: app.ethAddress,
                            value: ethCostInWei.toNumber()
                        },
                        function(err, transactionHash) {
                            if (err) {
                                dispatchError(err);
                            } else {
                                let eventListener = contracts.aoIonLot.LotCreation(
                                    { lotOwner: app.ethAddress },
                                    function(error, result) {
                                        if (
                                            result &&
                                            result.transactionHash ===
                                                transactionHash
                                        ) {
                                            dispatch({
                                                type:
                                                    EXCHANGE_TRANSACTION.RESULT,
                                                payload: result.args
                                            });
                                            dispatch(
                                                getEthBalanceForAccount(
                                                    app.ethAddress
                                                )
                                            );
                                            dispatch(
                                                getTokenBalanceForAccount(
                                                    app.ethAddress
                                                )
                                            );
                                            dispatch(updateIcoState());
                                            eventListener.stopWatching();
                                        }
                                    }
                                );
                                dispatch({
                                    type: EXCHANGE_TRANSACTION.SUBMITTED,
                                    payload: transactionHash
                                });
                                waitForTransactionReceipt(
                                    transactionHash
                                ).catch(err => {
                                    eventListener.stopWatching();
                                    dispatchError(err);
                                });
                            }
                        }
                    );
                }
            });
        }
    };
};
export const exchangeEthForNetworkTokens = ({
    ethCost,
    poolId,
    poolPrice,
    tokenAmount
}) => {
    return (dispatch, getState) => {
        const dispatchError = err => {
            dispatch({
                type: EXCHANGE_TRANSACTION.ERROR,
                payload: err
            });
        };
        const state = getState();
        const { app, contracts, wallet } = state;
        if (!app.ethAddress) {
            dispatchError(
                new Error("Unlock your ethereum account to purchase AO")
            );
        } else if (wallet.ethBalance.lt(ethCost)) {
            dispatchError(new Error("Insufficient Eth balance"));
        } else {
            dispatch({ type: EXCHANGE_TRANSACTION.INITIALIZED });
            triggerMetamaskPopupWithinElectron(getState);
            const ethCostInWei = new BigNumber(
                window.web3.toWei(ethCost, "ether")
            );
            console.log(state.exchange.exchangePools[poolId]);
            console.log(
                `tokenAmount[${tokenAmount.toString()}] x poolPrice[${poolPrice.toString()}] = [${tokenAmount
                    .multipliedBy(poolPrice)
                    .toString()}], ethCostInWei[${ethCostInWei.toString()}]`
            );
            contracts.aoPool.buyWithEth(
                poolId,
                tokenAmount.toString(),
                poolPrice.toString(),
                {
                    from: app.ethAddress,
                    value: ethCostInWei.toNumber()
                },
                (err, transactionHash) => {
                    if (err) {
                        dispatchError(err);
                    } else {
                        let eventListener = contracts.aoPool.BuyWithEth(
                            { poolId: poolId },
                            (error, result) => {
                                if (
                                    result &&
                                    result.transactionHash === transactionHash
                                ) {
                                    dispatch({
                                        type: EXCHANGE_TRANSACTION.RESULT,
                                        payload: result.args
                                    });
                                    dispatch(
                                        getEthBalanceForAccount(app.ethAddress)
                                    );
                                    dispatch(
                                        getTokenBalanceForAccount(
                                            app.ethAddress
                                        )
                                    );
                                    dispatch(updateExchangePool(poolId));
                                    eventListener.stopWatching();
                                }
                            }
                        );
                        dispatch({
                            type: EXCHANGE_TRANSACTION.SUBMITTED,
                            payload: transactionHash
                        });
                        waitForTransactionReceipt(transactionHash).catch(
                            err => {
                                eventListener.stopWatching();
                                dispatchError(err);
                            }
                        );
                    }
                }
            );
        }
    };
};
export const listenForAvailableExchangePools = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { contracts, exchange } = state;
        let createPoolEvent = exchange.createPoolEvent;
        if (!createPoolEvent) {
            createPoolEvent = contracts.aoPool.CreatePool(
                {},
                { fromBlock: 0, toBlock: "latest" }
            );
            dispatch({
                type: SET_CREATE_POOL_EVENT,
                payload: createPoolEvent
            });
        }
        createPoolEvent.watch((error, poolEvent) => {
            if (poolEvent) {
                // CreatePool event does not have the live state of that pool,
                // so we are making an additional query for that info
                const poolId = new BigNumber(poolEvent.args.poolId).toString();
                // 1. Fetch pool status, need to ensure it is active
                contracts.aoPool.pools(poolId, (error, pool) => {
                    if (!error && pool[1] === true) {
                        // pool[1] = pool status
                        // 2. Fetch total AO available in this pool
                        contracts.aoPool.poolTotalQuantity(
                            poolId,
                            (error, poolTotalQuantity) => {
                                if (!error) {
                                    dispatch({
                                        type: ADD_EXCHANGE_POOL,
                                        payload: {
                                            poolId,
                                            price: new BigNumber(
                                                poolEvent.args.price
                                            ), // eth/AO?
                                            totalQuantityAvailable: new BigNumber(
                                                poolTotalQuantity
                                            )
                                        }
                                    });
                                }
                            }
                        );
                    }
                });
            }
        });
    };
};
export const stopListeningForAvailableExchangePools = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { exchange } = state;
        if (exchange.createPoolEvent) {
            exchange.createPoolEvent.stopWatching();
            dispatch({
                type: SET_CREATE_POOL_EVENT,
                payload: undefined
            });
        }
    };
};
const updateExchangePool = poolId => {
    return (dispatch, getState) => {
        const state = getState();
        const { contracts } = state;
        contracts.aoPool.pools(poolId, (error, poolStats) => {
            if (poolStats) {
                contracts.aoPool.poolTotalQuantity(
                    poolId,
                    (error, poolTotalQuantity) => {
                        if (poolTotalQuantity) {
                            let pool = {
                                poolId: poolId,
                                price: new BigNumber(poolStats[0]), // eth/AO?
                                totalQuantityAvailable: new BigNumber(
                                    poolTotalQuantity
                                )
                            };
                            dispatch({
                                type: ADD_EXCHANGE_POOL,
                                payload: pool
                            });
                        }
                    }
                );
            }
        });
    };
};
export const updateCurrentExchangeAmountInBaseAo = tokenAmount => ({
    type: UPDATE_TOKEN_EXCHANGE_AMOUNT,
    payload: tokenAmount
});
export const resetExchange = () => ({
    type: EXCHANGE_TRANSACTION.RESET
});
export const getPrimordialExchangeRate = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { contracts } = state;
        if (!contracts.aoIon)
            return console.warn(
                `Attempting to call contract method before contract initialization`
            );
        // TODO: also fetch network token exchange rate
        contracts.aoIon.primordialBuyPrice(function(err, result) {
            if (result) {
                dispatch({
                    type: UPDATE_EXCHANGE_RATE,
                    payload: {
                        primordialExchangeRate: new BigNumber(
                            window.web3.fromWei(result, "ether")
                        )
                    }
                });
            }
        });
    };
};

// State
const initialState = {
    primordialExchangeRate: new BigNumber(0), // eth/AO+
    networkExchangeRate: new BigNumber(0), // eth/AO
    exchangeTransaction: {
        initialized: undefined,
        transactionHash: undefined,
        result: undefined,
        error: undefined
    },
    exchangeAmountInBaseAo: new BigNumber(0),
    // AOPool exchange functionality
    exchangePools: {
        /* poolId => Pool(poolId, price, totalQuantityAvailable) */
    },
    createPoolEvent: undefined // web3.contract.Event
};

// Reducer
export default function walletReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_TOKEN_EXCHANGE_AMOUNT:
            return {
                ...state,
                exchangeAmountInBaseAo: action.payload
            };
        case SET_CREATE_POOL_EVENT:
            return {
                ...state,
                createPoolEvent: action.payload
            };
        case ADD_EXCHANGE_POOL:
            return {
                ...state,
                exchangePools: {
                    ...state.exchangePools,
                    [action.payload.poolId]: action.payload
                }
            };
        case EXCHANGE_TRANSACTION.INITIALIZED:
            return {
                ...state,
                exchangeTransaction: {
                    initialized: true
                }
            };
        case EXCHANGE_TRANSACTION.SUBMITTED:
            return {
                ...state,
                exchangeTransaction: {
                    ...state.exchangeTransaction,
                    transactionHash: action.payload
                }
            };
        case EXCHANGE_TRANSACTION.RESULT:
            return {
                ...state,
                exchangeTransaction: {
                    ...state.exchangeTransaction,
                    result: action.payload
                }
            };
        case EXCHANGE_TRANSACTION.ERROR:
            return {
                ...state,
                exchangeTransaction: {
                    ...state.exchangeTransaction,
                    error: action.payload
                }
            };
        case EXCHANGE_TRANSACTION.RESET:
            return {
                ...state,
                exchangeTransaction: {
                    ...initialState.exchangeTransaction
                }
            };
        case UPDATE_EXCHANGE_RATE:
            return {
                ...state,
                primordialExchangeRate: action.payload.primordialExchangeRate,
                networkExchangeRate: action.payload.networkExchangeRate
            };
        case UPDATE_EXCHANGE_DENOMINATION:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
