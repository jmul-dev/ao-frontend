import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withUploadFormData from '../containers/withUploadFormData';
import { Redirect } from 'react-router-dom';
import { BackButton, PrimaryButton } from './UploadFormNavButtons';
import OverviewAside from './OverviewAside';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import withUserWallet from '../../wallet/containers/withUserWallet';
import { TokenBalance, DenominationInput } from '../../../utils/denominations';
import BigNumber from 'bignumber.js';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Slider from '@material-ui/lab/Slider';
import { darken } from '@material-ui/core/styles/colorManipulator';


const PricingInputCard = withStyles(({palette, shadows, spacing, transitions}) => ({
    base: {
        background: palette.background.default,
        boxShadow: shadows[0],
        transition: transitions.create('box-shadow'),
        border: `1px solid ${palette.background.default}`,
        '&.selected': {
            boxShadow: shadows[8],
            border: `1px solid ${palette.primary.main}`
        }
    },
    label: {
        background: darken(palette.background.default, 0.35),
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: spacing.unit,
        '&.selected': {
            background: palette.primary.main,
        }
    },
}))(({headline, label, iconClassName, stake, profitSplitPercentage, selected, onClick, classes}) => (
    <ButtonBase focusRipple className={`pricing-card ${classes.base} ${selected ? 'selected' : ''}`} onClick={onClick}>
        <div className={`pricing-icon ${iconClassName}`}></div>
        <Typography variant="display3" className="headline">{headline}</Typography>
        <div className="pricing-table">
            <div>
                <Typography variant="caption">{'you stake'}</Typography>
                <Typography variant="body2">
                    <TokenBalance baseAmount={stake} decimals={1} includeAO={true} />
                </Typography>
            </div>
            <div>
                <Typography variant="caption">{'you charge'}</Typography>
                <Typography variant="body2">
                    <TokenBalance baseAmount={stake} decimals={1} includeAO={true} />
                    <Typography variant="caption" style={{display: 'inline'}}>{' / view'}</Typography>
                </Typography>
            </div>
            <div>
                <Typography variant="caption">{'you make'}</Typography>
                <Typography variant="body2">{`${profitSplitPercentage}%`} <Typography variant="caption" style={{display: 'inline'}}>{'profits'}</Typography></Typography>
            </div>
        </div>
        <div className={`${classes.label} ${selected ? 'selected' : ''}`}>
            <Typography style={{color: 'white'}}>{label}</Typography>
        </div>
    </ButtonBase>
))


const CustomPricingCard = withTheme()(({expanded, stake, stakeTokenType, stakePrimordialPercentage, profitSplitPercentage, onSelected, onChange, theme, ...props}) => (
    <ExpansionPanel className={expanded ? 'expanded' : ''} expanded={expanded} onChange={onSelected} style={{boxShadow: expanded ? `0px 5px 15px 0px ${theme.palette.secondary.light}` : undefined, transition: theme.transitions.create('box-shadow'), borderRadius: '4px'}} {...props}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="display3" className="headline" style={{color: expanded ? theme.palette.secondary.main : undefined}}>
                {'custom settings'}
            </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <div>
                <Typography>{'1. How much would you like to charge (AO/view)?'}</Typography>
                <div className="stake-input-container indent">
                    <div style={{maxWidth: 300}}>
                        <DenominationInput 
                            baseInputValue={new BigNumber(stake)}
                            isPrimordial={stakeTokenType === 'primordial'}
                            onChange={({baseInputValue}) => {
                                // Make sure to not update if we are not expanded (slight hack)
                                if ( expanded )
                                    onChange(baseInputValue)
                            }}
                        />
                    </div>
                </div>
                <div className="section-divider"></div>
                <Typography>{'2. Would you like to stake AO+, AO, or both?'}</Typography>
                <div className="token-type-container indent">
                    <div>
                        <RadioGroup
                            name="tokenType"
                            value={stakeTokenType}
                            onChange={(event) => onChange(undefined, undefined, event.target.value)}
                        >
                            <FormControlLabel value="primordial" control={<Radio />} label="AO+ (recommended)" />
                            <FormControlLabel value="network" control={<Radio />} label="AO" />
                            <FormControlLabel value="both" control={<Radio />} label="Both" />
                        </RadioGroup>
                    </div>
                    <div style={{flex: 1, position: 'relative', marginLeft: 24, marginRight: 8, visibility: stakeTokenType === 'both' ? 'visible' : 'hidden'}}>
                        <Slider 
                            value={stakePrimordialPercentage}
                            onChange={(event, value) => onChange(undefined, undefined, undefined, value)}
                            min={0}
                            max={100}
                            step={1}
                        />
                        <Typography variant="caption" className="primordial-amount">
                            <TokenBalance baseAmount={new BigNumber(stake).multipliedBy(stakePrimordialPercentage / 100)} decimals={1} includeAO={true} isPrimordial={true} />
                        </Typography>
                        <Typography variant="caption" className="network-amount">
                            <TokenBalance baseAmount={new BigNumber(stake).multipliedBy(1 - stakePrimordialPercentage / 100)} decimals={1} includeAO={true} isPrimordial={false} />
                        </Typography>
                        <Typography variant="caption" className="token-split">
                            {`${100 - stakePrimordialPercentage}/${stakePrimordialPercentage}`}
                        </Typography>
                    </div>
                </div>
                <div className="section-divider"></div>
                <Typography>{'3. What percentage of the earnings would you like to make?'}</Typography>
                <div className="profit-input-container indent">
                    <div style={{display: 'flex', alignItems: 'flex-end', width: '100%'}}>
                        <Typography variant="display3" className="profit-label">{`${profitSplitPercentage}%`}</Typography>
                        <Typography style={{color: '#17BB59', marginLeft: 'auto'}}>{profitSplitPercentage < 25 ? 'great exposure' : (profitSplitPercentage < 50 ? 'good exposure' : (profitSplitPercentage < 75 ? 'average exposure' : 'less exposure'))}</Typography>
                    </div>
                    <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={profitSplitPercentage}
                        onChange={(event, value) => onChange(undefined, parseInt(value, 10))}
                    />                        
                </div>                
                {expanded ? (
                    <div className="custom-pricing-tooltip">
                        <Typography variant="caption" style={{color: 'white'}}>
                            {'Please note the higher percentage you take, the less profits you may actually make as nodes are less likely to host your content and give you exposure.'}
                        </Typography>
                    </div>
                ) : null}                
            </div>
        </ExpansionPanelDetails>
    </ExpansionPanel>
))

