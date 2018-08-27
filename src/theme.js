/**
 * https://material-ui.com/customization/themes/
 * 
 * NOTE: these do not merge very well via nested MuiThemeProvider, lightTheme will
 * not inherit all of darkTheme values. 
 */
import React from 'react';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const primaryButton = ({...props}) => (
    <Button color="primary" {...props} />
)
export const PrimaryButton = withStyles(({palette}) => ({
    flatPrimary: {
        background: palette.primary.main,
        color: '#FFFFFF',
    },
    disabled: {
        background: palette.background.default,
    },
}))(primaryButton)


export const darkTheme = createMuiTheme({
    typography: {
        fontFamily: 'Arimo',
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#FFFFFF'
        },
        subheading: {
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#FFFFFF'
        },
        display3: {
            fontSize: '1.313rem',
            color: '#FFFFFF'
        }
    },
    palette: {
        type: 'dark',
        primary: {
            light: 'rgba(0, 204, 71, 0.5)',
            main: 'rgba(0, 204, 71, 1)',
            dark: '#2445FC',
        },
        secondary: {
            main: '#4A546D',
            contrastText: "#FFFFFF",
        },
        error: {
            main: '#f44336'
        },
        background: {
            default: '#222222'
        },
        // custom palette colors
        warning: {
            main: '#FFBE00'
        },
    },
    overrides: {
        MuiButton: {
            root: {
                textTransform: 'none'
            },
            flatPrimary: {
                background: 'rgba(0, 204, 71, 1)',
                color: 'white',
            },
        },
    },
})

export const lightTheme = createMuiTheme({
    typography: {
        fontFamily: 'Arimo',
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#222222'
        },
        subheading: {
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#222222'
        },
        display3: {
            fontSize: '1.313rem',
            color: '#333333'
        }
    },
    palette: {
        type: 'light',
        primary: {
            light: 'rgba(0, 204, 71, 0.5)',
            main: 'rgba(0, 204, 71, 1)',
            dark: '#2445FC',
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: '#4A546D',
            contrastText: "#FFFFFF",
        },
        error: {
            main: '#f44336'
        },
        background: {
            default: '#F8F8F8'
        },
        // custom palette colors
        warning: {
            main: '#FFBE00'
        },
    },
    overrides: {
        MuiButton: {
            root: {
                textTransform: 'none'
            },
            flatPrimary: {
                background: 'rgba(0, 204, 71, 1)',
                color: 'white',
            },
        },
    },
    slider: {
        selectionColor: '#F76B1C',
        handleFillColor: '#F76B1C'
    }
})