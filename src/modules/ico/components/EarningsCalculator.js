import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import EarningsInputFields from './EarningsInputFields';
import { darkTheme } from '../../../theme';
import EarningsGraph from './EarningsGraph';


const DAY_RANGE = 365


const styles = theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    gridLeft: {
        width: 250,
        flexShrink: 0,
    },
        paperInputs: {
            overflow: 'hidden',
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
    gridRight: {
        flex: 1,
    },
        paperGraph: {
            overflow: 'hidden'
        },
});

class EarningsCalculator extends Component {
    constructor() {
        super()
        this.state = {
            dataset: [],
            yAxisRange: 0,
            userInputs: {
                networkTokensStaked: 1 * Math.pow(10, 9),  // 1 giga AO
                primordialTokensStaked: 1.5 * Math.pow(10, 9),  // 1.5 giga AO+
                primordialTokenMultiplier: 3.5,
                networkNodes: 100,
                dailyGrowth: 1,
                dailyContentRequestRate: 1,
                saturation: 20,
                creatorShare: 30,
                networkInflation: 10,
                weightedPrimordialTokenMultiplier: 310,
            }
        }
    }
    componentDidMount() {
        this._generateDataset()
    }
    _onInputsChange = (updatedInputs) => {
        this.setState({ userInputs: updatedInputs }, () => {
            this._generateDataset()
        })
    }
    _generateDataset = () => {
        const { userInputs } = this.state
        const networkTokensStakedGiga = userInputs.networkTokensStaked / Math.pow(10, 9)
        const primordialTokensStakedGiga = userInputs.primordialTokensStaked / Math.pow(10, 9)
        let inputs = {
            ...userInputs,
            // Converting staked values into giga-denomination
            networkTokensStaked: networkTokensStakedGiga,
            primordialTokensStaked: primordialTokensStakedGiga,
            // Need to convert percentage values to decimal format
            dailyGrowth: userInputs.dailyGrowth / 100.0,
            dailyContentRequestRate: userInputs.dailyContentRequestRate / 100.0,
            saturation: userInputs.saturation / 100.0,
            creatorShare: userInputs.creatorShare / 100.0,
            networkInflation: userInputs.networkInflation / 100.0,
            weightedPrimordialTokenMultiplier: (networkTokensStakedGiga + (primordialTokensStakedGiga * userInputs.primordialTokenMultiplier)) / (networkTokensStakedGiga + primordialTokensStakedGiga) / 100.0,
        }
        let dataset = []
        // Mimicking data sheet
        for (let row = 0; row < DAY_RANGE; row++) {
            let previousRow = dataset[row - 1]
            /* day, nodes, reqNodes, nodesWithContent, baseAo, cumBaseAo, baseInflationAo, cumBaseInflationAo, ao+BonusAo, creatorAoFromContent, nodeAOFromContent, creatorBaseAo */
            let rowData = {}
            // day
            rowData[0] = row + 1
            // nodes
            rowData[1] = previousRow ? 
                previousRow[1] * (1 + inputs.dailyGrowth) :
                inputs.networkNodes
            // reqNodes
            rowData[2] = rowData[1] * inputs.dailyContentRequestRate
            // nodesWithContent
            if (row === 0)
                rowData[3] = rowData[2]
            else if (row === 1)
                rowData[3] = rowData[2] + previousRow[3]
            else
                rowData[3] = (rowData[2] + previousRow[3]) / rowData[1] < inputs.saturation ? rowData[2] + previousRow[3] : previousRow[3]
            // baseAo
            rowData[4] = previousRow ?
                rowData[2] * inputs.networkTokensStaked + inputs.primordialTokensStaked :
                (inputs.networkTokensStaked + inputs.primordialTokensStaked) * -1
            // cumBaseAo
            rowData[5] = previousRow ?                    
                rowData[4] + previousRow[5] :
                rowData[4]
            // baseInflationAo
            rowData[6] = previousRow ?
                rowData[2] * inputs.networkInflation :
                0
            // cumBaseInflationAo
            rowData[7] = previousRow ?
                rowData[6] + previousRow[7] :
                0
            // ao+BonusAo
            rowData[8] = rowData[7] * inputs.weightedPrimordialTokenMultiplier
            // creatorAoFromContent
            rowData[9] = previousRow ?
                (rowData[8] + rowData[5]) * inputs.creatorShare :
                0
            // nodeAOFromContent
            rowData[10] = previousRow ?
                (rowData[5] + rowData[8]) * (1 - inputs.creatorShare) :
                0
            // creatorBaseAo
            rowData[11] = previousRow ?
                (rowData[5] + rowData[7]) * inputs.creatorShare :
                rowData[5]
            dataset.push(rowData)
        }
        this.setState({dataset})
    }
    render() {
        const { classes } = this.props;
        const { dataset } = this.state
        return (
            <div className={classes.root}>
                <div className={classes.gridLeft}>
                    <Typography variant="subheading" style={{color: '#BCBCBC'}}>{`Inputs`}</Typography>
                    <Paper elevation={18} className={classes.paperInputs}>
                        <MuiThemeProvider theme={darkTheme}>
                            <EarningsInputFields
                                inputs={this.state.userInputs}
                                onChange={this._onInputsChange}
                            />
                        </MuiThemeProvider>
                    </Paper>
                </div>
                <div className={classes.gridRight}>
                    <Paper elevation={24} className={classes.paperGraph}>
                        <EarningsGraph dataset={dataset} />
                    </Paper>
                </div>
            </div>
        );
    }
}

EarningsCalculator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EarningsCalculator);