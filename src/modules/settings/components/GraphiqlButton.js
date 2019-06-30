import React from "react";
import GraphicEqIcon from "@material-ui/icons/GraphicEq";
import { IconButton } from "@material-ui/core";
import { isElectron } from "../../../utils/electron";
import { AO_CONSTANTS } from "ao-library";

export default () => {
    const onClick = () => {
        const dappUrl = `${process.env.REACT_APP_AO_CORE_URL}/graphiql`;
        if (isElectron()) {
            window.chrome.ipcRenderer.send(
                AO_CONSTANTS.IPC.OPEN_GRAPHIQL_WINDOW,
                dappUrl
            );
        } else {
            window.open(dappUrl, "_blank");
        }
    };
    return (
        <IconButton onClick={onClick}>
            <GraphicEqIcon />
        </IconButton>
    );
};
