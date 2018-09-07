import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withAccountVideoFilters from '../containers/withAccountVideoFilters';
import '../styles/account-video-filters.css';
import PropTypes from 'prop-types';


class AccountVideoFilters extends PureComponent {
    static propTypes = {
        // redux bound state
        ethAddress: PropTypes.string,
        filter: PropTypes.oneOf(['downloaded', 'uploaded']),
        ordering: PropTypes.string,
        // redux bound actions
        setAccountVideoListingFilter: PropTypes.func.isRequired,
        setAccountVideoListingOrdering: PropTypes.func.isRequired,
    }
    _setActiveFilter = (filter) => {
        this.props.setAccountVideoListingFilter(filter)
    }
    render() {
        const { disabled, filter } = this.props
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