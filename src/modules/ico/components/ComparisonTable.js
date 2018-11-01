import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { UsdIcon, BitcoinIcon, LogoIcon } from '../../../assets/Icons';
import { lighten } from '@material-ui/core/styles/colorManipulator';


const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        borderRadius: 0,
    },
    table: {
        maxWidth: `100%`,
        tableLayout: 'fixed',
    },
    thRow: {
        height: 128,
    },
    thCell: {
        verticalAlign: 'top',
    },
    thFlex: {
        display: 'flex',
    },
    thLabel: {
        color: 'white',
        fontWeight: 100,
    },
    thCurrency: {
        background: theme.palette.grey['400'],
        color: 'white',
        border: 'none !important',
    },
    thUsd: {
        background: `#424B62`,
        color: 'white',
        border: 'none !important',
    },
    thBitcoin: {
        background: `#4A546D`,
        color: 'white',
        border: 'none !important',
    },
    thAo: {
        background: theme.palette.primary.main,
        color: 'white',
        border: 'none !important',
    },
    cell: {
        whiteSpace: 'pre-line',
        padding: theme.spacing.unit * 2,
        border: `1px solid ${theme.palette.grey['100']}`,
    },
    cellLabel: {
        background: theme.palette.grey['400'],
        color: 'white',
        height: 70,
        borderLeft: 0,
        fontSize: `1rem`,
        fontWeight: 'bold'
    },
    cellAo: {
        background: lighten(theme.palette.primary.main, 0.64),
        borderRight: 0
    },
    tr: {
        verticalAlign: 'top',
        cursor: 'pointer',
        '&:hover > *:last-child': {
            background: lighten(theme.palette.primary.main, 0.5),
        },        
        '&:hover > *:first-child': {
            background: theme.palette.grey['500'],
        },
    },
    trSelected: {
        cursor: 'default',
        '& > *': {
            background: theme.palette.grey['300'],
        },
        '& > *:last-child, &:hover > *:last-child': {
            background: lighten(theme.palette.primary.main, 0.35),
        },
        '& > *:first-child, &:hover > *:first-child': {
            background: theme.palette.grey['600'],
        },
    },
    expansionDetails: {
        marginTop: theme.spacing.unit * 3,
    }
});

let id = 0;
function createData(label, usd, bitcoin, ao, usdExpanded, bitcoinExpanded, aoExpanded) {
    id += 1;
    return { id, label, usd, bitcoin, ao, usdExpanded, bitcoinExpanded, aoExpanded };
}

