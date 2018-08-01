import AOToken from 'ao-contracts/build/contracts/AOToken.json';
import AOTreasury from 'ao-contracts/build/contracts/AOTreasury.json';
import AOContent from 'ao-contracts/build/contracts/AOContent.json';
import debounce from 'debounce';
import { APP_STATES, updateAppState } from '../store/app.reducer';


// Constants
export const BLOCKS_PER_EVENT_GETTER = 10000
export const CONTRACTS_INITIALIZED = 'CONTRACTS_INITIALIZED'
export const SET_EVENTS_SINCE_BLOCK_NUMBER = 'SET_EVENTS_SINCE_BLOCK_NUMBER'
export const LATEST_BLOCK_NUMBER = 'LATEST_BLOCK_NUMBER'


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
                        reject(new Error(`Transaction failed`))
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
            if ( !AOToken.networks[networkId] || !AOTreasury.networks[networkId] || !AOContent.networks[networkId]) {
                // TODO: some sort of notification
                alert('Smart contracts have not been deployed on this network['+networkId+']')
                networkId = "1533066469022"  // TODO: remove (local testing)
            }
            console.log('Network id: ', networkId)
            const contracts = {
                aoToken: window.web3.eth.contract(AOToken.abi).at(AOToken.networks[networkId].address),
                aoTreasury: window.web3.eth.contract(AOTreasury.abi).at(AOTreasury.networks[networkId].address),
                aoContent: window.web3.eth.contract(AOContent.abi).at(AOContent.networks[networkId].address),
            }
            dispatch({
                type: CONTRACTS_INITIALIZED,
                payload: contracts
            })
            dispatch(updateAppState(APP_STATES.CONTRACTS_INITIALIZED, true))
            dispatch(watchBlockNumber())
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


// State
const initialState = {
    latestBlockNumber: 0,    
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
        default:
            return state
    }
}
