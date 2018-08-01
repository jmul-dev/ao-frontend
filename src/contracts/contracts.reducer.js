import AOToken from 'ao-contracts/build/contracts/AOToken.json';
import AOTreasury from 'ao-contracts/build/contracts/AOTreasury.json';
import AOContent from 'ao-contracts/build/contracts/AOContent.json';

// Constants
export const CONTRACTS_INITIALIZED = 'CONTRACTS_INITIALIZED'


// Actions
export const initializeContracts = (networkId) => {
    return (dispatch, getState) => {
        try {
            networkId = 1533066469022
            if ( !AOToken.networks[networkId] ) {
                alert('Smart contracts have not been deployed on this network['+networkId+']')
            }
            const contracts = {
                aoToken: window.web3.eth.contract(AOToken.abi).at(AOToken.networks[networkId].address),
                aoTreasury: window.web3.eth.contract(AOTreasury.abi).at(AOTreasury.networks[networkId].address),
                aoContent: window.web3.eth.contract(AOContent.abi).at(AOContent.networks[networkId].address),
            }
            dispatch({
                type: CONTRACTS_INITIALIZED,
                payload: contracts
            })
        } catch ( error ) {
            console.error('Error initializing contracts', error)
        }
    }
}

// State
const initialState = {
    
}

// Reducer
export default function contractsReducer(state = initialState, action) {
    switch (action.type) {
        case CONTRACTS_INITIALIZED:
            return {
                ...state,
                ...action.payload,
            }        
        default:
            return state
    }
}
