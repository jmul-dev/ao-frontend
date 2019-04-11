import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import Jazzicon from "jazzicon";
import PropTypes from "prop-types";

const propTypes = {
    size: PropTypes.number.isRequired,
    ethAddress: PropTypes.string.isRequired
};

const defaultProps = {
    size: 75
};

export default class EthereumIcon extends Component {
    componentDidMount() {
        if (this.props.ethAddress) {
            this._renderIconForAddress(this.props.ethAddress);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (
            this.props.ethAddress !== nextProps.ethAddress ||
            this.props.size !== nextProps.size
        ) {
            this._renderIconForAddress(nextProps.ethAddress);
        }
    }
    _renderIconForAddress(ethAddress) {
        const { size } = this.props;
        if (!ethAddress) return null;
        const container = findDOMNode(this);
        // Remove child node if exists
        if (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        // Generate the goods (metamask style)
        const stringToJazz = parseInt(ethAddress.slice(2, 10), 16);
        const jazzEl = Jazzicon(size, stringToJazz);
        container.appendChild(jazzEl);
    }
    render() {
        const { size, ethAddress, ...props } = this.props;
        const style = {
            display: "inline-block",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: "hidden"
        };
        return <div style={style} {...props} />;
    }
}

export const EthereumIconPlaceholder = ({ size = 75, ...props }) => (
    <div
        className="placeholder-bg"
        style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: "hidden",
            flexShrink: 0,
            backgroundColor: "#FFFFFF",
            opacity: 0.5
        }}
        {...props}
    />
);

EthereumIcon.propTypes = propTypes;
EthereumIcon.defaultProps = defaultProps;
