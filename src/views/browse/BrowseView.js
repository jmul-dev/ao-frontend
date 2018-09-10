// @flow
import React, { Component } from 'react';
import View from '../View';
import Clock from '../../modules/clock/components/Clock';
import VideoListing from '../../modules/video/components/VideoListing';
import EnqueuedVideos from '../../modules/video/components/EnqueuedVideos';
import SearchBar from '../../modules/video/components/SearchBar';
import withSearch from '../../modules/video/containers/withSearch';
import className from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Backdrop from '@material-ui/core/Backdrop';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import './browse-view.css';


class BrowseView extends Component {
    _openSearchBar = () => {
        this.props.setSearchBarActive(true)
    }
    _closeSearchBar = () => {
        this.props.setSearchBarActive(false)
    }
    _closeAndClearSearch = () => {
        this.props.setSearchBarActive(false)
        this.props.updateSearchValue('')
    }
    render() {
        const { searchString, searchBarActive } = this.props
        const searchActive = !searchBarActive && searchString && searchString.length > 0
        const containerClasses = className('BrowseView', {
            'search-input-active': searchBarActive,
            'search-active': searchActive
        })
        return (
            <View className={containerClasses} padding="none">
                <Fade in={!searchBarActive && !searchActive}>
                    <header>
                        <Clock />
                        <div style={{marginLeft: 'auto'}}>
                            <IconButton style={{marginRight: '-14px'}} onClick={this._openSearchBar}>
                                <SearchIcon />
                            </IconButton>
                        </div>
                    </header>
                </Fade>
                <Slide direction={'down'} in={searchBarActive || searchActive}>
                    <aside style={{transform: searchActive ? `translateY(-76px)` : undefined}}>
                        <SearchBar />
                    </aside>
                </Slide>
                <Backdrop
                    open={searchBarActive} 
                    className="search-backdrop" 
                    onClick={this._closeSearchBar}
                    style={{visibility: searchBarActive ? 'visible' : 'hidden'}}
                />
                <VideoListing />
                <EnqueuedVideos />                
            </View>
        );
    }
}

export default withSearch(BrowseView)