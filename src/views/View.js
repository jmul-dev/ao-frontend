// @flow
import React, { Component, Node } from 'react';

type Props = {
    children: Node,
    padding: 'default' | 'none' | 'full'
};

export default class View extends Component<Props> {
    render() {
        const { padding, className, children, style, ...props } = this.props
        let viewPadding = {padding: 24}
        if ( padding === 'none' )
            viewPadding = {padding: 0}
        else if ( padding === 'full' )
            viewPadding = {padding: 100}
        const viewStyles = Object.assign({}, viewPadding, style)
        return (
            <div className={["View", className].join(' ')} style={viewStyles} {...props}>
                {children}
            </div>
        );
    }
}
