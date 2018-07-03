import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import '../styles/teaser-card.css';


type Props = {
    video: any,
}

export default class TeaserCard extends Component<Props> {
    constructor() {
        super()
        this.state = {
            mediaContainerWidth: 100
        }
    }
    componentDidMount() {
        if (window.addEventListener) {
            findDOMNode(this._contentContainerRef).addEventListener('scroll', this._handleContentScroll.bind(this), false)
        } else {
            findDOMNode(this._contentContainerRef).attachEvent('onscroll', this._handleContentScroll.bind(this), false)
        }
    }
    componentWillUnmount() {
        if (window.addEventListener) {
            findDOMNode(this._contentContainerRef).removeEventListener('scroll', this._handleContentScroll.bind(this), false)
        } else {
            findDOMNode(this._contentContainerRef).attachEvent('onscroll', this._handleContentScroll.bind(this), false)
        }
    }
    _handleContentScroll = (event) => {
        const widthPercentage = Math.max(100 - event.target.scrollTop * 50 / 250, 50)
        this.setState({
            mediaContainerStyle: {
                width: `${widthPercentage}%`
            }
        })
    }
    render() {
        const { video } = this.props
        return (
            <div className="TeaserCard">
                <div className="media-container" style={this.state.mediaContainerStyle}>
                    <div className="video-container" style={{backgroundImage: `url(${video.coverImageUrl})`}}></div>                                
                    <Typography variant="title" className="title">
                        {video.title}
                    </Typography>
                </div>
                <div className="content-container" ref={ref => this._contentContainerRef = ref}>
                    <Grid container spacing={16} style={{height: 800}}>
                        <Grid item xs={6}>
                            <Typography variant="body1">{`LIVE | 15 AO | watch for free`}</Typography>

                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                {video.description}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}