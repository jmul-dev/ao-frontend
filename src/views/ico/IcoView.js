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
import { darkTheme, PrimaryButton } from '../../theme';
import Exchange from '../../modules/exchange/components/Exchange';


export default class IcoView extends PureComponent {
    constructor() {
        super()
        // this._viewRef = React.createRef()
        // this._exchangeRef = React.createRef()
    }
    _scrollToExchange = () => {
        this._exchangeRef.scrollIntoView({behavior: 'smooth'})
        // console.log(this._viewRef.current)
        // this._viewRef.current.scrollTo(0, this._exchangeRef);
        // const domNode = ReactDOM.findDOMNode(this._exchangeRef)
        // domNode.scrollIntoView()
    }
    render() {
        return (            
            <View ref={this._viewRef} className={'IcoView'} padding="none">
                <MuiThemeProvider theme={darkTheme}>
                    <header className="section-padding bg-black" style={{backgroundImage: `url(${bgShapesSrc})`}}>
                        <div className="heading-copy">
                            <Typography variant="display1" gutterBottom>
                                {`Own a part of the AO network`}
                            </Typography>
                            <Typography variant="display2" className="subtitle">
                                {`an information-currency, data marketplace, and platform for distributed apps`}
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
                            {`The AO network uses blockchain technology in order to turn content into commerce.`}
                        </Typography>
                        <img src={infographSrc} alt="AO Network Overview" className="infograph" />
                    </section>
                </MuiThemeProvider>     
                <section className="section-padding vertical-padding-large">
                    <div className="centered-content">
                        <Typography variant="display3" style={{fontWeight: 'bold', lineHeight: '1.85rem'}}>
                            {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam efficitur augue sapien, id ullamcorper velit rutrum id. Suspendisse risus nibh, blandit quis volutpat eget, tempor quis dui. Integer vitae ligula faucibus, fringilla dui sed, auctor ipsum.`}
                        </Typography>
                    </div>                    
                </section>
                <section className="section-padding padding-top-0">
                    <ComparisonTable />
                </section>
                <MuiThemeProvider theme={darkTheme}>
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
                </MuiThemeProvider>
                <section className="section-padding section-tokens">
                    <div className="section-heading">
                        <Typography variant="display1" className="section-number">{`2.`}</Typography>
                        <div>
                            <Typography variant="body1" className="section-label">{`TOKENS`}</Typography>
                            <Typography variant="display2">{`AO tokens come in two forms:`}</Typography>
                        </div>
                    </div>
                    <img src={tokenStructureSrc} alt="AO Token Structure" className="token-structure" />
                </section>
                <section className="section-padding section-earnings">
                    <div className="section-heading">
                        <Typography variant="display1" className="section-number">{`3.`}</Typography>
                        <div>
                            <Typography variant="body1" className="section-label">{`POTENTIAL EARNINGS`}</Typography>
                            <Typography variant="display2">{`If you exchange for the limited supply of AO+ token, it will payoff in the long run:`}</Typography>
                        </div>
                    </div>
                    <div className="calculator-container">
                        <EarningsCalculator />
                    </div>
                </section>
                <MuiThemeProvider theme={darkTheme}>
                    <section className="section-split">
                        <Grid container spacing={16}>
                            <Grid item xs={12} sm={6} style={{backgroundColor: '#000000'}}>
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
                                    <RecentTransactions />
                                </div>
                            </Grid>
                        </Grid>  
                    </section>
                </MuiThemeProvider>
                <section ref={ref => {this._exchangeRef = ref}} className="section-padding section-exchange" style={{backgroundImage: `url(${bgShapesWhiteSrc})`}}>
                    <div className="centered-content">
                        <Typography variant="display2" gutterBottom>{`Interest piqued? Exchange now.`}</Typography>
                        <Typography variant="body1">{`For a limited time, exchange ETH for double the value.`}</Typography>
                        <Typography variant="body1">{`Exchange for AO+ and receive an equal amount of AO.`}</Typography>
                        <Exchange hideInputTitle={true} />
                    </div>
                </section>                
            </View>
        );
    }
}
