import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import EarningsInputFields from './EarningsInputFields';
import { darkTheme } from '../../../theme';


const styles = theme => ({
    root: {
        
    },
    gridLeft: {
        width: 250,
    },
        paper: {
            overflow: 'hidden'
        },
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
                <div className={classes.gridLeft}>
                    <Typography variant="subheading">{`Inputs`}</Typography>                    
                    <Paper elevation={18} className={classes.paper}>
                        <MuiThemeProvider theme={darkTheme}>
                            <EarningsInputFields />
                        </MuiThemeProvider>
                    </Paper>
                </div>
                <div className={classes.containerGraph}>

                </div>
            </div>
        );
    }
}

EarningsCalculator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EarningsCalculator);