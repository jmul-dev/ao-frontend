import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Input from '@material-ui/core/Input';
import ProfitSlider from './ProfitSlider';
import withUploadFormData from '../containers/withUploadFormData';
import { Redirect } from 'react-router-dom';
import { BackButton, PrimaryButton } from './UploadFormNavButtons';
import OverviewAside from './OverviewAside';


const PricingInputCard = ({headline, label, stake, profit, selected, onClick}) => (
    <ButtonBase focusRipple className={`pricing-card ${selected ? 'selected' : ''}`} onClick={onClick}>
        <Typography variant="display3" className="headline">{headline}</Typography>
        <div className="pricing-table">
            <div>
                <Typography variant="caption">{'you stake'}</Typography>
                <Typography variant="body2">{`${stake}ao`}</Typography>
            </div>
            <div>
                <Typography variant="caption">{'you charge'}</Typography>
                <Typography variant="body2">{`${stake}ao`} <Typography variant="caption" style={{display: 'inline'}}>{'/view'}</Typography></Typography>
            </div>
            <div>
                <Typography variant="caption">{'you make'}</Typography>
                <Typography variant="body2">{`${profit}%`} <Typography variant="caption" style={{display: 'inline'}}>{'profits'}</Typography></Typography>
            </div>
        </div>
        <div className="label">
            <Typography style={{color: 'white'}}>{label}</Typography>
        </div>
    </ButtonBase>
)

const CustomPricingCard = ({expanded, stake, profit, onSelected, onChange, ...props}) => (
    <ExpansionPanel className={expanded ? 'selected' : ''} expanded={expanded} onChange={onSelected} {...props}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="display3" className="headline">{'custom settings'}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <div>
                <div className="gutter-bottom">
                    <Typography>{'1. How much would you like to charge?'}</Typography>
                    <div className="stake-input-container indent">
                        <Input 
                            type="number"
                            disableUnderline={true}
                            value={stake}
                            onChange={(event) => onChange(parseInt(event.target.value, 10))}
                        />
                        <Typography>{'ao/view'}</Typography>
                    </div>
                </div>
                <div className="gutter-bottom">
                    <Typography>{'2. What percentage of the earnings would you like to make?'}</Typography>
                    <Typography variant="caption" className="indent">{'Please note the higher percentage you take, the less profits you may actually make as nodes are less likely to host your content and give you exposure.'}</Typography>
                    <div className="profit-input-container indent">
                        <Typography variant="display3">{`${profit}%`}</Typography>
                        <ProfitSlider
                            min={0}
                            max={100}
                            step={1}
                            value={profit}
                            onChange={(event, value) => onChange(undefined, parseInt(value, 10))}
                        />
                        <Typography style={{color: '#17BB59'}}>{profit < 25 ? 'great exposure' : (profit < 50 ? 'good exposure' : (profit < 75 ? 'average exposure' : 'less exposure'))}</Typography>
                    </div>
                </div>
            </div>
        </ExpansionPanelDetails>
    </ExpansionPanel>
)

class UploadFormPricing extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    _selectPricingOption = (pricingOptionIndex, stake, profit) => {
        this.props.updatePricingOption(pricingOptionIndex, stake, profit)
    }
    _navBack = () => {
        this.context.router.history.goBack()
    }
    _navForward = () => {
        // TODO: if balance > stake: nav to /app/view/upload/content; else: nav to /app/view/upload/reload
        let nextRoute = '/app/view/upload/content'
        this.context.router.history.push(nextRoute)
    }
    render() {
        const { form } = this.props
        if ( !form.video ) {
            return <Redirect to={'/app/view/upload/start'} />
        }
        const fileSizeInMb = ~~(form.video.size / 1000 / 1000)
        return (
            <Grid container spacing={16}>
                <Grid item xs={3}>
                    <OverviewAside form={form} includePricing={false} />
                </Grid>
                <Grid item xs={8} style={{marginLeft: 'auto'}}>                    
                    <Typography variant="display3" className="gutter-bottom">
                        {'We’ve put together a few options based on your needs:'}
                    </Typography>
                    <div className="pricing-inputs gutter-bottom">                    
                        <Grid container spacing={16}>
                            <Grid item xs={4}>
                                <PricingInputCard 
                                    headline={'new content creators'}
                                    label={'great exposure'}
                                    stake={fileSizeInMb}
                                    profit={10}
                                    selected={form.pricingOption === 1}
                                    onClick={this._selectPricingOption.bind(this, 1)}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <PricingInputCard 
                                    headline={'established content creators'}
                                    label={'moderate pricing'}
                                    stake={~~(fileSizeInMb * 1.4)}
                                    profit={25}
                                    selected={form.pricingOption === 2}
                                    onClick={this._selectPricingOption.bind(this, 2)}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <PricingInputCard 
                                    headline={'premium high demand content'}
                                    label={'premium pricing'}
                                    stake={~~(fileSizeInMb * 2.2)}
                                    profit={60}
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
                            profit={form.profit}
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
        )
    }
}
export default withUploadFormData(UploadFormPricing)