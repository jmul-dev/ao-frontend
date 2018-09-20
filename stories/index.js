import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import ComparisonTable from '../src/modules/ico/components/ComparisonTable';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { darkTheme, lightTheme } from '../src/theme';




storiesOf('Network Exchange', module)
    .add('ComparisonTable', () => (
        <CssBaseline>
            <MuiThemeProvider theme={lightTheme}>
                <ComparisonTable />
            </MuiThemeProvider>
        </CssBaseline>
    ))