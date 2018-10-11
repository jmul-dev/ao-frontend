import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withAccountVideoFilters from '../containers/withAccountVideoFilters';
import PropTypes from 'prop-types';
import { MEDIA_TYPES } from '../reducers/account.reducer';
import AccountViewContentTypeFilters from './AccountViewContentTypeFilters';


class AccountVideoFilters extends PureComponent {
    static propTypes = {
        // redux bound state
        ethAddress: PropTypes.string,
        filter: PropTypes.oneOf(['downloaded', 'uploaded']),
        ordering: PropTypes.string,
        contentTypeFilter: PropTypes.oneOf(MEDIA_TYPES).isRequired,
        // redux bound actions
        setAccountVideoListingFilter: PropTypes.func.isRequired,
        setAccountVideoListingOrdering: PropTypes.func.isRequired,
        setAccountContentTypeFilter: PropTypes.func.isRequired,
    }
    _setActiveFilter = (filter) => {
        this.props.setAccountVideoListingFilter(filter)
    }
    render() {
        const { disabled, filter, contentTypeFilter } = this.props
        return (
            <div className="AccountVideoFilters">
                <AccountViewContentTypeFilters 
                    onChange={this.props.setAccountContentTypeFilter}
                    contentTypeFilter={contentTypeFilter}
                />
                <div style={{marginTop: 40, marginLeft: -16}}>
                    <Button onClick={this._setActiveFilter.bind(this, 'downloaded')} disabled={disabled || filter === 'downloaded'}>
                        <Typography variant="display3" component="span" style={{color: filter === 'downloaded' ? '#FFFFFF' : '#777777'}}>
                            {`Downloaded`}
                        </Typography>
                    </Button>
                    <Button onClick={this._setActiveFilter.bind(this, 'uploaded')} disabled={disabled || filter === 'uploaded'}>
                        <Typography variant="display3" component="span" style={{color: filter === 'uploaded' ? '#FFFFFF' : '#777777'}}>
                            {'Uploaded'}
                        </Typography>
                    </Button>    
                </div>            
            </div>
        )
    }
}

export default withAccountVideoFilters(AccountVideoFilters)