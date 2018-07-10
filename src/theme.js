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
        background: {
            default: '#000000'
        },
    }
}
export const lightTheme = {
    typography: {
        fontFamily: 'Arimo',
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
        background: {
            default: '#FFFFFF'
        },
    }
}