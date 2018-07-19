import React from 'react';
import Slider from '@material-ui/lab/Slider';
import { withStyles } from '@material-ui/core/styles';


const styles = {
    track: {
        height: 8,        
    },
    thumb: {
        width: 18,
        height: 18,
        border: '1px solid #546EFF',
        boxShadow: '0 2px 4px 0 #546EFF',
        backgroundColor: 'white',
    },
    trackBefore: {
        backgroundColor: '#4A546D !important',
    },
    trackAfter: {
        backgroundColor: 'rgba(0, 204, 71, 0.5) !important',
    }
}

const ProfitSlider = ({...props}) => (
    <Slider {...props} />
)

export default withStyles(styles)(ProfitSlider)