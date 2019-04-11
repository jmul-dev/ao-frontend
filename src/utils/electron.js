import { connect } from "react-redux";

/**
 * Only renders children in the event that the
 * frontend is running within the electron
 * context.
 */
export const OnlyRenderUnderElectronContext = connect(state => ({
    isElectron: state.electron.isElectron
}))(({ isElectron, children }) => {
    return isElectron ? children : null;
});

export const triggerMetamaskPopupWithinElectron = getState => {
    if (getState().electron.isElectron) {
        window.chrome.ipcRenderer.send("open-metamask-notification");
    }
};

export const isElectron = () => {
    return !!(window.chrome && window.chrome.ipcRenderer);
};
