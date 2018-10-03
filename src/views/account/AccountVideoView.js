import React, { PureComponent } from 'react';
import View from '../View';
import { withStyles } from '@material-ui/core/styles';

const styles = ({palette}) => ({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto', 
        backgroundColor: palette.background.default,
    } 
})

class AccountVideoView extends PureComponent {
    render() {
        const { match, classes } = this.props
        return (
            <View className={classes.root} padding="full">
                {match.params.videoId}
            </View>
        );
    }
}

export default withStyles(styles)(AccountVideoView)