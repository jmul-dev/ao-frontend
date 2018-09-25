import React from 'react';
import addons from '@storybook/addons';
import { storiesOf, forceReRender } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import {
    withKnobs,
    withKnobsOptions,
    boolean,
    number,
} from '@storybook/addon-knobs';
import ReduxProvider from './ReduxProvider';
// Themes
import {muiTheme} from 'storybook-addon-material-ui';
import { darkTheme, lightTheme } from '../src/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
// Components
import ComparisonTable from '../src/modules/ico/components/ComparisonTable';
import EarningsCalculator from '../src/modules/ico/components/EarningsCalculator';
import EarningsGraph from '../src/modules/ico/components/EarningsGraph';
import EarningsInput from '../src/modules/ico/components/EarningsInput';
import BigNumber from 'bignumber.js';
import { IcoStatsWithStyles } from '../src/modules/ico/components/IcoStats';


const onChange = action('onChange')
let calculatorInputs = {
    earningInputValue: 1,
    denominationInput: new BigNumber(1)
}
const onCalculatorInputChange = inputName => (value) => {    
    calculatorInputs[inputName] = value
    onChange()
}

const ThemeWrapper = ({theme = darkTheme, children}) => (
    <MuiThemeProvider theme={theme}>
        <div style={{background: darkTheme.palette.background.default, padding: 40}}>
            {children}
        </div>
    </MuiThemeProvider>
)

storiesOf('Network Exchange')
    .addDecorator(muiTheme([lightTheme, darkTheme]))
    .addDecorator(story => <ReduxProvider story={story()}/>)
    .addDecorator(withKnobs)
    .add('Network Exchange Progress', () => {
        const totalSupplyKnob = number('Total supply', 0)
        return (
            <ThemeWrapper theme={darkTheme}>
                <IcoStatsWithStyles 
                    ico={{
                        primordialSaleActive: boolean('Sale active?', true),
                        primordialTotalSupply: new BigNumber(totalSupplyKnob),
                        primordialMaxSupply: new BigNumber(1125899906842620),                    
                    }}
                    updateIcoState={() => {}}
                />
            </ThemeWrapper>
        )        
    })
    .add('ComparisonTable', () => (
        <ComparisonTable />
    ))
    .add('EarningsCalculator', () => (
        <EarningsCalculator />
    ))
    .add('EarningsInput', () => {
        const denominationInputKnob = boolean('Include denomination input', false)
        const percentageKnob = boolean('Percentage?', true)
        return (
            <ThemeWrapper theme={darkTheme}>
                <EarningsInput 
                    label={`AO+ Multiplier`}
                    value={calculatorInputs.earningInputValue}
                    onChange={onCalculatorInputChange('earningInputValue')} 
                    includeDenomination={denominationInputKnob}
                    denominationValue={'ao'}
                    isPercentage={percentageKnob}
                />
            </ThemeWrapper>
        )
    })