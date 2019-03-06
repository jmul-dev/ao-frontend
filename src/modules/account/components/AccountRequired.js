import React from "react";
import { connect } from "react-redux";
import { PrimaryButton } from "../../../theme";
import metamaskIconSrc from "../../../assets/nav-icon-metamask.svg";

/**
 * Wrapping any component in AccountRequired will render:
 * if ( have account ):
 *     render children
 * else if ( isElectron ):
 *     render button that opens metamask window
 * else
 *     render disabled account required button
 */
const AccountRequired = connect(state => ({
    isElectron: state.electron.isElectron,
    ethAddress: state.app.ethAddress
}))(({ isElectron, ethAddress, children, dispatch, ...props }) => {
    return ethAddress ? (
        children
    ) : (
        <PrimaryButton
            {...props}
            onClick={
                isElectron
                    ? () => {
                          window.chrome.ipcRenderer.send("open-metamask-popup");
                      }
                    : null
            }
            disabled={!isElectron}
        >
            <img
                src={metamaskIconSrc}
                alt="Metamask icon"
                style={{ height: 20, width: "auto", marginRight: 8 }}
            />
            {`Log in to access`}
        </PrimaryButton>
    );
});

export default AccountRequired;
