import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ContainerDimensions from 'react-container-dimensions';
import { LineChart, Line, XAxis, YAxis, ReferenceLine,
    ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
    Label, LabelList } from 'recharts';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        borderRadius: 0,
    }
});

class EarningsGraph extends Component {
    _renderTooltip = (props) => {
        const { payload, label } = props
        console.log(props)
        return (
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                <li><Typography>{`Days: ${label}`}</Typography></li>
                {payload.map((entry, index) => (
                    <li key={index}>
                        <Typography style={{color: entry.color}}>{entry.value.toFixed(2)}</Typography>                    
                    </li>
                ))}
            </ul>
        )
    }
    _renderLegend = (props) => {
        const { payload } = props        
        return (
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                {payload.map((entry, index) => (
                    <li key={index}>
                        <Typography style={{color: entry.color}}>{entry.dataKey === 9 ? `Earnings w/ AO+ Staked` : `Earnings w/o AO+ Staked`}</Typography>                    
                    </li>
                ))}
            </ul>
        )
    }
    render() {
        const { classes, dataset, yAxisRange, xAxisRange, theme } = this.props;
        return (
            <div className="EarningsGraph">
                <ContainerDimensions>
                    {({ width, height }) => (
                        <LineChart
                            width={width}
                            height={width}
                            data={dataset}
                            margin={{top: 48, right: 16}}
                        >
                            <Tooltip content={this._renderTooltip} />
                            <Legend align="left" verticalAlign="top" height={48} content={this._renderLegend} wrapperStyle={{top: 24, left: 80}} />
                            <XAxis xAxisId="days" stroke="#BCBCBC" dataKey={0} tickLine={false} axisLine={false} ticks={[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]} />
                            <YAxis yAxisId="ao" stroke="#BCBCBC" width={48} dataKey={9} tickLine={false} axisLine={false} />
                            <CartesianGrid stroke="#F4F4F4" horizontal={true} vertical={false} offset={{left: -50}} />
                            <Line 
                                type="monotone"
                                xAxisId="days"
                                yAxisId="ao"
                                dataKey={9}
                                stroke={theme.palette.primary.main}
                                dot={false}
                                animationEasing="ease-out"
                            />
                            <Line 
                                type="monotone"
                                xAxisId="days"
                                yAxisId="ao"
                                dataKey={11}
                                stroke={theme.palette.secondary.main}
                                dot={false}
                                animationEasing="ease-out"
                            />
                            {/* <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} /> */}
                        </LineChart>
                    )}
                </ContainerDimensions>
            </div>
        );
    }
}

EarningsGraph.propTypes = {
    classes: PropTypes.object.isRequired,
    yAxisRange: PropTypes.number.isRequired,
    xAxisRange: PropTypes.number.isRequired,
    dataset: PropTypes.array.isRequired,
};

export default withStyles(styles, {withTheme: true})(EarningsGraph);