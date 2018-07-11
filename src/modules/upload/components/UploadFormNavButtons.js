import React from 'react';
import Button from '@material-ui/core/Button';
import BackArrowIcon from '@material-ui/icons/ArrowBack';


export const BackButton = ({children, ...props}) => (
    <Button variant="outlined" {...props}><BackArrowIcon style={{fontSize: 16, marginRight: 4}} />{children}</Button>
)

export const PrimaryButton = ({children, ...props}) => (
    <Button variant="flat" color="primary" {...props}>{children}</Button>
)