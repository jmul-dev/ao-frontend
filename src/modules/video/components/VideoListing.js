// @flow
import React, { Component } from 'react';
import { AutoSizer, ColumnSizer, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css';
import Typography from '@material-ui/core/Typography';
import '../styles/video-listing.css';
import TeaserListing from './TeaserListing';

// TODO: for superimposed transition check this out 
// https://marmelab.com/blog/2017/12/04/material-design-animations-react-router.html
// https://github.com/marmelab/react-md-motion


type Props = {
    videos: Function,
    videosLoading: boolean,
    videosError?: Error,
    videosResult: any,
};

export default class VideoListing extends Component<Props> {
    props: Props;
    constructor() {
        super()
        this.state = {
            teaserListingActive: false,
            activeVideoIndex: undefined,
        }
    }
    render() {
        const { videos, videosLoading } = this.props
        const { teaserListingActive } = this.state
        const rowCount = videos.videos ? videos.videos.length / 3 : 0        
        if ( videosLoading )
            return null
        return (            
            <div className="VideoListing">
                <AutoSizer disableHeight>
                    {({width}) => (
                        <ColumnSizer
                            width={width}
                            columnMaxWidth={window.innerWidth / 3}
                            columnMinWidth={0}
                            columnCount={3}
                            key="GridColumnSizer"
                        >
                        {({adjustedWidth, columnWidth, registerChild}) => (
                            <Grid 
                                cellRenderer={this._renderCell}
                                columnCount={3}
                                columnWidth={columnWidth}
                                width={adjustedWidth}
                                rowCount={rowCount}
                                rowHeight={adjustedWidth / 3}                    
                                height={adjustedWidth / 3 * rowCount + 200}
                                containerStyle={{marginTop: 200, marginBottom: 200}}
                            />
                        )}
                        </ColumnSizer>
                    )}
                </AutoSizer>
                {teaserListingActive ? (
                    <TeaserListing videos={videos.videos} activeVideoIndex={this.state.activeVideoIndex} />
                ) : null}
            </div>            
        );
    }
    _renderCell = ({columnIndex, key, rowIndex, style}) => {
        const videoIndex = rowIndex * 3 + columnIndex
        const video = this.props.videos.videos[videoIndex]
        return (
            <div className="Cell" key={key} style={style}>
                <div 
                    className="cover-image" 
                    onClick={this._enterTeaserListingAtVideo.bind(this, videoIndex)}
                    style={{backgroundImage: `url(${video.coverImageUrl})`}}
                ></div>
                <Typography variant="title">
                    {video.title}
                </Typography>
            </div>
        )
    }
    _enterTeaserListingAtVideo = (videoIndex, event) => {
        console.log(event.target.getBoundingClientRect())
        this.setState({
            teaserListingActive: true,
            activeVideoIndex: videoIndex,
            
        })
    }
}
