/**
 * This reducer is for global app state
 */
import {
    getEthBalanceForAccount,
    getTokenBalanceForAccount
} from "../modules/wallet/reducers/wallet.reducer";
import {
    initializeContracts,
    waitForTransactionReceipt
} from "./contracts.reducer";

// Constants
export const WEB3_CONNECTED = "WEB3_CONNECTED";
export const WEB3_ETH_ACCOUNT_CHANGE = "WEB3_ETH_ACCOUNT_CHANGE";
export const UPDATE_APP_STATE = "UPDATE_APP_STATE";
export const APP_STATES = {
    APP_INITIALIZING: "APP_INITIALIZING",
    CORE_CONNECTED: "CORE_CONNECTED",
    CORE_READY: "CORE_READY",
    WEB3_AVAILABLE: "WEB3_AVAILABLE",
    WEB3_CONNECTED: "WEB3_CONNECTED",
    CONTRACTS_INITIALIZED: "CONTRACTS_INITIALIZED",
    APP_READY: "APP_READY"
};
export const SET_CORE_ETHEREUM_NETWORK_ID = "SET_CORE_ETHEREUM_NETWORK_ID";
export const AO_NAME_CHANGE = "AO_NAME_CHANGE";
export const AO_NAME_REGISTRATION_TRANSACTION = Object.freeze({
    INITIALIZED: "AO_NAME_REGISTRATION_TRANSACTION.INITIALIZED",
    SUBMITTED: "AO_NAME_REGISTRATION_TRANSACTION.SUBMITTED",
    RESULT: "AO_NAME_REGISTRATION_TRANSACTION.RESULT",
    ERROR: "AO_NAME_REGISTRATION_TRANSACTION.ERROR",
    RESET: "AO_NAME_REGISTRATION_TRANSACTION.RESET"
});

// Actions
export const updateAppState = (key, value) => ({
    type: UPDATE_APP_STATE,
    payload: { key, value }
});
export const setCoreEthNetworkId = coreEthNetworkId => ({
    type: SET_CORE_ETHEREUM_NETWORK_ID,
    payload: coreEthNetworkId
});
export const connectToWeb3 = networkId => {
    return (dispatch, getState) => {
        let networkName = getNetworkName(networkId, true);
        const networkLink = networkName
            ? `https://${networkName}.etherscan.io`
            : `https://etherscan.io`;
        dispatch({
            type: WEB3_CONNECTED,
            payload: {
                ethNetworkId: networkId,
                ethNetworkLink: networkLink
            }
        });
        dispatch(initializeContracts(networkId));
        // web3 interface is connected, lets listen for changes to the active/selected account
        const getCurrentAccount = () => {
            window.web3.eth.getAccounts((err, accounts) => {
                let { ethAddress } = getState().app;
                if (accounts && accounts[0] !== ethAddress) {
                    let account = accounts[0];
                    dispatch({
                        type: WEB3_ETH_ACCOUNT_CHANGE,
                        payload: { ethAddress: account }
                    });
                    if (account) {
                        dispatch(getEthBalanceForAccount(account));
                        dispatch(getTokenBalanceForAccount(account));
                        dispatch(getRegisteredNameByEthAddress(account));
                    }
                }
                // Poll for account change
                setTimeout(() => {
                    getCurrentAccount();
                }, 1000);
            });
        };
        getCurrentAccount();
    };
};
export const getNetworkName = (networkId, shortname = false) => {
    switch (networkId) {
        case 1:
        case "1":
            return shortname ? "" : "Main Ethereum Network";
        case 2:
        case "2":
            return shortname ? "" : "Ethereum Classic Test Network";
        case 3:
        case "3":
            return shortname ? "ropsten" : "Ropsten Test Network";
        case 4:
        case "4":
            return shortname ? "rinkeby" : "Rinkeby Network (Clique Consensus)";
        case 42:
        case "42":
            return shortname ? "kovan" : "Kovan Network (Proof of Authority)";
        case null:
        case undefined:
            return shortname ? "" : "(Not connected)";
        default:
            return shortname ? "" : `Unkown Network (id:${networkId})`;
    }
};
export const getRegisteredNameByEthAddress = ethAddress => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            if (!ethAddress)
                return reject(
                    new Error("getRegisteredName called without an ethAddress")
                );
            const { contracts } = getState();
            contracts.nameFactory.ethAddressToNameId(ethAddress, function(
                err,
                result
            ) {
                if (err) return reject(err);
                const nameId =
                    result === "0x0000000000000000000000000000000000000000"
                        ? undefined
                        : result;
                if (!nameId) {
                    dispatch({
                        type: AO_NAME_CHANGE,
                        payload: undefined
                    });
                } else {
                    // Fetch the name details (including name)
                    contracts.nameFactory.getName(nameId, function(
                        err,
                        result
                    ) {
                        if (err) return reject(err);
                        dispatch({
                            type: AO_NAME_CHANGE,
                            payload: {
                                nameId,
                                name: result[0],
                                originId: result[1],
                                datHash: result[2],
                                database: result[3],
                                keyValue: result[4],
                                contentId: result[5],
                                typeId: result[6]
                            }
                        });
                    });
                }
            });
        });
    };
};
export const registerNameUnderEthAddress = ({ name, ethAddress }) => {
    return (dispatch, getState) => {
        const { contracts } = getState();
        dispatch({
            type: AO_NAME_REGISTRATION_TRANSACTION.INITIALIZED
        });
        // 0. name validation
        const validUsername = /^[a-zA-Z0-9_-]{3,20}$/.test(name);
        console.log(validUsername, name);
        if (!validUsername) {
            dispatch({
                type: AO_NAME_REGISTRATION_TRANSACTION.ERROR,
                payload: new Error(
                    `validation requirements: 3-20 characters, no spaces, hyphen and underscores allowed`
                )
            });
            return null;
        }
        // 1. Check that the name does not exist already
        contracts.nameTAOLookup.isExist(name, function(err, doesExist) {
            if (err) {
                dispatch({
                    type: AO_NAME_REGISTRATION_TRANSACTION.ERROR,
                    payload: err
                });
            } else if (doesExist) {
                dispatch({
                    type: AO_NAME_REGISTRATION_TRANSACTION.ERROR,
                    payload: new Error(`Name is already registered`)
                });
            } else {
                // 2. Submit the name
                contracts.nameFactory.createName(
                    name,
                    "",
                    "",
                    "",
                    "",
                    {
                        from: ethAddress
                    },
                    function(err, transactionHash) {
                        if (err) {
                            dispatch({
                                type: AO_NAME_REGISTRATION_TRANSACTION.ERROR,
                                payload: err
                            });
                            return null;
                        }
                        dispatch({
                            type: AO_NAME_REGISTRATION_TRANSACTION.SUBMITTED,
                            payload: transactionHash
                        });
                        // 3. Wait for tx to resolve
                        waitForTransactionReceipt(transactionHash)
                            .then(() => {
                                // 4. Tx complete, query for nameId
                                dispatch(
                                    getRegisteredNameByEthAddress(ethAddress)
                                )
                                    .then(nameObject => {
                                        dispatch({
                                            type:
                                                AO_NAME_REGISTRATION_TRANSACTION.RESULT,
                                            payload: nameObject
                                        });
                                    })
                                    .catch(err => {
                                        dispatch({
                                            type:
                                                AO_NAME_REGISTRATION_TRANSACTION.ERROR,
                                            payload: err
                                        });
                                    });
                            })
                            .catch(err => {
                                dispatch({
                                    type:
                                        AO_NAME_REGISTRATION_TRANSACTION.ERROR,
                                    payload: err
                                });
                            });
                    }
                );
            }
        });
    };
};

