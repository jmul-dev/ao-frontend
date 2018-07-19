// @flow
import React, { Component } from 'react';
import View from '../View';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Clock from '../../modules/clock/components/Clock';
import VideoListingContainer from '../../modules/video/containers/VideoListingContainer';
import Stats from '../../modules/stats/components/Stats';
import './browse-view.css';

// TODO: remove
import Exchange from '../../modules/exchange/components/Exchange';
import Modal from '@material-ui/core/Modal';


export default class BrowseView extends Component {
    render() {
        return (
            <View className={'BrowseView'} padding="none">
                <header>
                    <Clock />
                    <Stats />
                    <div style={{marginLeft: 'auto'}}>
                        <IconButton style={{marginRight: '-14px'}}>
                            <SearchIcon />
                        </IconButton>
                    </div>
                </header>
                <VideoListingContainer />
                {/* TODO: remove */}
                <Modal open={true}>
                    <div className="modal-content-container" style={{width: 580, position: 'absolute', top: `50%`, left: `50%`, transform: `translate(-50%, -50%)`}}>
                        <Exchange 
                            title={'You have insufficient funds'}
                            subtitle={'Purchase more ao to continue streaming.'}
                        />
                    </div>
                </Modal>
            </View>
        );
    }
}
