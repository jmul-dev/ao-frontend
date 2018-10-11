import BigNumber from "bignumber.js";
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { DenominationSelect } from "../utils/denominations";


const tokenInputStyles = ({palette, shape, typography}) => ({
    root: {
        borderRadius: shape.borderRadius,
        overflow: 'hidden',
        backgroundColor: palette.common.white,
        border: palette.type === 'light' ? `1px solid #DDDDDD` : undefined,
    },
    primaryContainer: {
        position: 'relative',
    },
        textField: {

        },
        textFieldInput: {
            padding: `16px 18px`,
            ...typography.headline,
        },
        supplementalText: {
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
        },
    secondaryContainer: {
        backgroundColor: palette.type === 'light' ? '#DEE0E3' : '#333333'
    },
        secondaryItemPadding: {
            paddingLeft: 12,
            paddingRight: 12,
        }
})
export const TokenInput = withStyles(tokenInputStyles)(
    ({value, denominationName, isPrimordial, onChange, supplementalText, disabled, classes}) => (
    <div className={classes.root}>
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
                onChange={onChange}
                disabled={disabled}
            />
            {supplementalText && (
                <Typography variant="caption" className={classes.supplementalText}>{supplementalText}</Typography>
            )}
        </div>
        <div className={classes.secondaryContainer}>
            <DenominationSelect
                value={denominationName}
                onChange={onChange}
                disabled={disabled}
                isPrimordial={isPrimordial}
                style={{width: '100%'}}
            />
        </div>        
    </div>
))



// const denominationInputStyles = ({palette, shape}) => ({
//     root: {
//         display: 'flex',
//         alignItems: 'flex-end',
//         backgroundColor: palette.background.paper,
//         color: palette.getContrastText(palette.background.paper),
//         padding: 4,
//         border: `1px solid ${palette.divider}`,
//         borderRadius: shape.borderRadius,
//     },
//     textFieldInput: {
//         padding: '0 8px',
//         fontSize: '50px',
//         letterSpacing: 0,
//         textAlign: 'right',
//     },
// })
// class DenominationInputPreWrap extends Component {
//     static propTypes = {
//         baseInputValue: PropTypes.instanceOf(BigNumber),
//         isPrimordial: PropTypes.bool.isRequired,
//         onChange: PropTypes.func.isRequired,  // ({baseInputValue, denominationInputValue, denomination})
//         disabled: PropTypes.bool,
//     }
//     constructor(props) {
//         super(props)
//         const { denomination } = fromBaseToHighestDenomination(props.baseInputValue || Math.pow(10, 9))
//         this.state = {
//             denomination: denomination,
//         }
//     }
//     componentDidMount() {
//         this.props.onChange({
//             baseInputValue: this.props.baseInputValue.toNumber(),
//             denomination: this.state.denomination
//         })
//     }
//     _onDenominationInputValueChange = (event) => {
//         let denominationInputValue = event.target.value
//         // TODO: check input value above
//         const { denomination } = this.state
//         let baseInputValue = new BigNumber(parseFloat(denominationInputValue) * Math.pow(10, denomination.powerOfTen))
//         this.props.onChange({
//             baseInputValue: baseInputValue.toNumber(),
//             denomination,
//             denominationInputValue: parseFloat(denominationInputValue),
//         })
//     }
//     _onDenominationInputChange = (nextDenom) => {
//         if ( nextDenom ) {
//             const baseInputValue = parseInt(this.props.baseInputValue, 10) || Math.pow(10, 9)
//             const amountInDenomination = new BigNumber(baseInputValue / Math.pow(10, nextDenom.powerOfTen))
//             this.setState({
//                 denomination: nextDenom,
//             })
//             this.props.onChange({
//                 baseInputValue: this.props.baseInputValue,
//                 denomination: nextDenom,
//                 denominationInputValue: amountInDenomination.toNumber(),
//             })
//         }
//     }
//     render() {
//         const { baseInputValue, isPrimordial, classes } = this.props
//         const { denomination } = this.state      
//         const denominationInputValue = new BigNumber(baseInputValue / Math.pow(10, denomination.powerOfTen))
//         return (
//             <div className={classes.root}>
//                 <TextField 
//                     fullWidth 
//                     className={classes.textField}
//                     InputProps={{
//                         disableUnderline: true,
//                         type: "number",                        
//                     }}
//                     // eslint-disable-next-line
//                     inputProps={{
//                         className: classes.textFieldInput
//                     }}
//                     value={denominationInputValue.toNumber()}
//                     onChange={this._onDenominationInputValueChange}
//                     disabled={this.props.disabled}                    
//                 />
//                 <DenominationSelect
//                     value={denomination.name}
//                     onChange={this._onDenominationInputChange}
//                     isPrimordial={isPrimordial}
//                 />
//             </div>
//         )
//     }
// }
// export const DenominationInput = withStyles(denominationInputStyles)(DenominationInputPreWrap)