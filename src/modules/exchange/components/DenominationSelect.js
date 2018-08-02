import React from 'react';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';


const styles = ({palette}) => ({
    root: {
        width: 100,
        color: 'white'
    },
    select: {
        width: `calc(100% - 24px)`,
        paddingRight: 24,
    },
})

const DenominationSelect = ({...props}) => (
    <Select {...props} />
)

export default withStyles(styles, {withTheme: true})(DenominationSelect)