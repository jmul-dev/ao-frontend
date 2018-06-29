// @flow
import React, { Component } from 'react';
import View from '../View';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Clock from '../../modules/clock/components/Clock';
import VideoListingContainer from '../../modules/video/containers/VideoListingContainer';
import './browse-view.css';


export default class BrowseView extends Component {
    render() {
        return (
            <View className={'BrowseView'} noPadding>
                <header>
                    <Clock />
                    <div>[stats]</div>
                    <div style={{marginLeft: 'auto'}}>
                        <Button>
                            <SearchIcon />
                        </Button>
                    </div>
                </header>
                <VideoListingContainer />
            </View>
        );
    }
}
