import { Typography } from "@material-ui/core";
import React from "react";

const NameTaoPosition = ({ nameTaoPosition, userName }) => {
    if (!nameTaoPosition) return null;
    return (
        <div style={{ marginBottom: 8, marginTop: 8, color: "#AAAAAA" }}>
            <Typography color="textSecondary">
                {`Advocate: `}
                <Typography
                    component="span"
                    style={{ display: "inline" }}
                    color={
                        userName === nameTaoPosition.advocateName
                            ? "primary"
                            : "inherit"
                    }
                >
                    {nameTaoPosition.advocateName}
                </Typography>
            </Typography>
            <Typography color="textSecondary">
                {`Speaker: `}
                <Typography
                    component="span"
                    style={{ display: "inline" }}
                    color={
                        userName === nameTaoPosition.speakerName
                            ? "primary"
                            : "inherit"
                    }
                >
                    {nameTaoPosition.speakerName}
                </Typography>
            </Typography>
            <Typography color="textSecondary">
                {`Listener: `}
                <Typography
                    component="span"
                    style={{ display: "inline" }}
                    color={
                        userName === nameTaoPosition.listenerName
                            ? "primary"
                            : "inherit"
                    }
                >
                    {nameTaoPosition.listenerName}
                </Typography>
            </Typography>
        </div>
    );
};
export default NameTaoPosition;
