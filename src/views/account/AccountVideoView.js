import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import withVideo from '../../modules/video/containers/withVideo';
import View from '../View';
import AccountVideo from '../../modules/account/components/AccountVideo';


const styles = ({palette, spacing}) => ({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto', 
        backgroundColor: palette.background.default,
    },
})

class AccountVideoView extends PureComponent {
    static propTypes = {
        // react-router
        match: PropTypes.shape({
            params: PropTypes.shape({
                videoId: PropTypes.string.isRequired,
            })
        }),
        // withStyles
        classes: PropTypes.object.isRequired,
        // withVideo
        videoQuery: PropTypes.shape({
            video: PropTypes.object,
            loading: PropTypes.boolean,
            error: PropTypes.any,            
        }),
    }
    render() {
        const { match, classes, videoQuery, metrics } = this.props
        if ( videoQuery.error ) {
            return (
                <View className={classes.root} padding="full">
                    <Typography>{`An error occured while fetching your video: ${videoQuery.error.message}`}</Typography>
                </View>
            )
        }
        if ( !videoQuery.video ) {
            return (
                <View className={classes.root} padding="full">
                    <Typography>{`Fetching...`}</Typography>
                </View>
            )
        }
        return (
            <View className={classes.root} padding="full">
                <AccountVideo video={videoQuery.video} />                
            </View>
        );
    }
}

export default compose(
    withStyles(styles),
    withVideo,
)(AccountVideoView)