/**
 * This reducer is for global app state
 */
import { getEthBalanceForAccount, getTokenBalanceForAccount } from '../modules/wallet/reducers/wallet.reducer'
import { initializeContracts } from '../contracts/contracts.reducer'


// Constants
export const WEB3_CONNECTED = 'WEB3_CONNECTED'
export const WEB3_ETH_ACCOUNT_CHANGE = 'WEB3_ETH_ACCOUNT_CHANGE'
export const UPDATE_APP_STATE = 'UPDATE_APP_STATE'
export const APP_STATES = {
    APP_INITIALIZING: 'APP_INITIALIZING',
    CORE_CONNECTED: 'CORE_CONNECTED',
    CORE_READY: 'CORE_READY',
    WEB3_AVAILABLE: 'WEB3_AVAILABLE',
    WEB3_CONNECTED: 'WEB3_CONNECTED',
    CONTRACTS_INITIALIZED: 'CONTRACTS_INITIALIZED',
    APP_READY: 'APP_READY',
}


// Actions
export const updateAppState = (key, value) => ({
    type: UPDATE_APP_STATE,
    payload: { key, value }
})
export const connectToWeb3 = (networkId) => {
    return (dispatch, getState) => {
        let networkName = getNetworkName( networkId, true )
        const networkLink = networkName ? `https://${networkName}.etherscan.io` : `https://etherscan.io`
        dispatch({
            type: WEB3_CONNECTED,
            payload: {
                ethNetworkId: networkId,
                ethNetworkLink: networkLink,
            }
        })
        dispatch(initializeContracts(networkId))
        // web3 interface is connected, lets listen for changes to the active/selected account
        const getCurrentAccount = () => {
            window.web3.eth.getAccounts((err, accounts) => {
                let { ethAddress } = getState().app
                if (accounts && accounts[0] !== ethAddress) {
                    let account = accounts[0]
                    dispatch({type: WEB3_ETH_ACCOUNT_CHANGE, payload: { ethAddress: account }})
                    if ( account ) {
                        dispatch(getEthBalanceForAccount(account))
                        dispatch(getTokenBalanceForAccount(account))
                    }
                }
                // Poll for account change
                setTimeout(() => {
                    getCurrentAccount()
                }, 1000)
            })
        }
        getCurrentAccount()
    }
}
export const getNetworkName = (networkId, shortname = false) => {
    switch (networkId) {
        case 1:
        case "1":
            return shortname ? "" : "Main Ethereum Network"
        case 2:
        case "2":
            return shortname ? "" : "Ethereum Classic Test Network"
        case 3:
        case "3":
            return shortname ? "ropsten" : "Ropsten Test Network"
        case 4:
        case "4":
            return shortname ? "rinkeby" : "Rinkeby Network (Clique Consensus)"
        case 42:
        case "42":
            return shortname ? "kovan" : "Kovan Network (Proof of Authority)"
        case null:
        case undefined:
            return shortname ? "" : "(Not connected)"
        default:
            return shortname ? "" : "Unkown Network"
    }
}

// State
const initialState = {
    states: {
        [APP_STATES.APP_INITIALIZING]: true,
        [APP_STATES.CORE_CONNECTED]: false,
        [APP_STATES.CORE_READY]: false,
        [APP_STATES.WEB3_AVAILABLE]: false,
        [APP_STATES.WEB3_CONNECTED]: false,
        [APP_STATES.CONTRACTS_INITIALIZED]: false,
        [APP_STATES.APP_READY]: false,
    },
    ethNetworkId: undefined,
    ethNetworkLink: 'https://etherscan.io',
    ethAddress: undefined,
}
export type AppReducerType = {
    state: {
        [key: string]: boolean
    },
    ethNetworkId?: string | number,
    ethNetworkLink?: string,
    ethAddress?: string,
}

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
            }
        case WEB3_ETH_ACCOUNT_CHANGE:
            return {
                ...state,
                ethAddress: action.payload.ethAddress
            }
        case UPDATE_APP_STATE:
            return {
                ...state,
                states: {
                    ...state.states,
                    [action.payload.key]: action.payload.value
                }
            }
        default:
            return state
    }
}
