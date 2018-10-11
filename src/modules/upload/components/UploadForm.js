import React, { Component } from 'react';
import { Redirect } from 'react-router';
import FileUpload from '../components/FileUpload';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { PrimaryButton } from '../../../theme';
import withUploadFormData from '../containers/withUploadFormData';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import CloseIcon from '@material-ui/icons/Remove';
import OpenIcon from '@material-ui/icons/Add';
import AccountRequired from '../../account/components/AccountRequired';

import videoIconSrc from '../../../assets/media-type-video.svg';
import musicIconSrc from '../../../assets/media-type-music.svg';
import imageIconSrc from '../../../assets/media-type-image.svg';
import documentIconSrc from '../../../assets/media-type-document.svg';
import applicationIconSrc from '../../../assets/media-type-application.svg';
import assetIconSrc from '../../../assets/media-type-digital-asset.svg';


type Props = {
    asPlaceholder: boolean,
    updatePricingOption: Function,
    updateLastReachedStep: Function,
}

class UploadForm extends Component<Props> {
    props: Props;
    constructor() {
        super()
        this.state = {
            initialRedirect: false
        }
    }
    componentDidMount() {
        this.props.resetUploadForm()
    }
    _onFileInputChange = (value) => {
        if ( value ) {
            // Nav to next view
            this.props.updatePricingOption(1)
            this.props.updateLastReachedStep('pricing')
        }
    }
    render() {
        const { asPlaceholder, form, classes } = this.props        
        return form.video ? (
            <Redirect to="/app/view/upload/pricing" />
        ) : (
            <div className={`UploadForm ${asPlaceholder ? 'placeholder' : ''}`}>
                <Typography className="title" variant="subheading" style={{display: 'flex', alignItems: 'flex-end'}}>
                    {`Upload Content`}
                </Typography>
                <List>
                    <ListItem className={`${classes.li} ${classes.liActive} ${classes.liActiveTop}`}>
                        <ListItemIcon>
                            <img src={videoIconSrc} alt="Video content" className={classes.icon} />
                        </ListItemIcon>
                        <ListItemText 
                            primary={`Video`}
                            primaryTypographyProps={{
                                className: classes.liText
                            }}
                        />
                        <ListItemIcon>
                            <CloseIcon className={classes.icon} style={{opacity: 0.5}} />
                        </ListItemIcon>
                    </ListItem>
                    <li className={`${classes.li} ${classes.liActive} ${classes.liActiveBottom}`}>
                        <FileUpload 
                            disabled={asPlaceholder} 
                            inputName="video" 
                            onInputChange={this._onFileInputChange}
                            style={{paddingBottom: '50%'}}
                            >
                            <div className="video-input">
                                <Typography variant="display2" gutterBottom align="center">
                                    {'drag and drop to upload'}
                                </Typography>
                                <Typography variant="caption" align="center" style={{marginBottom: 24}}>
                                    {'mp4 or mov files'}
                                </Typography>
                                <AccountRequired>
                                    <PrimaryButton disabled={asPlaceholder}>
                                        {'or choose a file'}
                                    </PrimaryButton>
                                </AccountRequired>
                            </div>
                        </FileUpload>
                    </li>
                    <ListItem className={`${classes.li} ${classes.liInactive}`} disabled={true}>
                        <ListItemIcon>
                            <img src={musicIconSrc} alt="Music content" className={classes.icon} />
                        </ListItemIcon>
                        <ListItemText 
                            primary={`Music`}
                            primaryTypographyProps={{
                                className: classes.liText
                            }}
                        />
                        <ListItemText 
                            secondary={`coming soon`}
                            className={classes.textAlignRight}
                        />
                    </ListItem>
                    <ListItem className={`${classes.li} ${classes.liInactive}`} disabled={true}>
                        <ListItemIcon>
                            <img src={imageIconSrc} alt="Image content" className={classes.icon} />
                        </ListItemIcon>
                        <ListItemText 
                            primary={`Image`}
                            primaryTypographyProps={{
                                className: classes.liText
                            }}
                        />
                        <ListItemText 
                            secondary={`coming soon`}
                            className={classes.textAlignRight}
                        />
                    </ListItem>
                    <ListItem className={`${classes.li} ${classes.liInactive}`} disabled={true}>
                        <ListItemIcon>
                            <img src={documentIconSrc} alt="Document content" className={classes.icon} />
                        </ListItemIcon>
                        <ListItemText 
                            primary={`Document`}
                            primaryTypographyProps={{
                                className: classes.liText
                            }}
                        />
                        <ListItemText 
                            secondary={`coming soon`}
                            className={classes.textAlignRight}
                        />
                    </ListItem>
                    <ListItem className={`${classes.li} ${classes.liInactive}`} disabled={true}>
                        <ListItemIcon>
                            <img src={assetIconSrc} alt="Digital asset content" className={classes.icon} />
                        </ListItemIcon>
                        <ListItemText 
                            primary={`Digital Asset`}
                            primaryTypographyProps={{
                                className: classes.liText
                            }}
                        />
                        <ListItemText 
                            secondary={`coming soon`}
                            className={classes.textAlignRight}
                        />
                    </ListItem>
                    <ListItem className={`${classes.li} ${classes.liInactive}`} disabled={true}>
                        <ListItemIcon>
                            <img src={applicationIconSrc} alt="Application content" className={classes.icon} />
                        </ListItemIcon>
                        <ListItemText 
                            primary={`Application`}
                            primaryTypographyProps={{
                                className: classes.liText
                            }}
                        />
                        <ListItemText 
                            secondary={`coming soon`}
                            className={classes.textAlignRight}
                        />
                    </ListItem>
                </List>
            </div>
        );
    }
}

const styles = ({palette, spacing}) => ({
    icon: {
        height: 24,
        width: 24,
    },
    li: {
        paddingTop: spacing.unit * 3,
        paddingBottom: spacing.unit * 3,
    },
    liActive: {
        backgroundColor: `#151515`,
        border: `1px solid #222222`,
    },
        liActiveTop: {
            borderBottom: 0,
        },
        liActiveBottom: {
            borderTop: 0,
            padding: spacing.unit * 4
        },
    liInactive: {
        border: `1px solid #222222`,
        marginTop: -1,
    },
    textAlignRight: {
        textAlign: 'right',
    },
    liText: {
        fontWeight: 'normal'
    }
})

export default compose(
    withStyles(styles),
    withUploadFormData,
)(UploadForm);