const rows = [
    createData('Classification', 
        'Fiat Currency',
        'Cryptocurrency', 
        'Information-currency',
        'A currency created and managed by a national government, and exclusively created by debt with interest in this time.  The interest maintains an economic scenario where there is always more fiat currency “owed” than actually exists, which is an unsustainable system.',        
        'A currency created and transacted through a public network protocol, which is secured through cryptography and self-interest economic assumptions.',
        'A currency created by the value of information and information transactions on a public network protocol that uses the valued information as a component of the cryptography to secure, transact, and back its value.',
    ),
    createData('How it works', 
        '• A standard unit of value', 
        '• A standard unit of value\n• Secured by cryptography', 
        '• A standard unit of value\n• Secured by cryptography\n• Backed by the value of its data',
        'The goal of USD and all fiat currency is to create a unit of value that can be denominated for commerce and contracts, which enables the trading of one resource for another asynchronously.  Its value and properties are secured by legislation and enforcement by a government.',
        'Bitcoin creates a unit of value, like fiat currency, but uses cryptography and economic rules to create and secure its financial system without the need for a centralized government or individual actor with power over the entire system.',
        'Like cryptocurrencies, AO does not require a centralized actor with power over its system to function.  But it ties valued information to its currency system and cryptography.  This allows AO to remain secure and solve scalability, power distribution, and speed limitations inherent in cryptocurreny protocols that pay witnesses for security.',
    ),
    createData('Created by', 
        'Debt', 
        'Witnesses', 
        'Information',
        'The majority (if not all, now) of USD is created through “debt” or USD “loaned out” that did not exist before with an interest rate associated with paying it back.  To create USD, a loan is made, or a liability is purchased by money that does not exist.  The interest creates a liability to pay back more money than was created.  To maintain this system, more debt must always be issued to pay back past debt at exponentially increasing rates.',
        'BTC, and other “Proof-of-Work” and “Proof-of-Stake” cyrptocurrencies uses “witnesses” or “miners” to secure their ledgers of transaction histories.  BTC is created when a “witness” is able to add a block to the chain and subsequently “mint” more BTC into existence as payment for adding the block and witnessing the chain.',
        'AO is created when information is transacted on AO’s network.  The newly created AO is given to the purchasers, creators, distributors, and The Autonomous Organization that enhances the public network.  Instead of a “transaction fee” and/or a “tax” on transactions that take value from actors in economic activity, AO rewards economic activity by using it as its inflation vehicle.',
    ),
    createData('Distributed by', 
        'Banks', 
        'Witnesses', 
        'People',
        'Central Bank assets, reserve rates, and fiscal policy control how much currency can exist.  Banks with the authority to provide credit from assets control the creation of new money and where it goes in the system first.',
        'All new BTC is created by mining and enters the BTC economy through witnesses distributing it.',
        'AO is created by information transactions and enters its economy through the participants in those transactions.',
    ),
    createData('Secured by', 
        'Government', 
        'Witnesses/Protocol', 
        'Information/Autonomous Organization',
        'Legislation, enforcement, and fear secure the authenticity and transactability of fiat currencies.',
        'Witnesses mining the blockchain in compliance to the cryptocurrency protocol secure the amounts, availability, and ability to use BTC.',
        'New information valued by the network creates a new genesis block on a new blockchain for that information.  Blockchains formed this way interact with each other on AO’s network, entwining them together into a mesh.',
    ),
    createData('Backed by', 
        'Nothing', 
        'Nothing', 
        'Information',
        'USD is backed in USD by the Fed that can create an infinite amount of USD.',
        'There is no inherent value in BTC, because it is numbers on a ledger on a protocol that offers an upgrade from fiat, but still has no inherent value other than what others value it at.',
        'AO is created through adding information to its network, making it available, and transacting it.  Each new piece of information valued this way inherits security from other information and adds its own.  AO is inherently valuable from its base properties of being used to add information and buy information from its network.',
    ),
    createData('Fees paid by', 
        'People and businesses', 
        'People and businesses', 
        'No one',
        'To use USD, it must be created by debt, with the interest as a fee to the creator of the credit associated with the debt.  To transmit USD, there is often multiple fees paid for wires, transfers, or card swipes by both people and merchants.  Even payrolls have transmission fees and government tax applied.  These fees are paid by economic actors, when they act.',
        'When BTC is sent, the transfer requestor must pay a transaction fee to the miner including it in their block for it to be accepted by the network.  Transaction fees increase as the network slows down and blocks fill, so they are variable and unpredictable.  Miners make more money per block when the network is slow, and users can’t send BTC quickly or reliably.  Miners also control the block size, along with the rest of the protocol.',
        '*AO has representative tokens on Ethereum, which require gas fees paid to Ethereum witnesses to function.  But AO transacted within AO’s platform is not only free but is also how new AO is created.  AO’s inflation rate is tied to the demand for its currency.',
    ),
    createData('Fees paid to', 
        'Money transmitters', 
        'Witnesses', 
        'Economic actors',
        'Unless transferred using cash or some newer money transmission platforms, the institutions that transfer USD are “money transmitters” and often earn profit by charging a fee to make the transfer.',
        'When an owner of BTC transfers BTC, they pay a transaction fee to the miner that incorporates the transaction into their block.',
        'Inside AO, transaction fees are reversed.  Instead of paying for the privilege to use AO, users are paid for using AO by the network.  There is no entity or witness that receives a fee for simply facilitating a data change while being in the middle of a transaction.',
    ),
    createData('Decisions made by', 
        'Banks & Government', 
        'Witnesses', 
        'All participants',
        'Central Banks buy or sell assets to control the base money supply.  Banks loan an excess of their reserves to create money through credit and debt.  Governments legislate and enforce financial and tax rules to control how money is spent and used.  USD is created and controlled from the “top down,” where interest is owed back up to the top.',
        'While BTC’s protocol runs on a decentralized network, decisions over the protocol and network are determined by “hash power.”  Witnessing, or mining, nodes vote their hash power.',
        'All decisions related to AO’s network, protocol, platform, ecosystem, etc., are delegated and controlled by “The AO” (“The Autonomous Organization”), which is a complete “DAO” (“Decentralized Autonomous Organization”).  Power in and over The AO can be achieved by anyone that produces information AO’s network values, and its own protocol mitigates the capability to just buy unearned influence.',
    ),
    createData('Decision transparency', 
        'Closed doors',
        'After changes',
        'Complete',
        'Monetary policy and strategy is a closely held secret discussed behind closed door by less-than-public individuals in control of Central Banks.  Their decision-making process does not become publicly available (and in some cases, even still redacted) until much later.  Banks that can create credit in excess of reserves do so as mostly for-profit entities and create money without public oversight or visibility.',
        'Bitcoin Improvement Proposals (“BIPs”) are generally available to the public, or at least all nodes that need to vote on them.  But the “how” and “why” are less transparent to BTC holders and users, and the decision to incorporate them or action them are 100% in control of miners, not BTC users without nodes of their own.',
        'Every decision, change, variable, discussion, logic, reasoning, spend, and result is managed, controlled, and recorded immutably in The AO.',
    ),
];

