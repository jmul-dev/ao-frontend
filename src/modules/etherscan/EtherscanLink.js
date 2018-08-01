// @flow
import React from 'react';
import { connect } from 'react-redux';

/**
 * EtherscanLink
 * 
 * @param {type} 'tx' | 'address'
 */
const EtherscanLink = ({type, value, ethNetworkLink, children, style = {}, ...props}) => (
    <a href={`${ethNetworkLink}/${type}/${value}`} target="_blank" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', display: 'inline-block', verticalAlign: 'middle', ...style}} {...props}>
        {children ? children : value}
    </a>
)

const mapStateToProps = (store) => {
    return {
        ethNetworkLink: store.app.ethNetworkLink
    }
}


export default connect(mapStateToProps, {})(EtherscanLink)