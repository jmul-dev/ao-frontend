import React, { Component } from "react";
import withRecentTransactions from "../containers/withRecentTransactions";
import BigNumber from "bignumber.js";
import { TokenBalance } from "../../../utils/denominations";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EtherscanLink from "../../etherscan/EtherscanLink";
import LaunchIcon from "@material-ui/icons/Launch";

class RecentTransactions extends Component<Props> {
    static propsTypes = {
        // redux bound state
        lotCreations: PropTypes.arrayOf(
            PropTypes.shape({
                blockNumber: PropTypes.number,
                transactionHash: PropTypes.string,
                lotOwner: PropTypes.string,
                lotId: PropTypes.string,
                multiplier: PropTypes.number,
                primordialTokenAmount: PropTypes.instanceOf(BigNumber),
                networkTokenBonusAmount: PropTypes.instanceOf(BigNumber)
            })
        ),
    };
    render() {
        const { classes, lotCreations } = this.props;
        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        {/* <TableCell className={classes.cell}>user</TableCell> */}
                        <TableCell className={classes.cell}>amount</TableCell>
                        <TableCell className={classes.cell}>
                            multiplier
                        </TableCell>
                        <TableCell className={classes.cell}>block</TableCell>
                        <TableCell className={classes.cell} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lotCreations.map(row => {
                        return (
                            <TableRow key={row.lotId}>
                                {/* <TableCell className={classes.cell}>{row.lotOwner}</TableCell> */}
                                <TableCell
                                    className={`${classes.cell} ${
                                        classes.tokenCell
                                    }`}
                                >
                                    <TokenBalance
                                        baseAmount={row.primordialTokenAmount}
                                        isPrimordial={true}
                                        includeAO={true}
                                    />
                                </TableCell>
                                <TableCell className={classes.cell}>
                                    {row.multiplier.toFixed(2)}
                                </TableCell>
                                <TableCell className={classes.cell}>
                                    {row.blockNumber}
                                </TableCell>
                                <TableCell className={classes.cell}>
                                    <EtherscanLink
                                        type="tx"
                                        value={row.transactionHash}
                                    >
                                        <LaunchIcon />
                                    </EtherscanLink>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }
}

const styles = theme => ({
    table: {},
    cell: {
        borderBottom: `1px solid ${theme.palette.secondary.dark}`,
        letterSpacing: 0.25,
        padding: `4px 28px 4px 24px`
    },
    tokenCell: {
        minWidth: 180
    }
});

// NOTE: only exporting here for storybook rendering
export const RecentTransactionsWithStyles = withStyles(styles)(
    RecentTransactions
);

export default withRecentTransactions(RecentTransactionsWithStyles);
