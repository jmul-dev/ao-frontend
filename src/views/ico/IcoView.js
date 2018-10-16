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
import PrimordialExchangeForm from '../../modules/exchange/components/PrimordialExchangeForm';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


class IcoView extends PureComponent {
    static propTypes = {
        whitepaperUrl: PropTypes.string,
    }
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
                        <Typography variant="display1" gutterBottom style={{fontWeight: 'bold'}}>
                            {`Become a part of the AO`}
                        </Typography>
                        <Typography variant="display2" className="subtitle">
                            {`The AO is Abstract Order organizing information into an information-currency that powers the Autonomous Organization governing a decentralized socio-economic ecosystem and distributed application platform.`}
                        </Typography>
                        {this.props.whitepaperUrl && (
                            <Typography 
                                variant="body1" 
                                component="a" 
                                href={this.props.whitepaperUrl} 
                                target="_blank"
                                className="whitepaper-link"
                                style={{marginTop: 24}}
                                >
                                {`whitepaper`}
                            </Typography>
                        )}
                    </div>
                    <div className="progress-banner">
                        <Grid container spacing={16} alignItems="center">
                            <Grid item xs={12} sm={4} md={3}>
                                <PrimaryButton 
                                    onClick={this._scrollToExchange}
                                    style={{width: 200}}
                                    >
                                    {`Exchange tokens`}
                                </PrimaryButton>
                            </Grid>
                            <Grid item xs={12} sm={8} md={9}>
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
                                {`If a currency is created from nothing, secured by nothing, and needs to be paid for to use... how valuable is it? If a currency is created through debt that needs to be paid back with more than what was created... how sustainable is it? If a currency has a fixed supply that can't keep up with demand... how stable can it ever really be?`}
                                <Divider style={{marginTop: 16, marginBottom: 16}} />
                                {`AO is created with information, is secured by information's value, and creates more of its currency when its used... not loaned--or stored.`}
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
                            <Typography variant="display2" style={{color: 'white'}}>{`The AO currency is denominated in the size of its information. An AO is a byte, and represents the capability to store or receive a byte of information on The AO Network.`}</Typography>
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
                                <Typography variant="display2">{`AO's currency has two forms:`}</Typography>
                            </div>
                        </div>
                        <img src={tokenStructureSrc} alt="AO Token Structure" className="token-structure" />
                    </section>
                    <section className="section-padding section-earnings" style={{backgroundColor: lightTheme.palette.background.default}}>
                        <div className="section-heading">
                            <Typography variant="display1" className="section-number">{`3.`}</Typography>
                            <div>
                                <Typography variant="body1" className="section-label">{`PROJECTED OUTCOME`}</Typography>
                                <Typography variant="display2">{`Staking content with AO+ can have a dramatic effect on AO earned from it over time. To help illustrate, here's a model with assumptions to play with:`}</Typography>
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
                                    <Typography variant="body1" style={{marginBottom: 16, textTransform: 'uppercase'}}>{`Multipliers on AO+ go down with each AO+ created`}</Typography>
                                    <Typography variant="body1" style={{color: `rgba(255,255,255, 0.75)`}}>{`AO+ has a finite supply. Once reached, only AO will be created by the network. To reward those that risk supporting AO earlier, the multiplier that grants additional AO on AO+ staked content starts at its highest and gradually decreases until all AO+ has been created.`}</Typography>
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
                            <Typography variant="display2" style={{marginBottom: 48}}>{`Exchange ETH for AO+`}</Typography>
                            <PrimordialExchangeForm />
                        </div>
                        {this.props.whitepaperUrl && (
                            <Typography 
                                variant="body1" 
                                component="a" 
                                href={this.props.whitepaperUrl} 
                                target="_blank"
                                className="whitepaper-link"
                                >
                                {`whitepaper`}
                            </Typography>
                        )}
                    </section>   
                </MuiThemeProvider>             
            </View>
        );
    }
}

const mapStateToProps = (store) => ({
    whitepaperUrl: store.contracts.settings.whitepaperUrl
})
export default connect(mapStateToProps)(IcoView)