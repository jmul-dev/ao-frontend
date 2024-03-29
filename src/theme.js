/**
 * https://material-ui.com/customization/themes/
 * 
 * NOTE: these do not merge very well via nested MuiThemeProvider, lightTheme will
 * not inherit all of darkTheme values. 
 */
import React from 'react';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';


const primaryButton = ({...props}) => (
    <Button color="primary" {...props} />
)
export const PrimaryButton = withStyles(({palette}) => ({
    root: {
        '&[disabled]': {
            color: '#FFFFFF',
        }
    },
    flat: {
        background: palette.background.default,
        borderRadius: 0,
    },
    flatPrimary: {
        background: palette.primary.main,
        color: '#FFFFFF',
        borderRadius: 0,
    },
    disabled: {
        color: '#FFFFFF',
        background: palette.primary.light,
    },
    textPrimary: {
        '&:hover': {
            backgroundColor: palette.primary.dark // darken(palette.primary.main)
        }
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
        display1: {
            fontSize: '4rem',
            color: '#FFFFFF'
        },
        display2: {
            fontSize: '1.5rem',
            lineHeight: `2rem`,
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
            dark: darken('rgba(0, 204, 71, 1)', 0.25),
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
        display1: {
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#222222'
        },
        display2: {
            fontSize: '1.5rem',
            lineHeight: `2rem`,
            color: '#000000',
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
            dark: darken('rgba(0, 204, 71, 1)', 0.25),
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