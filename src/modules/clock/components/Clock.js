// @flow
import React, { Component } from 'react';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';


export default class Console extends Component {
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
            <Typography variant="display1">{this.state.currentTime}</Typography>
        );
    }
}
