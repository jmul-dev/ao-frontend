// @flow
import React, { Component, Node } from 'react';

type Props = {
    children: Node,
    padding: 'default' | 'none' | 'full'
};

export default class View extends Component<Props> {
    render() {
        let padding = {padding: 24}
        if ( this.props.padding === 'none' )
            padding = {padding: 0}
        else if ( this.props.padding === 'full' )
            padding = {padding: 100}
        const style = Object.assign({}, this.props.style, padding, {
            transition: 'all 300ms ease-out'
        })
        return (
            <div className={["View", this.props.className].join(' ')} style={style}>
                {this.props.children}
            </div>
        );
    }
}
