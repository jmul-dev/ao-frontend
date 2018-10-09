// Constants
export const ELECTRON_EVENT_LOG = 'ELECTRON_EVENT_LOG'
export const SET_IS_ELECTRON = 'SET_IS_ELECTRON'

// Actions
export const listenOnIpcChannel = () => {
    return (dispatch, getState) => {
        const isElectron = getState().electron.isElectron
        if ( isElectron ) {
            // TODO: pull EVENT_LOG from ao-core constants
            window.chrome.ipcRenderer.on('EVENT_LOG', function(event, data) {
                dispatch({
                    type: ELECTRON_EVENT_LOG,
                    payload: data
                })
            })
            window.onerror = function(error, url, line) {
                window.chrome.ipcRenderer.send('ERRORS_MAINWINDOW', error);
            }
            // Listen for external links (have to load via electron)
            document.addEventListener('click', function (event) {                        
                if (event.target.tagName === 'A' && event.target.target === '_blank') {
                    event.preventDefault()
                    window.chrome.ipcRenderer.send('OPEN_EXTERNAL_LINK', event.target.href)
                } else if ( event.target.parentElement && event.target.parentElement.tagName === 'A' && event.target.parentElement.target === '_blank') {
                    event.preventDefault()
                    window.chrome.ipcRenderer.send('OPEN_EXTERNAL_LINK', event.target.parentElement.href)
                }
            })
        }        
    }
}

export const checkElectron = () => {    
    return {
        type: SET_IS_ELECTRON,
        payload: !!(window.chrome && window.chrome.ipcRenderer)
    }
}

// State
const initialState = {
    eventLogs: [],
    isElectron: !!(window.chrome && window.chrome.ipcRenderer)
}

// Reducer
export default function bootReducer(state = initialState, action) {
    switch (action.type) {
        case ELECTRON_EVENT_LOG:
            return {
                ...state,
                eventLogs: state.eventLogs.concat(action.payload)
            }
        case SET_IS_ELECTRON:
            return {
                ...state,
                isElectron: action.payload
            }
        default:
            return state
    }
}
