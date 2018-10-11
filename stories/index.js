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
import { darkTheme, lightTheme, PrimaryButton } from '../src/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
// Components
import ComparisonTable from '../src/modules/ico/components/ComparisonTable';
import EarningsCalculator from '../src/modules/ico/components/EarningsCalculator';
import EarningsGraph from '../src/modules/ico/components/EarningsGraph';
import EarningsInput from '../src/modules/ico/components/EarningsInput';
import Exchange from '../src/modules/exchange/components/Exchange';
import BigNumber from 'bignumber.js';
import { IcoStatsWithStyles } from '../src/modules/ico/components/IcoStats';
import { RecentTransactionsWithStyles } from '../src/modules/ico/components/RecentTransactions';
import { TokenInput } from '../src/common/Inputs';


const onChange = action('onChange')
let calculatorInputs = {
    earningInputValue: 1,
    denominationInput: new BigNumber(1)
}
const onCalculatorInputChange = inputName => (value) => {    
    calculatorInputs[inputName] = value
    onChange()
}

const ThemeWrapper = ({theme = darkTheme, background, children}) => (
    <MuiThemeProvider theme={theme}>
        <div style={{background: background || darkTheme.palette.background.default, padding: 40}}>
            {children}
        </div>
    </MuiThemeProvider>
)

storiesOf('Theme')
    .addDecorator(muiTheme([darkTheme]))
    .add('PrimaryButton', () => (
        <ThemeWrapper theme={darkTheme} background={darkTheme.palette.secondary.main}>
            <PrimaryButton>{'Click me'}</PrimaryButton>
        </ThemeWrapper>
    ))

storiesOf('Exchange')
    .addDecorator(muiTheme([lightTheme, darkTheme]))
    .addDecorator(withKnobs)
    .add('TokenInput', () => (
        <TokenInput 
            label={'Send'}
            value={number('Input value', 10)}
            denominationName={'tera'}
            isPrimordial={boolean('isPrimordial', true)} 
            onChange={(inputs) => {console.log(inputs)}}           
            disabled={boolean('disabled', false)}
            supplementalText={`multiplier = 3.5`}
        />
    ))

storiesOf('Network Exchange')
    .addDecorator(muiTheme([lightTheme, darkTheme]))
    .addDecorator(story => <ReduxProvider story={story()}/>)
    .addDecorator(withKnobs)
    .add('Exchange', () => {
        return (
            <Exchange />
        )
    })
    .add('Recent Transactions', () => {
        return (
            <ThemeWrapper theme={darkTheme} background={darkTheme.palette.secondary.main}>
                <RecentTransactionsWithStyles
                    lotCreations={[{
                        blockNumber: 1234567,
                        lotOwner: '0x050aBCc712029E39fA33Fa1C2C031ddBA60E1986',
                        lotId: '1',
                        index: 3.5,
                        tokenAmount: new BigNumber(4.5 * Math.pow(10, 9)),
                    }]}
                    startListeningForRecentTransactions={() => {}}
                    stopListeningForRecentTransactions={() => {}}
                />
            </ThemeWrapper>
        )        
    })
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
