import React, { Component, Fragment, PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import PlayIcon from '@material-ui/icons/PlayArrow';
import withAccountVideos from '../containers/withAccountVideos';
import withEthAddress from '../containers/withEthAddress';
import moment from 'moment';
import Collapse from '@material-ui/core/Collapse';
import '../styles/account-video-listing.css';
import { compose } from 'react-apollo';
import { TokenBalance, FileSize } from '../../../utils/denominations'
import VideoPlaybackLink from '../../video/components/VideoPlaybackLink'
import PropTypes from 'prop-types';


class AccountVideoListItem extends PureComponent {
    constructor() {
        super()
        this.state = {
            expanded: false,
        }
    }
    _toggleExapansion = () => {
        this.setState({expanded: !this.state.expanded})
    }
    render() {
        const { video } = this.props
        return (
            <div className="AccountVideoListItem">
                <Grid container spacing={16}>
                    <Grid item sm={4}>
                        <VideoPlaybackLink contentId={video.id} style={{width: '100%'}}>
                            <div className="featured-image" style={{backgroundImage: `url(${window.AO_CORE_URL}/${video.featuredImageUrl})`}}>
                                <PlayIcon className="play-icon" />
                            </div>
                        </VideoPlaybackLink>
                    </Grid>
                    <Grid item sm={8} className="card-container">
                        <Typography variant="display3" gutterBottom>
                            {video.title} {`(${video.state})`}
                        </Typography>
                        <Typography variant="body1" gutterBottom color="textSecondary">
                            {`uploaded: ${moment(parseInt(video.createdAt, 10)).format('M/D/YYYY')}`}
                        </Typography>
                        <Typography variant="body1" gutterBottom color="textSecondary">
                            {video.stakeId ? (
                                <Fragment>
                                    <TokenBalance baseAmount={video.stake} includeAO={true} />{' staked'}
                                </Fragment>
                            ) : (
                                <Fragment>
                                    {`Video has not been staked!`}
                                </Fragment>
                            )}
                        </Typography>
                        <Typography className="description" variant="body1" gutterBottom color="textSecondary">
                            {video.description}
                        </Typography>
                    </Grid>
                </Grid>
                <div>
                    <Collapse in={this.state.expanded}>
                        <div className="expansion-container">
                            <Typography className="description" variant="body1" gutterBottom color="textSecondary">
                                {video.description}
                            </Typography>
                            <Typography variant="body1" gutterBottom color="textSecondary">
                                {`Content dat key: dat://${video.fileDatKey}`}
                            </Typography>
                            <Typography variant="body1" gutterBottom color="textSecondary">
                                {`Metadata dat key: dat://${video.metadataDatKey}`}
                            </Typography>
                            <Typography variant="body1" gutterBottom color="textSecondary">
                                {`File size: `}<FileSize sizeInBytes={video.fileSize} />
                            </Typography>
                            <Typography component="pre">
                                {JSON.stringify(video, null, '\t')}
                            </Typography>
                        </div>
                    </Collapse>
                    <ButtonBase className="more-info" onClick={this._toggleExapansion}>
                        {this.state.expanded ? '- hide info' : '+ more info'}
                    </ButtonBase>
                </div>                
            </div>
        )
    }
}
const AccountVideoListItemPlaceholder = () => (
    <div className="AccountVideoListItem placeholder">
        <Grid container spacing={16}>
            <Grid item sm={4}>
                <div className="featured-image placeholder-bg"></div>
            </Grid>
            <Grid item sm={8} className="card-container">
                <Typography className="placeholder-text" variant="display3" gutterBottom>
                    {'Lorem ipsum dolor'}
                </Typography>
                <Typography className="placeholder-text" variant="body1" gutterBottom color="textSecondary">
                    {`uploaded: 1/1/1970`}
                </Typography>
                <Typography className="placeholder-text" variant="body1" gutterBottom color="textSecondary">
                    {`X ao earned | X ao staked`}
                </Typography>
                <Typography className="placeholder-text description" variant="body1" gutterBottom color="textSecondary">
                    {'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
                </Typography>
            </Grid>
        </Grid>              
    </div>
)

class AccountVideoListing extends Component {
    static propTypes = {
        ethAddress: PropTypes.string,
        filter: PropTypes.oneOf(['downloaded', 'uploaded']),
        ordering: PropTypes.string,
    }
    componentDidMount() {
        if ( this.props.query.refetch )
            this.props.query.refetch()
    }
    render() {
        const { ethAddress, filter } = this.props
        if ( !ethAddress )
            return this._renderPlaceholderAccountListing()
        const { loading, error, node } = this.props.query
        if ( loading || !node )
            return null  // TODO: loading
        if ( error )
            return this._renderErrorState()        
        const videos = filter === 'uploaded' ? node.stakedContent : node.hostedContent
        if ( !videos || videos.length === 0 )
            return this._renderNoAccountVideos()
        return (
            <div className="AccountVideoListing">
                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {videos.map((video, index) => (
                        <li key={video.id}>
                            <AccountVideoListItem video={video} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    _renderErrorState() {
        return (
            <div className="AccountVideoListing">
                <Typography variant="body1" style={{marginTop: 16, marginBottom: 24, color: '#AAAAAA'}}>
                    {`An error occured while trying to fetch your videos :/`}
                </Typography>
            </div>
        )
    }
    _renderNoAccountVideos() {
        const { filter } = this.props
        let errorMessage = 'You have not uploaded any videos with this account to the AO network'
        if ( filter === 'downloaded' ) 
            errorMessage = 'You have not purchased/downloaded any content yet'
        return (
            <div className="AccountVideoListing placeholder">
                <Typography variant="body1" style={{marginTop: 16, marginBottom: 24, color: '#AAAAAA'}}>
                    {errorMessage}
                </Typography>
            </div>
        )
    }
    _renderPlaceholderAccountListing() {
        return (
            <div className="AccountVideoListing placeholder">
                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    <AccountVideoListItemPlaceholder/>
                    <AccountVideoListItemPlaceholder/>
                    <AccountVideoListItemPlaceholder/>
                </ul>
            </div>
        )
    }
}

export default compose(
    withAccountVideos,
    withEthAddress,
)(AccountVideoListing)