class ComparisonTable extends Component {
    constructor() {
        super()
        this.state = {
            selectedRowId: null
        }
    }
    _onRowClick = (event, id) => {
        this.setState({
            selectedRowId: this.state.selectedRowId === id ? null : id
        })
    }
    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root} elevation={0}>                    
                <Table className={classes.table}>   
                    <TableHead>
                        <TableRow className={classes.thRow}>
                            <TableCell className={`${classes.thCell} ${classes.thCurrency} ${classes.cell}`} color="primary">
                                <Typography variant="title" style={{color: 'white', marginRight: 'auto'}}>{`Currency`}</Typography>
                            </TableCell>
                            <TableCell className={`${classes.thCell} ${classes.thUsd} ${classes.cell}`}>
                                <div className={classes.thFlex}>
                                    <Typography variant="title" style={{color: 'white', marginRight: 'auto'}}>{`USD`}</Typography>
                                    <UsdIcon />
                                </div>
                                <Typography variant="caption" className={classes.thLabel}>{`US Dollar`}</Typography>
                            </TableCell>
                            <TableCell className={`${classes.thCell} ${classes.thBitcoin} ${classes.cell}`}>
                                <div className={classes.thFlex}>
                                    <Typography variant="title" style={{color: 'white', marginRight: 'auto'}}>{`BTC`}</Typography>
                                    <BitcoinIcon />
                                </div>
                                <Typography variant="caption" className={classes.thLabel}>{`Bitcoin`}</Typography>
                            </TableCell>
                            <TableCell className={`${classes.thCell} ${classes.thAo} ${classes.cell}`}>
                                <div className={classes.thFlex}>
                                    <Typography variant="title" style={{color: 'white', marginRight: 'auto'}}>{`AO`}</Typography>
                                    <LogoIcon width={25} height={25} />
                                </div>
                                <Typography variant="caption" className={classes.thLabel}>{`AO & AO+`}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>                     
                    <TableBody>
                        {rows.map(row => {
                            const rowIsSelected = this.state.selectedRowId === row.id
                            return (
                                <TableRow 
                                    key={row.id} 
                                    className={`${classes.tr} ${rowIsSelected ? classes.trSelected : ''}`} 
                                    hover={!rowIsSelected}
                                    onClick={(event) => this._onRowClick(event, row.id)}
                                    selected={rowIsSelected}
                                    >
                                    <TableCell component="th" scope="row" className={`${classes.cell} ${classes.cellLabel}`}>{row.label}</TableCell>
                                    <TableCell className={classes.cell}>
                                        {row.usd}
                                        {rowIsSelected ? (
                                            <div className={classes.expansionDetails}>{row.usdExpanded}</div>
                                        ) : null}
                                    </TableCell>
                                    <TableCell className={classes.cell}>
                                        {row.bitcoin}
                                        {rowIsSelected ? (
                                            <div className={classes.expansionDetails}>{row.bitcoinExpanded}</div>
                                        ) : null}
                                    </TableCell>
                                    <TableCell className={`${classes.cell} ${classes.cellAo}`}>
                                        {row.ao}
                                        {rowIsSelected ? (
                                            <div className={classes.expansionDetails}>{row.aoExpanded}</div>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

ComparisonTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComparisonTable);