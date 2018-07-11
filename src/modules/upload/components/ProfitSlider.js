import React from 'react';
import Slider from '@material-ui/lab/Slider';
import { withStyles } from '@material-ui/core/styles';


const styles = {
    track: {
        height: 8
    },
    thumb: {
        width: 18,
        height: 18,
        border: '1px solid #546EFF',
        boxShadow: '0 2px 4px 0 #546EFF',
        background: 'white',
    },
    trackBefore: {
        background: 'linear-gradient(to right, #6425FB, #546EFF)'
    },
    trackAfter: {
        background: 'linear-gradient(to right, #A5E833, #17BB59)'
    }
}

const ProfitSlider = ({...props}) => (
    <Slider {...props} />
)

export default withStyles(styles)(ProfitSlider)