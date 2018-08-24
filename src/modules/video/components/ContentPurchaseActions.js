/**
 * Provides 2 Components:
 * 1. Copy/Icons/Loading state for the action
 * 2. The actual actions
 */
import React, { Component, Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { CircularProgress } from '@material-ui/core';
import AlertIcon from '@material-ui/icons/ErrorOutline';
import PlayIcon from '@material-ui/icons/PlayArrow';


export const ContentPurchaseState = ({content}) => {
    let isLoadingState = false
    let Icon = null
    let copy = null
    switch (content.state) {
        case 'DOWNLOADING':
            isLoadingState = true;
            copy = 'Downloading...';
            break;
        case 'DOWNLOADED':
            // Content is download, indicate need to purchase
            copy = 'Pay for video';
            Icon = AlertIcon;
            break;
        case 'PURCHASING':
            isLoadingState = true;
            copy = 'Paying...';
            break;
        case 'PURCHASED':  
            // Content is purchased, waiting for decryption key
            isLoadingState = true;
            copy = 'Waiting for decryption key...';
            break;
        case 'DECRYPTION_KEY_RECEIVED':
            copy = 'Decrypt video';
            Icon = AlertIcon;
            break;
        case 'DECRYPTED':
            // Content is purchased, waiting for decryption key
            isLoadingState = true;
            copy = 'Waiting for decryption key...';
            break;
        case 'VERIFIED':
            // Content verified, automatically proceeds to encrypting
            isLoadingState = true;
            copy = 'Video verified';
            break;
        case 'VERIFICATION_FAILED':
            copy = 'Video failed verification';
            Icon = AlertIcon;
            break;
        case 'ENCRYPTING':
            isLoadingState = true;
            copy = 'Encrypting video...';
            break;
        case 'ENCRYPTED':
            // Video is encrypted, indicate need to becomeHost/stake
            copy = 'Submit verification and become host';
            Icon = AlertIcon;
            break;
        case 'STAKING':
            isLoadingState = true;
            copy = 'Submitting verification...';
            break;
        case 'STAKED':
            isLoadingState = true;
            copy = 'Making discoverable...';
            break;
        case 'DISCOVERABLE':
        case 'DISCOVERED':
            copy = 'Watch now';
            Icon = PlayIcon;
            break;
        default:
            break;
    }
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            {isLoadingState ? (
                <CircularProgress size={20} style={{marginRight: 8}} />
            ) : null}
            {Icon ? (
                <Icon style={{marginRight: 4}} />
            ) : null}
            {copy}
        </div>        
    )
}