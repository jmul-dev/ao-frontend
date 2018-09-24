import React from 'react';
import addons from '@storybook/addons';
import { storiesOf, forceReRender } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import {
    withKnobs,
    withKnobsOptions,
    boolean,
  } from '@storybook/addon-knobs';
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


const onChange = action('onChange')
let calculatorInputs = {
    earningInputValue: 1,
    denominationInput: new BigNumber(1)
}
const onCalculatorInputChange = inputName => (value) => {    
    calculatorInputs[inputName] = value
    onChange()
}
const onDenominationInputChange = ({baseInputValue, denomination, denominationInputValue}) => {
    console.log(denominationInputValue)
    calculatorInputs['denominationInput'] = new BigNumber(denominationInputValue) //.multipliedBy(Math.pow(10, denomination.powerOfTen))
    onChange(event)
    forceReRender()
}


storiesOf('Network Exchange')
    .addDecorator(muiTheme([lightTheme, darkTheme]))
    .add('ComparisonTable', () => (
        <ComparisonTable />
    ))
    .add('EarningsCalculator', () => (
        <EarningsCalculator />
    ))
    .addDecorator(withKnobs)
    .add('EarningsInput', () => {
        const denominationInputKnob = boolean('Include denomination input', false)
        const percentageKnob = boolean('Percentage?', true)
        return (
            <MuiThemeProvider theme={darkTheme}>
                <div style={{background: darkTheme.palette.background.default, padding: 40}}>
                    <EarningsInput 
                        label={`AO+ Multiplier`}
                        value={calculatorInputs.earningInputValue}
                        onChange={onCalculatorInputChange('earningInputValue')} 
                        includeDenomination={denominationInputKnob}
                        denominationValue={'ao'}
                        isPercentage={percentageKnob}
                    />
                </div>
            </MuiThemeProvider>
        )
    })