import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';


const styles = {
    root: {
        background: 'white',
        paddingTop: 8,
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 16,
        borderRadius: 4,
    },
    inputFormLabel: {
        top: 8,
        left: 12,
    }
}

const TextInput = ({classes, ...props}) => (
    <TextField 
        fullWidth 
        margin="dense"
        className={classes.root}
        InputProps={{disableUnderline: true}} 
        InputLabelProps={{className: classes.inputFormLabel}}
        {...props} 
    />
)

export default withStyles(styles)( TextInput )