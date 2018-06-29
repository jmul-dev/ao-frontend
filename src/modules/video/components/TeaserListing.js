import React, { Component } from 'react';
import Slider from "react-slick";
import '../styles/teaser-listing.css';

type Props = {
    videos: [any],
    activeVideoIndex: number,
}

export default class TeaserListing extends Component<Props> {
    render() {
        const { videos, activeVideoIndex } = this.props
        const settings = {
            initialSlide: activeVideoIndex,
            slidesToShow: 1,
            slidesToScroll: 1,
        }
        return (
            <div style={{position: 'fixed', top: 0, left: 0, bottom: 0, right: 0}}>
                <Slider {...settings}>
                    {videos.map((video, index) => (
                        <div key={index}>{index}</div>
                    ))}
                </Slider>
            </div>
        )
    }
}