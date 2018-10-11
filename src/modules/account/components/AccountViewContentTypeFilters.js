import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import allMediaIconSrc from '../../../assets/media-type-all.svg';
import videoIconSrc from '../../../assets/media-type-video.svg';
import musicIconSrc from '../../../assets/media-type-music.svg';
import imageIconSrc from '../../../assets/media-type-image.svg';
import documentIconSrc from '../../../assets/media-type-document.svg';
import applicationIconSrc from '../../../assets/media-type-application.svg';
import assetIconSrc from '../../../assets/media-type-digital-asset.svg';
import { MEDIA_TYPES } from '../reducers/account.reducer';


const styles = ({palette, spacing}) => ({
    root: {
        backgroundColor: palette.background.default,    
    },
    tabsRoot: {
        // offset for the nav buttons that show up
        marginLeft: spacing.unit * -7,
        marginRight: spacing.unit * -7,
    },   
    scrollButtons: {
        color: '#777777',
    },
    tabRoot: {
        color: 'white',
        textTransform: 'lowercase',
        minHeight: 92,
        paddingBottom: 4,
    },
    icon: {
        height: 26,
        width: 'auto',
        marginTop: spacing.unit * 2,
        marginBottom: spacing.unit,
    },
})

class AccountViewContentTypeFilters extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        contentTypeFilter: PropTypes.oneOf(MEDIA_TYPES).isRequired,
        // withStyles
        classes: PropTypes.object.isRequired,
    }
    _onChange = (event, valueIndex) => {
        const value = MEDIA_TYPES[valueIndex]
        this.props.onChange(value)
    }
    render() {
        const { classes, contentTypeFilter } = this.props
        const tabValue = MEDIA_TYPES.indexOf(contentTypeFilter)  // Tabs uses indexing for values
        return (
            <div className={classes.root}>
                <Tabs
                    value={tabValue}
                    onChange={this._onChange}
                    indicatorColor="primary"
                    textColor="inherit"
                    scrollable
                    scrollButtons="on"
                    className={classes.tabsRoot}
                    classes={{
                        scrollButtons: classes.scrollButtons
                    }}
                >
                    <Tab 
                        label="all content" 
                        icon={<img className={classes.icon} src={allMediaIconSrc} alt="all content" />} 
                        className={classes.tabRoot}
                    />
                    <Tab 
                        label="videos" 
                        icon={<img className={classes.icon} src={videoIconSrc} alt="video content" />} 
                        className={classes.tabRoot}
                    />
                    <Tab 
                        disabled 
                        label="music" 
                        icon={<img className={classes.icon} src={musicIconSrc} alt="music content" />} 
                        className={classes.tabRoot}
                    />
                    <Tab 
                        disabled 
                        label="images" 
                        icon={<img className={classes.icon} src={imageIconSrc} alt="image content" />} 
                        className={classes.tabRoot}
                    />
                    <Tab 
                        disabled 
                        label="documents" 
                        icon={<img className={classes.icon} src={documentIconSrc} alt="document content" />} 
                        className={classes.tabRoot}
                    />
                    <Tab 
                        disabled 
                        label="digital asset" 
                        icon={<img className={classes.icon} src={assetIconSrc} alt="digital asset content" />} 
                        className={classes.tabRoot}
                    />
                    <Tab 
                        disabled 
                        label="applications" 
                        icon={<img className={classes.icon} src={applicationIconSrc} alt="application content" />} 
                        className={classes.tabRoot}
                    />
                </Tabs>
            </div>
        )
    }
}
export default withStyles(styles)(AccountViewContentTypeFilters)