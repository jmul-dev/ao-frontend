import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withAccountVideoFilters from '../containers/withAccountVideoFilters';
import '../styles/account-video-filters.css';


class AccountVideoFilters extends PureComponent {
    _setActiveFilter = (filter) => {
        this.props.setAccountVideoListingFilter(filter)
    }
    render() {
        const { disabled, filter, ordering } = this.props
        return (
            <div className="AccountVideoFilters">
                <Button onClick={this._setActiveFilter.bind(this, 'uploaded')} disabled={disabled || filter === 'uploaded'}>
                    <Typography variant="title" style={{fontWeight: 'normal', color: filter === 'uploaded' ? '#222222' : '#BCBCBC'}}>
                        {`My videos`}
                    </Typography>
                </Button>
                <Button onClick={this._setActiveFilter.bind(this, 'downloaded')} disabled={disabled || filter === 'downloaded'}>
                    <Typography variant="title" style={{fontWeight: 'normal', color: filter === 'downloaded' ? '#222222' : '#BCBCBC'}}>
                        {`Downloaded`}
                    </Typography>
                </Button>
            </div>
        )
    }
}

export default withAccountVideoFilters(AccountVideoFilters)