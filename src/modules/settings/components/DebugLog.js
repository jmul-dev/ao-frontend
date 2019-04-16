import React from "react";
import DebugIcon from "@material-ui/icons/BugReport";
import { IconButton, Button } from "@material-ui/core";
import { isElectron } from "../../../utils/electron";
import { AO_CONSTANTS } from "ao-library";

export default () => {
    const disabled = isElectron();
    const onClick = () => {
        window.chrome.ipcRenderer.send(AO_CONSTANTS.IPC.OPEN_DEBUG_LOG);
    };
    return (
        <IconButton onClick={onClick} disabled={disabled}>
            <DebugIcon />
        </IconButton>
    );
};
