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

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        borderRadius: 0,
    },
    table: {
        maxWidth: `100%`,
    },
    thUsd: {
        background: `#424B62`
    },
    cell: {

    },
    cellLabel: {
        background: theme.palette.grey['400'],
        color: 'white'
    },
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
    id += 1;
    return { id, name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function ComparisonTable(props) {
    const { classes } = props;
    return (
        <Paper className={classes.root} elevation={0}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell color="primary" className={classes.cellLabel}>
                            Currency
                        </TableCell>
                        <TableCell className={classes.thUsd}>
                            <div>
                                <Typography variant="title">{`USD`}</Typography>
                                $
                            </div>
                            <Typography variant="body1">{`US Dollar`}</Typography>
                        </TableCell>
                        <TableCell numeric>Fat (g)</TableCell>
                        <TableCell numeric>Carbs (g)</TableCell>
                        <TableCell numeric>Protein (g)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row" className={classes.cellLabel}>
                                    {row.name}
                                </TableCell>
                                <TableCell numeric>{row.calories}</TableCell>
                                <TableCell numeric>{row.fat}</TableCell>
                                <TableCell numeric>{row.carbs}</TableCell>
                                <TableCell numeric>{row.protein}</TableCell>
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