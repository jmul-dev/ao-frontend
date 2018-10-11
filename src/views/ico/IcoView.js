// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IcoStats from '../../modules/ico/components/IcoStats';
import './ico-view.css';
import ComparisonTable from '../../modules/ico/components/ComparisonTable';
import RecentTransactions from '../../modules/ico/components/RecentTransactions';
import EarningsCalculator from '../../modules/ico/components/EarningsCalculator';
import bgShapesSrc from '../../assets/bg-shapes.png';
import bgShapesWhiteSrc from '../../assets/bg-shapes-white.png';
import infographSrc from '../../assets/infograph.png';
import bgDenominationsSrc from '../../assets/bg-denominations.png';
import denominationsGraphicSrc from '../../assets/denominations-graphic.png';
import tokenStructureSrc from '../../assets/token-structure.png';
import multiplierGraphSrc from '../../assets/multiplier-graph.png';
import { MuiThemeProvider } from '@material-ui/core';
import { darkTheme, lightTheme, PrimaryButton } from '../../theme';
import Exchange from '../../modules/exchange/components/Exchange';


export default class IcoView extends PureComponent {
    constructor() {
        super()
        this.state = {
            delayedRender: false,
        }
    }
    componentDidMount() {
        this._delayedRenderTimeout = setTimeout(() => {
            this.setState({delayedRender: true})
        }, 1500)
    }
    componentWillUnmount() {
        clearTimeout(this._delayedRenderTimeout)
    }
    _scrollToExchange = () => {
        this._exchangeRef.scrollIntoView({behavior: 'smooth'})
    }
    render() {
        const { delayedRender } = this.state
        return (            
            <View className={'IcoView'} padding="none">                
                <header className="section-padding bg-black" style={{backgroundImage: `url(${bgShapesSrc})`}}>
                    <div className="heading-copy">
                        <Typography variant="display1" gutterBottom>
                            {`Become a part of The AO`}<sup>*</sup>
                        </Typography>
                        <Typography variant="display2" className="subtitle">
                            {`because humanity should think more like a human.`}
                            <br/><br/>
                            {`The AO is Abstract Order organizing information into an information-currency that powers the Autonomous Organization governing a decentralized socio-economic ecosystem and distributed application platform.`}
                        </Typography>
                    </div>
                    <div className="progress-banner">
                        <Grid container spacing={16} alignItems="center">
                            <Grid item xs={6}>
                                <PrimaryButton 
                                    onClick={this._scrollToExchange}
                                    style={{width: 200}}
                                    >
                                    {`Exchange tokens`}
                                </PrimaryButton>
                            </Grid>
                            <Grid item xs={6}>
                                <IcoStats />
                            </Grid>
                        </Grid>
                    </div>
                </header>
                <section className="section-padding vertical-padding-large bg-black">
                    <Typography variant="display1" gutterBottom style={{fontSize: '2.8125rem'}} className="heading-copy">
                        {`The AO Protocol mimics the mind and enables commerce on its content.`}
                    </Typography>
                    <img src={infographSrc} alt="AO Network Overview" className="infograph" />
                </section>
                <MuiThemeProvider theme={lightTheme}>
                    <section className="section-padding vertical-padding-large" style={{backgroundColor: lightTheme.palette.background.default}}>
                        <div className="centered-content">
                            <Typography variant="display3" style={{lineHeight: '1.85rem'}}>
                                {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam efficitur augue sapien, id ullamcorper velit rutrum id. Suspendisse risus nibh, blandit quis volutpat eget, tempor quis dui. Integer vitae ligula faucibus, fringilla dui sed, auctor ipsum.`}
                            </Typography>
                        </div>                    
                    </section>
                    <section className="section-padding padding-top-0" style={{backgroundColor: lightTheme.palette.background.default, overflow: 'hidden'}}>
                        <ComparisonTable />
                    </section>
                </MuiThemeProvider>
                <section className="section-padding section-denominations" style={{backgroundImage: `url(${bgDenominationsSrc})`}}>
                    <div className="section-heading">
                        <Typography variant="display1" className="section-number">{`1.`}</Typography>
                        <div>
                            <Typography variant="body1" className="section-label">{`OVERVIEW`}</Typography>
                            <Typography variant="display2" style={{color: 'white'}}>{`AO is directly correlated with the video content you are staking to:`}</Typography>
                        </div>
                    </div>
                    <img src={denominationsGraphicSrc} alt="AO Token Denominations" className="denominations" />
                </section>
                <MuiThemeProvider theme={lightTheme}>
                    <section className="section-padding section-tokens" style={{backgroundColor: lightTheme.palette.background.default}}>
                        <div className="section-heading">
                            <Typography variant="display1" className="section-number">{`2.`}</Typography>
                            <div>
                                <Typography variant="body1" className="section-label">{`TOKENS`}</Typography>
                                <Typography variant="display2">{`AO tokens come in two forms:`}</Typography>
                            </div>
                        </div>
                        <img src={tokenStructureSrc} alt="AO Token Structure" className="token-structure" />
                    </section>
                    <section className="section-padding section-earnings" style={{backgroundColor: lightTheme.palette.background.default}}>
                        <div className="section-heading">
                            <Typography variant="display1" className="section-number">{`3.`}</Typography>
                            <div>
                                <Typography variant="body1" className="section-label">{`POTENTIAL EARNINGS`}</Typography>
                                <Typography variant="display2">{`If you exchange for the limited supply of AO+ token, it will payoff in the long run:`}</Typography>
                            </div>
                        </div>
                        <div className="calculator-container">
                            {delayedRender && (
                                <EarningsCalculator />
                            )}                            
                        </div>
                    </section>
                </MuiThemeProvider>                
                <section className="section-split">
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={6} style={{backgroundColor: '#070707'}}>
                            <div className="multiplier-overview">
                                <div className="copy-padding">
                                    <Typography variant="body1" gutterBottom>{`WHY BUY NOW?`}</Typography>
                                    <Typography variant="body1" style={{color: `rgba(255,255,255, 0.75)`}}>{`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum turpis enim, sagittis vitae convallis eu, sagittis vitae tortor.`}</Typography>
                                </div>
                                <img src={multiplierGraphSrc} alt="AO Multiplier Incentive" className="multiplier-graph" />                                    
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{backgroundColor: darkTheme.palette.secondary.main}}>
                            <div className="transactions-container">
                                <div className="copy-padding">
                                    <Typography variant="body1">{`RECENT TRANSACTIONS`}</Typography>
                                </div>
                                {delayedRender && (
                                    <RecentTransactions />
                                )}                                
                            </div>
                        </Grid>
                    </Grid>  
                </section>
                <MuiThemeProvider theme={lightTheme}>
                    <section ref={ref => {this._exchangeRef = ref}} className="section-padding section-exchange" style={{backgroundImage: `url(${bgShapesWhiteSrc})`, backgroundColor: lightTheme.palette.background.default}}>
                        <div className="centered-content">
                            <Typography variant="display2" gutterBottom>{`Interest piqued? Exchange now.`}</Typography>
                            <Typography variant="body1">{`For a limited time, exchange ETH for double the value.`}</Typography>
                            <Typography variant="body1">{`Exchange for AO+ and receive an equal amount of AO.`}</Typography>
                            <Exchange hideInputTitle={true} />
                        </div>
                    </section>   
                </MuiThemeProvider>             
            </View>
        );
    }
}
