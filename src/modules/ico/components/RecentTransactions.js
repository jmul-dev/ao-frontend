import React, { Component } from 'react';
import withIcoState from '../containers/withIcoState';
import BigNumber from 'bignumber.js';
import { TokenBalance } from '../../../utils/denominations';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


class RecentTransactions extends Component<Props> {
    static propsTypes = {
        // redux bound state
        lotCreations: PropTypes.arrayOf(PropTypes.shape({
            blockNumber: PropTypes.number,
            lotOwner: PropTypes.string,
            lotId: PropTypes.string,
            index: PropTypes.string,
            tokenAmount: PropTypes.instanceOf(BigNumber),
        })),
        // redux bound actions
        startListeningForRecentTransactions: PropTypes.func.isRequired,
        stopListeningForRecentTransactions: PropTypes.func.isRequired,
    }
    componentDidMount() {
        this.props.startListeningForRecentTransactions()
    }
    componentWillUnmount() {
        this.props.stopListeningForRecentTransactions()
    }
    render() {
        const { classes, lotCreations } = this.props
        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.cell}>user</TableCell>
                        <TableCell className={classes.cell}>amount</TableCell>
                        <TableCell className={classes.cell}>multiplier</TableCell>
                        <TableCell className={classes.cell}>block</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lotCreations.map(row => {
                        return (
                            <TableRow key={row.lotId}>
                                <TableCell className={classes.cell}>{row.lotOwner}</TableCell>
                                <TableCell className={`${classes.cell} ${classes.tokenCell}`}>
                                    <TokenBalance baseAmount={row.tokenAmount} isPrimordial={true} includeAO={true} />
                                </TableCell>
                                <TableCell className={classes.cell}>{row.index}</TableCell>
                                <TableCell className={classes.cell}>{row.blockNumber}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        )
    }
}

const styles = (theme) => ({
    table: {

    },
    cell: {
        borderBottom: `1px solid ${theme.palette.secondary.dark}`,
        letterSpacing: 0.25,
    },
    tokenCell: {
        minWidth: 100,
    }
});

// NOTE: only exporting here for storybook rendering
export const RecentTransactionsWithStyles = withStyles(styles)(RecentTransactions)

export default withIcoState(RecentTransactionsWithStyles)