// @flow
import React, { Component } from 'react';
import View from '../View';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Clock from '../../modules/clock/components/Clock';
import VideoListingContainer from '../../modules/video/containers/VideoListingContainer';
import Stats from '../../modules/stats/components/Stats';
import './browse-view.css';


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
            </View>
        );
    }
}
