import React, { Component } from 'react';
import withSearch from '../containers/withSearch';


class SearchBar extends Component {
    render() {
        const { searchString, searchBarActive } = this.props
        return (
            <div className="SearchBar">
                TODO
            </div>
        );
    }
}

export default withSearch(SearchBar)