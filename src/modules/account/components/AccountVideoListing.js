import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import withAccountVideos from '../containers/withAccountVideos';
import withEthAddress from '../containers/withEthAddress';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import AccountVideoListItem, { AccountVideoListItemPlaceholder } from './AccountVideoListItem';
import '../styles/account-video-listing.css';


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
                            <AccountVideoListItem 
                                video={video} 
                                filter={filter}
                            />
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