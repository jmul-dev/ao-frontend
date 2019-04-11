import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { DenominationSelect } from "../utils/denominations";


const commonInputStyles = ({palette, shape, typography}) => ({
    label: {
        textTransform: 'uppercase',
        color: '#777777',
        letterSpacing: '0.2px',
        marginBottom: 4,
        marginLeft: 2,
    },
    inputRoot: {
        borderRadius: shape.borderRadius,
        overflow: 'hidden',        
        border: palette.type === 'light' ? `1px solid #DDDDDD` : undefined,
    },
    primaryContainer: {
        position: 'relative',
        backgroundColor: palette.common.white,
    },
        textField: {

        },
        textFieldInput: {
            padding: `16px 18px`,
            ...typography.headline,
            color: '#222222',
            width: '100%',
        },
        supplementalText: {
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#777777',
            maxWidth: 80,
            textAlign: 'right',
        },
    secondaryContainer: {        
        backgroundColor: palette.type === 'light' ? '#DEE0E3' : '#333333',
        boxSizing: 'border-box',
        height: 35,
    },
        ethSecondaryContainer: {
            padding: `8px 12px`,
            display: 'flex',
            alignItems: 'center',
        },
        ethSecondaryLabel: {
            fontSize: '18px',
        },
})
export const TokenInput = withStyles(commonInputStyles)(
    ({
        value,              // token input value (string | number)
        denominationName,   // selected denomination (value * 10^denomination.powerOfTen = baseInputValue)
        isPrimordial, 
        label, 
        onChange,           // ({value, denominationName}) => {}
        supplementalText, 
        disabled, 
        classes,
    }) => (
    <div className={classes.root}>
        {label && (
            <Typography variant="body1" className={classes.label}>{label}</Typography>
        )}
        <div className={classes.inputRoot}>
            <div className={classes.primaryContainer}>
                <TextField 
                    fullWidth 
                    className={classes.textField}
                    InputProps={{
                        disableUnderline: true,
                        type: "number",
                    }}
                    // eslint-disable-next-line
                    inputProps={{
                        className: classes.textFieldInput,
                        style: {paddingRight: supplementalText ? 96 : undefined}
                    }}
                    value={value}
                    onChange={(event) => {
                        const nextValue = event.target.value
                        onChange({
                            value: nextValue,
                            denominationName,
                        })
                    }}
                    disabled={disabled}
                />
                {supplementalText && (
                    <Typography variant="caption" className={classes.supplementalText}>{supplementalText}</Typography>
                )}
            </div>
            <div className={classes.secondaryContainer}>
                <DenominationSelect
                    value={denominationName}
                    onChange={(nextDenom) => {
                        onChange({
                            value,
                            denominationName: nextDenom.name,
                        })
                    }}
                    disabled={disabled}
                    isPrimordial={isPrimordial}
                    style={{width: '100%'}}
                />
            </div>        
        </div>
    </div>
))

export const EthereumInput = withStyles(commonInputStyles)(
    ({
        value,              // token input value (string | number)
        label, 
        onChange,           // ({value}) => {}
        supplementalText, 
        disabled, 
        classes,
    }) => (
    <div className={classes.root}>
        {label && (
            <Typography variant="body1" className={classes.label}>{label}</Typography>
        )}
        <div className={classes.inputRoot}>
            <div className={classes.primaryContainer}>
                <TextField 
                    fullWidth 
                    className={classes.textField}
                    InputProps={{
                        disableUnderline: true,
                        type: "number",
                    }}
                    // eslint-disable-next-line
                    inputProps={{
                        className: classes.textFieldInput,
                        style: {paddingRight: supplementalText ? 96 : undefined},
                        step: 0.01
                    }}
                    value={value}
                    onChange={(event) => {
                        const nextValue = event.target.value
                        onChange({
                            value: nextValue,
                        })
                    }}
                    disabled={disabled}
                />
                {supplementalText && (
                    <Typography variant="caption" className={classes.supplementalText}>{supplementalText}</Typography>
                )}
            </div>
            <div className={`${classes.secondaryContainer} ${classes.ethSecondaryContainer}`}>
                <Typography variant="body1" className={classes.ethSecondaryLabel}>{'ETH'}</Typography>
            </div>        
        </div>
    </div>
))