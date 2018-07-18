/**
 * https://material-ui.com/customization/themes/
 * 
 * NOTE: these do not merge very well via nested MuiThemeProvider, lightTheme will
 * not inherit all of darkTheme values. 
 */
export const darkTheme = {
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
        background: {
            default: '#000000'
        },
    }
}
export const lightTheme = {
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
                background: 'rgba(0, 204, 71, 1)',
                color: 'white',
            },
        },
    },
}