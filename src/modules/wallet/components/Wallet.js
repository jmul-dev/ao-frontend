// @flow
import React, { PureComponent } from 'react';
import { WalletReducerType } from '../reducers/wallet.reducer';
import withUserWallet from '../containers/withUserWallet';
import Account from '../../account/components/Account';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowIcon from '@material-ui/icons/ArrowUpward';
import '../styles/wallet.css';


type Props = {
    ethAddress: string,
    wallet: WalletReducerType,    
    isElectron: boolean,
    getEthBalanceForAccount: (string) => void,
    getTokenBalanceForAccount: (string) => void,
};

class Wallet extends PureComponent<Props> {
    props: Props;
    componentDidMount() {
        if ( this.props.ethAddress ) {
            this._getUpdatedBalances( this.props.ethAddress )
        } else if ( this.props.isElectron ) {
            window.chrome.ipcRenderer.send('open-metamask-popup')
        }
    }
    componentWillReceiveProps(nextProps: Props) {
        if ( this.props.ethAddress !== nextProps.ethAddress ) {
            this._getUpdatedBalances( nextProps.ethAddress )
        }
    }
    _getUpdatedBalances = ( address ) => {
        const { getEthBalanceForAccount, getTokenBalanceForAccount } = this.props
        getEthBalanceForAccount( address )
        getTokenBalanceForAccount( address )
    }
    render() {
        const { ethBalance, tokenBalance, tokenStaked, tokenEarned } = this.props.wallet
        const { ethAddress } = this.props
        return (
            <div className="Wallet" style={{opacity: ethAddress ? 1 : 0.5}}>
                <Grid container spacing={0}>
                    <Grid item xs={7} sm={7} lg={8} className="balance-container">
                        <header>
                            <Account display="ethIcon" size={25} />
                            <Typography variant="display3" style={{marginLeft: 12}}>
                                {'My Wallet'}
                            </Typography>
                        </header>
                        <div className="balances">
                            <div>
                                <div className="balance">{tokenBalance.toFixed(2)}</div>
                                <Typography className="label" variant="body1">{'AO'}</Typography>
                            </div>
                            <div>
                                <div className="balance">{ethBalance.toFixed(2)}</div>
                                <Typography className="label" variant="body1">{'ETH'}</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={5} sm={5} lg={4} className="token-container">
                        <div className="triangle"></div>
                        <div className="token-metric">
                            <div style={{display: 'flex'}}>
                                <div className="metric-value">{tokenStaked.toFixed(2)}</div>
                                <Typography className="label" variant="body1">{'AO'}</Typography>
                            </div>
                            <Typography variant="body1">{'staked'}</Typography>
                        </div>
                        <div className="token-metric">
                            <div style={{display: 'flex'}}>
                                <div className="metric-value">{tokenEarned.toFixed(2)}</div>
                                <Typography className="label" variant="body1">{'AO'}</Typography>
                            </div>
                            <Typography variant="body1">{'earned'}</Typography>
                        </div>
                        <Button size="small" variant="flat" color={ethAddress ? "primary" : "default"} style={{padding: '4px 10px'}} disabled={!ethAddress}>
                            {'reload wallet'} <ArrowIcon style={{transform: 'rotate(45deg)'}}/>
                        </Button>
                    </Grid>
                </Grid>               
            </div>
        );
    }
}
export default withUserWallet(Wallet)