class UploadFormPricing extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    _selectPricingOption = (pricingOptionIndex, stake, profitSplitPercentage, stakeTokenType, stakePrimordialPercentage) => {
        this.props.updatePricingOption(pricingOptionIndex, stake, profitSplitPercentage, stakeTokenType, stakePrimordialPercentage)
    }
    _navBack = () => {
        // this.context.router.history.goBack()
        this.context.router.history.replace('/app/view/upload/start')
    }
    _navForward = () => {
        const { wallet, form } = this.props
        let nextRoute = '/app/view/upload/content'
        if ( wallet.networkTokenBalance.lt(form.networkTokensRequired) ||  wallet.primordialTokenBalance.lt(form.primordialTokensRequired) ) {
            nextRoute = '/app/view/upload/reload'
        }
        this.context.router.history.push(nextRoute)
    }
    render() {
        const { form } = this.props
        if ( !form.video ) {
            return <Redirect to={'/app/view/upload/start'} />
        }
        const fileSize = form.video.size
        return (
            <div>
                <Typography className="title" variant="subheading">
                    {`Video Upload`}
                </Typography>
                <Grid container spacing={16}>            
                    <Grid item xs={3}>
                        <OverviewAside form={form} includePricing={false} />
                    </Grid>
                    <Grid item xs={8} style={{marginLeft: 'auto'}}>                    
                        <Typography variant="subheading" className="gutter-bottom">
                            {'We’ve put together a few options based on your needs:'}
                        </Typography>
                        <div className="pricing-inputs gutter-bottom">                    
                            <Grid container spacing={16}>
                                <Grid item xs={4}>
                                    <PricingInputCard 
                                        headline={'new content creators'}
                                        label={'great exposure'}
                                        iconClassName={'pricing-icon-a'}
                                        stake={fileSize}
                                        profitSplitPercentage={10}
                                        selected={form.pricingOption === 1}
                                        onClick={this._selectPricingOption.bind(this, 1)}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <PricingInputCard 
                                        headline={'established content creators'}
                                        label={'moderate pricing'}
                                        iconClassName={'pricing-icon-b'}
                                        stake={~~(fileSize * 1.4)}
                                        profitSplitPercentage={25}
                                        selected={form.pricingOption === 2}
                                        onClick={this._selectPricingOption.bind(this, 2)}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <PricingInputCard 
                                        headline={'premium high demand content'}
                                        label={'premium pricing'}
                                        iconClassName={'pricing-icon-c'}
                                        stake={~~(fileSize * 2.2)}
                                        profitSplitPercentage={60}
                                        selected={form.pricingOption === 3}
                                        onClick={this._selectPricingOption.bind(this, 3)}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div className="custom-pricing gutter-bottom">
                            <CustomPricingCard
                                expanded={form.pricingOption === 0}
                                stake={form.stake}
                                profitSplitPercentage={form.profitSplitPercentage}
                                stakeTokenType={form.stakeTokenType}
                                stakePrimordialPercentage={form.stakePrimordialPercentage}
                                onSelected={(_, expanded) => expanded ? this._selectPricingOption(0) : this._selectPricingOption(1)}
                                onChange={this._selectPricingOption.bind(this, 0)}
                            />
                        </div>
                        <nav className="upload-form-nav gutter-bottom">
                            <BackButton onClick={this._navBack}>{'back'}</BackButton>
                            <PrimaryButton onClick={this._navForward}>{'continue'}</PrimaryButton>
                        </nav>
                    </Grid>
                </Grid>   
            </div>
        )
    }
}
export default compose(
    withUploadFormData,
    withUserWallet,
)(UploadFormPricing)