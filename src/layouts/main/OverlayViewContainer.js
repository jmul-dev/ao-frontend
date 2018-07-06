import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';

export default class OverlayViewContainer extends Component {
    render() {
        return (
            <CSSTransition
                in={true /* TODO: pull from state if we want to have an intermediate animation between overlay pages */}
                timeout={300}
                classNames="OverlayView"
            >
                <div className="OverlayView">
                    <div className="backdrop"></div>
                    {this.props.children}
                </div>
            </CSSTransition>            
        );
    }
}
