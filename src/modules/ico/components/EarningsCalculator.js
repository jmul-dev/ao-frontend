import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        borderRadius: 0,
    }
});

class EarningsCalculator extends Component {
    constructor() {
        super()
        this.state = {
            
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <div className="EarningsCalculator">

            </div>
        );
    }
}

EarningsCalculator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EarningsCalculator);