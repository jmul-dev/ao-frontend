import { AO_CONSTANTS } from "ao-library";
import { push } from "react-router-redux";
import { isElectron } from "../../../utils/electron";

// Constants
export const ELECTRON_EVENT_LOG = "ELECTRON_EVENT_LOG";
export const SET_IS_ELECTRON = "SET_IS_ELECTRON";
export const SET_DESKTOP_VERSION = "SET_DESKTOP_VERSION";

// Actions
export const listenOnIpcChannel = () => {
    return (dispatch, getState) => {
        const isElectron = getState().electron.isElectron;
        if (isElectron) {
            window.chrome.ipcRenderer.on(AO_CONSTANTS.IPC.EVENT_LOG, function(
                event,
                data
            ) {
                dispatch({
                    type: ELECTRON_EVENT_LOG,
                    payload: data
                });
            });
            window.chrome.ipcRenderer.on(
                AO_CONSTANTS.IPC.AO_DESKTOP_VERSION,
                function(event, data) {
                    dispatch({
                        type: SET_DESKTOP_VERSION,
                        payload: data
                    });
                }
            );
            window.chrome.ipcRenderer.send(
                AO_CONSTANTS.IPC.AO_DESKTOP_VERSION_REQUEST
            );
            window.chrome.ipcRenderer.on(
                AO_CONSTANTS.IPC.AO_ETH_RPC_PROMPT,
                function(event, { data }) {
                    dispatch({
                        type: AO_CONSTANTS.IPC.AO_ETH_RPC_PROMPT,
                        payload: data
                    });
                }
            );
            window.chrome.ipcRenderer.on(
                AO_CONSTANTS.IPC.MAIN_WINDOW_NAV_REQUEST,
                function(event, { data }) {
                    console.log(
                        `Handling request for navigation from main process:`,
                        data
                    );
                    dispatch(push(data.location, data.state));
                }
            );
            window.onerror = function(error, url, line) {
                window.chrome.ipcRenderer.send(
                    AO_CONSTANTS.IPC.ERRORS_MAINWINDOW,
                    error
                );
            };
            // Listen for external links (have to load via electron)
            document.addEventListener("click", function(event) {
                if (
                    event.target.tagName === "A" &&
                    event.target.target === "_blank"
                ) {
                    event.preventDefault();
                    window.chrome.ipcRenderer.send(
                        AO_CONSTANTS.IPC.OPEN_EXTERNAL_LINK,
                        event.target.href
                    );
                } else if (
                    event.target.parentElement &&
                    event.target.parentElement.tagName === "A" &&
                    event.target.parentElement.target === "_blank"
                ) {
                    event.preventDefault();
                    window.chrome.ipcRenderer.send(
                        AO_CONSTANTS.IPC.OPEN_EXTERNAL_LINK,
                        event.target.parentElement.href
                    );
                }
            });
        }
    };
};

export const submitEthereumRpcValue = rpcEndpoint => {
    // small delay to allow for prompt animation
    setTimeout(() => {
        window.chrome.ipcRenderer.send(
            AO_CONSTANTS.IPC.AO_ETH_RPC_PROMPT_RESPONSE,
            rpcEndpoint
        );
    }, 1000);
    return {
        type: AO_CONSTANTS.IPC.AO_ETH_RPC_PROMPT_RESPONSE
    };
};

export const checkElectron = () => {
    return {
        type: SET_IS_ELECTRON,
        payload: isElectron()
    };
};

// State
const initialState = {
    eventLogs: [],
    isElectron: isElectron(),
    desktopVersion: undefined,
    ethRpcPrompt: undefined
};

// Reducer
export default function bootReducer(state = initialState, action) {
    switch (action.type) {
        case ELECTRON_EVENT_LOG:
            return {
                ...state,
                eventLogs: state.eventLogs.concat(action.payload)
            };
        case SET_IS_ELECTRON:
            return {
                ...state,
                isElectron: action.payload
            };
        case SET_DESKTOP_VERSION:
            return {
                ...state,
                desktopVersion: action.payload
            };
        case AO_CONSTANTS.IPC.AO_ETH_RPC_PROMPT:
            return {
                ...state,
                ethRpcPrompt: action.payload
            };
        case AO_CONSTANTS.IPC.AO_ETH_RPC_PROMPT_RESPONSE:
            return {
                ...state,
                ethRpcPrompt: undefined
            };
        default:
            return state;
    }
}