// State
const initialState = {
    states: {
        [APP_STATES.APP_INITIALIZING]: true,
        [APP_STATES.CORE_CONNECTED]: false,
        [APP_STATES.CORE_READY]: false,
        [APP_STATES.WEB3_AVAILABLE]: false,
        [APP_STATES.WEB3_CONNECTED]: false,
        [APP_STATES.CONTRACTS_INITIALIZED]: false,
        [APP_STATES.APP_READY]: false
    },
    ethNetworkId: undefined,
    ethNetworkLink: "https://etherscan.io",
    ethAddress: undefined,
    aoName: undefined,
    aoNameRegistrationState: {
        initialized: undefined,
        transactionHash: undefined,
        result: undefined,
        error: undefined
    }
};
export type AppReducerType = {
    state: {
        [key: string]: boolean
    },
    ethNetworkId?: string | number,
    ethNetworkLink?: string,
    ethAddress?: string,
    aoName?: {
        id: string,
        name: string,
        originId: string,
        datHash: string,
        database: string,
        keyValue: string,
        contentId: string,
        typeId: string
    },
    aoNameRegistrationState: {
        initialized: boolean,
        transactionHash: string,
        result: any,
        error: any
    },
    coreEthNetworkId?: string
};

// Reducer
export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case WEB3_CONNECTED:
            return {
                ...state,
                ethNetworkId: action.payload.ethNetworkId,
                ethNetworkLink: action.payload.ethNetworkLink,
                states: {
                    ...state.states,
                    [APP_STATES.WEB3_CONNECTED]: true
                }
            };
        case WEB3_ETH_ACCOUNT_CHANGE:
            return {
                ...state,
                ethAddress: action.payload.ethAddress
            };
        case UPDATE_APP_STATE:
            return {
                ...state,
                states: {
                    ...state.states,
                    [action.payload.key]: action.payload.value
                }
            };
        case SET_CORE_ETHEREUM_NETWORK_ID:
            return {
                ...state,
                coreEthNetworkId: action.payload
            };
        case AO_NAME_CHANGE:
            return {
                ...state,
                aoName: action.payload
            };
        case AO_NAME_REGISTRATION_TRANSACTION.INITIALIZED:
            return {
                ...state,
                aoNameRegistrationState: {
                    initialized: true
                }
            };
        case AO_NAME_REGISTRATION_TRANSACTION.SUBMITTED:
            return {
                ...state,
                aoNameRegistrationState: {
                    ...state.aoNameRegistrationState,
                    transactionHash: action.payload
                }
            };
        case AO_NAME_REGISTRATION_TRANSACTION.RESULT:
            return {
                ...state,
                aoNameRegistrationState: {
                    ...state.aoNameRegistrationState,
                    result: action.payload
                }
            };
        case AO_NAME_REGISTRATION_TRANSACTION.ERROR:
            return {
                ...state,
                aoNameRegistrationState: {
                    ...state.aoNameRegistrationState,
                    error: action.payload
                }
            };
        case AO_NAME_REGISTRATION_TRANSACTION.RESET:
            return {
                ...state,
                aoNameRegistrationState: {
                    ...initialState.aoNameRegistrationState
                }
            };
        default:
            return state;
    }
}
