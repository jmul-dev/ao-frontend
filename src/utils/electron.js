export const triggerMetamaskPopupWithinElectron = (getState) => {
    if ( getState().electron.isElectron ) {
        window.chrome.ipcRenderer.send('open-metamask-popup')
    }
}