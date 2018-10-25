import { Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../../../theme';
import ExchangeModal from '../../exchange/components/ExchangeModal';
import withAccountVideos from '../containers/withAccountVideos';
import withEthAddress from '../containers/withEthAddress';
import '../styles/account-video-listing.css';
import AccountVideoListItem from './AccountVideoListItem';


class AccountVideoListing extends Component {
    static propTypes = {
        ethAddress: PropTypes.string,
        filter: PropTypes.oneOf(['downloaded', 'uploaded']),
        ordering: PropTypes.string,
    }
    constructor() {
        super()
        this.state = {
            exchangeModalOpen: false,
        }
    }
    componentDidMount() {
        if ( this.props.query.refetch )
            this.props.query.refetch()
    }
    render() {
        const { ethAddress, filter } = this.props
        if ( !ethAddress )
            return this._renderPlaceholderAccountListing()
        const { error, node } = this.props.query
        if ( !node )
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
                            <Divider />
                            <AccountVideoListItem 
                                video={video} 
                                filter={filter}
                                currentUserEthAddress={ethAddress}
                            />                            
                        </li>
                    ))}
                </ul>                
            </div>
        );
    }
    _renderErrorState() {
        const errorMessage = `An error occured while trying to fetch your videos :/`
        return (
            <Fragment>
                <Divider />    
                <div className="AccountVideoListing placeholder">
                    <Typography variant="title" className="placeholder-title">{errorMessage}</Typography>
                </div>
            </Fragment>
        )
    }
    _renderNoAccountVideos() {
        const { filter } = this.props
        let errorMessage = `Looks like you haven\'t ${filter} any videos.`        
        return (
            <Fragment>
                <Divider />            
                <div className="AccountVideoListing placeholder">
                    <Typography variant="title" className="placeholder-title">{errorMessage}</Typography>
                    <div className="placeholder-actions">
                        {filter === 'uploaded' ? (
                            <PrimaryButton component={Link} to={`/app/view/upload`}>{`Upload a video`}</PrimaryButton>
                        ) : (
                            <PrimaryButton component={Link} to={`/app`}>{`Browse videos`}</PrimaryButton>
                        )}
                        <PrimaryButton color="default" onClick={() => {this.setState({exchangeModalOpen: true})}}>{`Exchange tokens`}</PrimaryButton>
                    </div>
                </div>
                <ExchangeModal 
                    open={this.state.exchangeModalOpen}
                    onClose={() => {this.setState({exchangeModalOpen: false})}}
                    exchangeType="primordialIfActive"
                />
            </Fragment>
        )
    }
    _renderPlaceholderAccountListing() {
        const { filter } = this.props
        return (
            <Fragment>
                <Divider />    
                <div className="AccountVideoListing placeholder">
                    <Typography variant="title" className="placeholder-title">{`Unlock your account to view your ${filter} videos.`}</Typography>
                </div>
            </Fragment>
        )
    }
}

export default compose(
    withAccountVideos,
    withEthAddress,
)(AccountVideoListing)