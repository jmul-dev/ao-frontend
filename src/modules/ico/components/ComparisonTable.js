import React from 'react';
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
        tableLayout: 'fixed'
    },
    thRow: {
        height: 128,
        verticalAlign: 'top',
    },
    thFlex: {
        display: 'flex',
    },
    thLabel: {
        color: 'white',
        fontWeight: 100
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
        borderLeft: 0
    },
    cellAo: {
        background: lighten(theme.palette.primary.main, 0.64),
        borderRight: 0
    },
    tr: {
        verticalAlign: 'top',
    }
});

let id = 0;
function createData(label, usd, bitcoin, ao) {
    id += 1;
    return { id, label, usd, bitcoin, ao };
}

const rows = [
    createData('Classification', 'Currency', 'Cryptocurrency', 'Information-currency'),
    createData('How it works', '• A standard unit of value', '• A standard unit of value\n• Secured by cryptography', '• A standard unit of value\n• Secured by cryptography\n• Backed by the value of its data'),
    createData('Created by', 'Debt', 'Witnesses', 'Information'),
    createData('Distributed by', 'Banks', 'Witnesses', 'Content creators'),
    createData('Secured by', 'Government', 'Witnesses', 'People'),
    createData('Backed by', 'Nothing', 'Nothing', 'Data'),
    createData('Fees paid by', 'People and businesses', 'People and businesses', 'No one'),
    createData('Fees paid to', 'Money transmitters', 'Witnesses', 'No one'),
    createData('Information benefits', 'Asset owners', 'Witnesses', 'Information creators'),
    createData('Decisions made by', 'Central banks', 'Witnesses', 'All participants'),
];

function ComparisonTable(props) {
    const { classes } = props;
    return (
        <Paper className={classes.root} elevation={0}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow className={classes.thRow}>
                        <TableCell padding="dense" color="primary" className={`${classes.thCurrency} ${classes.cell}`}>
                            <Typography variant="title" style={{color: 'white', marginRight: 'auto'}}>{`Currency`}</Typography>
                        </TableCell>
                        <TableCell padding="dense" className={`${classes.thUsd} ${classes.cell}`}>
                            <div className={classes.thFlex}>
                                <Typography variant="title" style={{color: 'white', marginRight: 'auto'}}>{`USD`}</Typography>
                                <UsdIcon />
                            </div>
                            <Typography variant="caption" className={classes.thLabel}>{`US Dollar`}</Typography>
                        </TableCell>
                        <TableCell padding="dense" className={`${classes.thBitcoin} ${classes.cell}`}>
                            <div className={classes.thFlex}>
                                <Typography variant="title" style={{color: 'white', marginRight: 'auto'}}>{`BTC`}</Typography>
                                <BitcoinIcon />
                            </div>
                            <Typography variant="caption" className={classes.thLabel}>{`Bitcoin`}</Typography>
                        </TableCell>
                        <TableCell padding="dense" className={`${classes.thAo} ${classes.cell}`}>
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
                        return (
                            <TableRow key={row.id} className={classes.tr}>
                                <TableCell component="th" scope="row" className={`${classes.cell} ${classes.cellLabel}`}>{row.label}</TableCell>
                                <TableCell className={classes.cell}>{row.usd}</TableCell>
                                <TableCell className={classes.cell}>{row.bitcoin}</TableCell>
                                <TableCell className={`${classes.cell} ${classes.cellAo}`}>{row.ao}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

ComparisonTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComparisonTable);