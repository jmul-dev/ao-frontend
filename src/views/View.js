// @flow
import React, { Component, Node } from 'react';

type Props = {
    children: Node
};

export default class View extends Component<Props> {
    render() {
        return (
            <div className={["View", this.props.className].join(' ')} style={{height: '100%', padding: this.props.noPadding ? 0 : 24}}>
                {this.props.children}
            </div>
        );
    }
}
