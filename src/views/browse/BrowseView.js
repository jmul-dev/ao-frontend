// @flow
import React, { Component } from 'react';
import View from '../View';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Clock from '../../modules/clock/components/Clock';
import VideoListingContainer from '../../modules/video/containers/VideoListingContainer';
import './browse-view.css';


export default class BrowseView extends Component {
    render() {
        return (
            <View className={'BrowseView'} padding="none">
                <header>
                    <Clock />
                    <div style={{marginLeft: 'auto'}}>
                        <IconButton style={{marginRight: '-14px'}}>
                            <SearchIcon />
                        </IconButton>
                    </div>
                </header>
                <VideoListingContainer />
            </View>
        );
    }
}
