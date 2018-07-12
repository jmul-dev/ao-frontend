/**
 * https://material-ui.com/customization/themes/
 * 
 * NOTE: these do not merge very well via nested MuiThemeProvider, lightTheme will
 * not inherit all of darkTheme values. 
 */
export const darkTheme = {
    typography: {
        fontFamily: 'Arimo',        
        display2: {
            fontSize: '1.714rem',
            color: '#FFFFFF'
        },
        display3: {
            fontSize: '1.5rem',
            color: '#FFFFFF'
        }
    },
    palette: {
        type: 'dark',
        primary: {
            light: 'rgba(84, 110, 255, 0.5)',
            main: 'rgba(84, 110, 255, 1)',
            dark: '#2445FC',
        },
        background: {
            default: '#000000'
        },
    }
}
export const lightTheme = {
    typography: {
        fontFamily: 'Arimo',
        subheading: {
            fontSize: '1rem',
            color: '#777777'
        },
        display2: {
            fontSize: '1.714rem',
            color: '#333333'
        },
        display3: {
            fontSize: '1.5rem',
            color: '#333333'
        }
    },
    palette: {
        type: 'light',
        primary: {
            light: 'rgba(84, 110, 255, 0.5)',
            main: 'rgba(84, 110, 255, 1)',
            dark: '#2445FC',
        },
        background: {
            default: '#FFFFFF'
        },
    },
    overrides: {
        MuiButton: {
            root: {
                textTransform: 'none'
            },
            flatPrimary: {
                background: 'linear-gradient(-90deg, #6425FB 0%, #546EFF 100%)',
                padding: '0 45px',
                color: 'white',
            },
        },
    },
}