// Constants
export const ELECTRON_EVENT_LOG = 'ELECTRON_EVENT_LOG'


// Actions
export const listenOnIpcChannel = () => {
    return (dispatch, getState) => {
        if ( window.IS_ELECTRON ) {
            // TODO: pull EVENT_LOG from ao-core constants
            window.chrome.ipcRenderer.on('EVENT_LOG', function(event, data) {
                dispatch({
                    type: ELECTRON_EVENT_LOG,
                    payload: data
                })
            })
        }        
    }
}

// State
const initialState = {
    eventLogs: [],
    isElectron: window.chrome && window.chrome.ipcRenderer
}

// Reducer
export default function bootReducer(state = initialState, action) {
    switch (action.type) {
        case ELECTRON_EVENT_LOG:
            return {
                ...state,
                eventLogs: state.eventLogs.concat(action.payload)
            }
        default:
            return state
    }
}
