// @flow
import React, { PureComponent } from 'react';
import { WalletReducerType } from '../reducers/wallet.reducer';
import withUserWallet from '../containers/withUserWallet';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowIcon from '@material-ui/icons/ArrowUpward';
import ExchangeModal from '../../exchange/components/ExchangeModal';
import { formattedTokenAmount } from '../../../utils/denominations';
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
    constructor() {
        super()
        this.state = {
            exchangeModalOpen: false,
        }
    }
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
    _onExchangeModalClose = () => {
        this.setState({exchangeModalOpen: false})
    }
    render() {
        const { ethBalance, tokenBalance, tokenStaked, tokenEarned, primordialTokenBalance, networkTokenBalance } = this.props.wallet
        const { ethAddress } = this.props
        const networkTokenBalanceFormatted = formattedTokenAmount(networkTokenBalance, 1, true, false)
        const icoTokenBalanceFormatted = formattedTokenAmount(primordialTokenBalance, 1, true, true)
        const tokenStakedFormatted = formattedTokenAmount(tokenStaked, 1, true, false)
        const tokenEarnedFormatted = formattedTokenAmount(tokenEarned, 1, true, false)
        return (
            <div className="Wallet" style={{opacity: ethAddress ? 1 : 0.5}}>
                <div className="balance-container">
                    <header>
                        <Typography variant="display3">
                            {'My Wallet'}
                        </Typography>
                    </header>
                    <div className="balances">
                        <div>
                            <Typography variant="display1">{networkTokenBalanceFormatted.value}</Typography>
                            <Typography variant="body1">{networkTokenBalanceFormatted.label}</Typography>
                        </div>
                        <div>
                            <Typography variant="display1">{icoTokenBalanceFormatted.value}</Typography>
                            <Typography variant="body1">{icoTokenBalanceFormatted.label}</Typography>
                        </div>
                    </div>
                </div>
                <div className="token-metrics-container">
                    <div>
                        <Typography variant="caption">{'Tokens staked'}</Typography>
                        <Typography variant="body1"><b>{tokenStakedFormatted.value}</b> {tokenStakedFormatted.label}</Typography>
                    </div>
                    <div>
                        <Typography variant="caption">{'Tokens earned'}</Typography>
                        <Typography variant="body1"><b>{tokenEarnedFormatted.value}</b> {tokenEarnedFormatted.label}</Typography>
                    </div>
                </div>
                <Button 
                    size="small" 
                    variant="flat" 
                    color={ethAddress ? "primary" : "default"} 
                    style={{borderRadius: 0, fontSize: '1rem', padding: '8px 16px'}} 
                    disabled={!ethAddress}
                    onClick={() => this.setState({exchangeModalOpen: true})}
                    >
                    {'exchange tokens'} <ArrowIcon style={{transform: 'rotate(45deg)', fontSize: '1rem', marginLeft: 12}}/>
                </Button>
                <ExchangeModal 
                    open={this.state.exchangeModalOpen}
                    onClose={this._onExchangeModalClose}
                    exchangeProps={{
                        title: 'Purchase AO',
                        subtitle: 'AO+ Primordial tokens have additional staking and purchasing benefits.'
                    }}
                />             
            </div>
        );
    }
}
export default withUserWallet(Wallet)