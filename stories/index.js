import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import ComparisonTable from '../src/modules/ico/components/ComparisonTable';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { darkTheme, lightTheme } from '../src/theme';
import EarningsCalculator from '../src/modules/ico/components/EarningsCalculator';


const ThemeWrapper = (storyFn) => (
    <CssBaseline>
        <MuiThemeProvider theme={lightTheme}>
            {storyFn()}
        </MuiThemeProvider>
    </CssBaseline>
)


storiesOf('Network Exchange', module)
    // .addDecorator(ThemeWrapper)
    .addDecorator(muiTheme([lightTheme, darkTheme]))
    .add('ComparisonTable', () => (
        <ComparisonTable />
    ))
    .add('EarningsCalculator', () => (
        <EarningsCalculator />
    ))