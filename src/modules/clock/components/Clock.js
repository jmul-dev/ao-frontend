import React, { Component } from 'react';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';


export default class Clock extends Component {
    constructor() {
        super()
        this.state = {
            currentTime: moment().format('LT')
        }
    }
    componentDidMount() {
        this._interval = setTimeout(() => {
            this.setState({
                currentTime: moment().format('LT')
            })
        }, 60000)
    }
    componentWillUnmount() {
        clearInterval(this._interval)
    }
    render() {
        return (
            <Typography variant="display1" style={{color: 'white', fontSize: '2.8125rem'}}>{this.state.currentTime}</Typography>
        );
    }
}
