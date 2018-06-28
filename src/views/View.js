// @flow
import React, { Component, Node } from 'react';

type Props = {
    children: Node
};

export default class View extends Component<Props> {
    render() {
        return (
            <div className={["View", this.props.className].join(' ')}>
                {this.props.children}
            </div>
        );
    }
}
