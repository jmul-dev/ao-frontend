// @flow
import React, { Component, Node } from 'react';

type Props = {
    children: Node,
    padding: 'default' | 'none' | 'full'
};

export default class View extends Component<Props> {
    render() {
        let style = {padding: 24}
        if ( this.props.padding === 'none' )
            style = {padding: 0}
        else if ( this.props.padding === 'full' )
            style = {padding: 100}
        return (
            <div className={["View", this.props.className].join(' ')} style={style}>
                {this.props.children}
            </div>
        );
    }
}
