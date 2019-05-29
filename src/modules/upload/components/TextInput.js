import React from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

const styles = {
    root: {
        background: "#222222",
        paddingTop: 8,
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 16,
        borderRadius: 4,
        "& .MuiFormHelperText-root": {
            opacity: 0.5
        }
    },
    inputFormLabel: {
        top: 8,
        left: 12
    },
    inputHelperText: {
        opacity: 0.5
    }
};

const TextInput = ({ classes, ...props }) => (
    <TextField
        fullWidth
        margin="dense"
        className={classes.root}
        InputProps={{ disableUnderline: true }}
        InputLabelProps={{ className: classes.inputFormLabel }}
        FormHelperTextProps={{
            className: classes.inputHelperText
        }}
        {...props}
    />
);

export default withStyles(styles)(TextInput);
