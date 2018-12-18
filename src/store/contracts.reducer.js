import AOToken from 'ao-contracts/build/contracts/AOToken.json';
import AOTreasury from 'ao-contracts/build/contracts/AOTreasury.json';
import AOContent from 'ao-contracts/build/contracts/AOContent.json';
import AOEarning from 'ao-contracts/build/contracts/AOEarning.json';
import AOLibrary from 'ao-contracts/build/contracts/AOLibrary.json';
import AOPool from 'ao-contracts/build/contracts/AOPool.json';
import AOSetting from 'ao-contracts/build/contracts/AOSetting.json';
import debounce from 'debounce';
import { APP_STATES, updateAppState, getNetworkName } from './app.reducer';
import { updateIcoState } from '../modules/ico/reducers/ico.reducer';
import { addNotification } from '../modules/notifications/reducers/notifications.reducer'


// Constants
export const BLOCKS_PER_EVENT_GETTER = 10000
export const CONTRACTS_INITIALIZED = 'CONTRACTS_INITIALIZED'
export const SET_EVENTS_SINCE_BLOCK_NUMBER = 'SET_EVENTS_SINCE_BLOCK_NUMBER'
export const LATEST_BLOCK_NUMBER = 'LATEST_BLOCK_NUMBER'
export const UPDATE_CONTRACT_SETTINGS = 'UPDATE_CONTRACT_SETTINGS'


export const waitForTransactionReceipt = (transactionHash) => {
    return new Promise((resolve, reject) => {
        const filter = window.web3.eth.filter('latest')
        filter.watch((error, result) => {
            window.web3.eth.getTransactionReceipt(transactionHash, (error, receipt) => {
                if ( error ) {
                    reject(error)
                } else if ( receipt ) {
                    filter.stopWatching()
                    // The TX has been added to the chain, now determine status
                    if ( receipt.status === '0x0' ) {
                        console.log(receipt)
                        let error = new Error(`Transaction failed`)
                        reject(error)
                    } else {
                        resolve()
                    }
                } else {
                    // no error and no receipt found on this block, keep listening
                }
            })
        })
    })
}

// Actions
export const initializeContracts = (networkId) => {
    return (dispatch, getState) => {
        try {
            if ( 
                !AOToken.networks[networkId] ||
                !AOTreasury.networks[networkId] ||
                !AOContent.networks[networkId] ||
                !AOEarning.networks[networkId] ||
                !AOLibrary.networks[networkId] ||
                !AOPool.networks[networkId] ||
                !AOSetting.networks[networkId]
            ) {
                console.warn('Smart contracts have not been deployed on this network['+networkId+']')
                dispatch(updateAppState(APP_STATES.CONTRACTS_INITIALIZED, false))
                const networkIds = Object.keys(AOToken.networks).map(networkId => getNetworkName(networkId)).join(', ')
                dispatch(addNotification({
                    message: `The Ethereum network you selected is not supported. Avialable networks: ${networkIds}`
                }))
            } else {
                const contracts = {
                    aoToken: window.web3.eth.contract(AOToken.abi).at(AOToken.networks[networkId].address),
                    aoTreasury: window.web3.eth.contract(AOTreasury.abi).at(AOTreasury.networks[networkId].address),
                    aoContent: window.web3.eth.contract(AOContent.abi).at(AOContent.networks[networkId].address),
                    aoEarning: window.web3.eth.contract(AOEarning.abi).at(AOEarning.networks[networkId].address),
                    aoLibrary: window.web3.eth.contract(AOLibrary.abi).at(AOLibrary.networks[networkId].address),
                    aoPool: window.web3.eth.contract(AOPool.abi).at(AOPool.networks[networkId].address),
                    aoSetting: window.web3.eth.contract(AOSetting.abi).at(AOSetting.networks[networkId].address),
                }
                dispatch({
                    type: CONTRACTS_INITIALIZED,
                    payload: contracts
                })
                dispatch(updateAppState(APP_STATES.CONTRACTS_INITIALIZED, true))
                dispatch(watchBlockNumber())
                dispatch(updateIcoState())
                dispatch(fetchSettingsFromContract())
            }
        } catch ( error ) {
            console.error('Error initializing contracts', error)
        }
    }
}

const watchBlockNumber = () => {
    return (dispatch, getState) => {
        const update = (error, result) => {
            if ( !error ) {
                window.web3.eth.getBlock(result, (error, block) => {
                    if ( !error ) {
                        // For consistency, we update all the game stats *every* block number!
                        dispatch({type: LATEST_BLOCK_NUMBER, payload: block.number})
                    } else {
                        console.error('Error calling getBlockNumber', error)
                    }
                })
            }
        }
        const debouncedUpdate = debounce(update, 750)
        var filter = window.web3.eth.filter('latest')
        filter.watch(debouncedUpdate)
    }
}

const fetchSettingsFromContract = () => {
    return (dispatch, getState) => {
        const { contracts } = getState()
        let settingsPromises = []
        let ingressUrlPromise = new Promise((resolve, reject) => {
            contracts.aoSetting.getSettingValuesByThoughtName('0x939b070c66152b3e7efb52ec631d680270ce14c4', 'ingressUrl', function(err, settingsValue) {
                if (err) { reject(err) } else { resolve(settingsValue[4]) }
            })
        })
        let aoUrlPromise = new Promise((resolve, reject) => {
            contracts.aoSetting.getSettingValuesByThoughtName('0x939b070c66152b3e7efb52ec631d680270ce14c4', 'aoUrl', function(err, settingsValue) {
                if (err) { reject(err) } else { resolve(settingsValue[4]) }
            })
        })        
        Promise.all([ingressUrlPromise, aoUrlPromise]).then(settings => {
            dispatch({
                type: UPDATE_CONTRACT_SETTINGS,
                payload: {
                    ingressUrl: settings[0],
                    aoUrl: settings[1],
                }
            })
        }).catch(error => {
            dispatch(addNotification({
                message: `Error fetching latest AO settings from contracts: ${error.message}`,
                variant: 'warning',
            }))
        })
    }
}


// State
const initialState = {
    latestBlockNumber: 0,
    settings: {
        aoUrl: undefined,
        ingressUrl: undefined,
    }    
}

// Reducer
export default function contractsReducer(state = initialState, action) {
    switch (action.type) {
        case CONTRACTS_INITIALIZED:
            return {
                ...state,
                ...action.payload,
            }        
        case LATEST_BLOCK_NUMBER:
            return {
                ...state,
                latestBlockNumber: action.payload
            }
        case UPDATE_CONTRACT_SETTINGS:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    ...action.payload,
                }
            }
        default:
            return state
    }
}
