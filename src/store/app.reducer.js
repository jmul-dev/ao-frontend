/**
 * This reducer is for global app state
 */
import BigNumber from 'bignumber.js'
import { getEthBalanceForAccount } from '../modules/wallet/reducers/wallet.reducer'

// Constants
export const WEB3_CONNECTED = 'WEB3_CONNECTED'
export const WEB3_ETH_ACCOUNT_CHANGE = 'WEB3_ETH_ACCOUNT_CHANGE'

// Actions
export const connectedToNetwork = (networkId) => {
    return (dispatch, getState) => {
        let networkName = getNetworkName( networkId, true )
        const networkLink = networkName ? `https://${networkName}.etherscan.io` : `https://etherscan.io`
        dispatch({
            type: WEB3_CONNECTED,
            payload: {
                ethNetworkId: networkId,
                ethNetworkLink: networkLink,
                web3Connected: true,
            }
        })
        // web3 interface is connected, lets listen for changes to the active/selected account
        const getCurrentAccount = () => {
            window.web3.eth.getAccounts((err, accounts) => {
                let { ethAddress } = getState().app
                if (accounts && accounts[0] !== ethAddress) {
                    let account = accounts[0]
                    dispatch({type: WEB3_ETH_ACCOUNT_CHANGE, payload: { ethAddress: account }})
                    if ( account ) {
                        dispatch(getEthBalanceForAccount(account))
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
    web3Available: false,
    web3Connected: false,    
    ethNetworkId: undefined,
    ethNetworkLink: 'https://etherscan.io',
    ethAddress: undefined,
}
export type AppReducerType = {
    web3Available: boolean,
    web3Connected: boolean,    
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
                ...action.payload,
            }
        case WEB3_ETH_ACCOUNT_CHANGE:
            return {
                ...state,
                ethAddress: action.payload.ethAddress
            }
        default:
            return state
    }
}
