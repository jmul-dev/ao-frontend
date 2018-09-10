import React, { Component } from 'react';
import withSearch from '../containers/withSearch';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import '../styles/search-bar.css';


class SearchBar extends Component {
    static propTypes = {
        // redux bound state
        searchString: PropTypes.string,
        searchBarActive: PropTypes.bool,
        // redux bound actions
        setSearchBarActive: PropTypes.func.isRequired,
        updateSearchValue: PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props)
        this.state = {
            tempSearchInput: props.searchString
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.searchBarActive && nextProps.searchBarActive) {
            this.inputRef.focus()
        }
        if (this.props.searchBarActive && !nextProps.searchBarActive) {
            this.setState({ tempSearchInput: nextProps.searchString })
            this.inputRef.blur()
        }
    }
    _closeSearchBar = () => {
        this.props.setSearchBarActive(false)
    }
    _openSearchBar = () => {
        this.props.setSearchBarActive(true)
    }
    _closeAndClearSearch = () => {
        this.props.setSearchBarActive(false)
        this.props.updateSearchValue('')
    }
    _onSearchInputChange = (event) => {
        this.setState({ tempSearchInput: event.target.value })
    }
    _search = (event) => {
        if (event)
            event.preventDefault()
        this.props.updateSearchValue(this.state.tempSearchInput)
        this.props.setSearchBarActive(false)
        // TODO, search
    }
    render() {
        const { searchString, searchBarActive } = this.props
        const { tempSearchInput } = this.state
        const searchBarMinimized = searchString && !searchBarActive
        return (
            <div className="SearchBar">
                <div className="close-container">
                    <IconButton style={{ marginRight: '-14px' }} onClick={this._closeSearchBar}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <form className="input-container" onSubmit={this._search}>
                    <TextField
                        className="search-input"
                        inputRef={inputRef => { this.inputRef = inputRef }}
                        onFocus={this._openSearchBar}
                        placeholder="Search videos"
                        value={tempSearchInput}
                        onChange={this._onSearchInputChange}
                        margin="normal"
                        fullWidth
                    />
                    <div className="action-button">
                        {searchBarMinimized ? (
                            <IconButton onClick={this._closeAndClearSearch}>
                                <CloseIcon />
                            </IconButton>
                        ) : (
                            <Button onClick={this._search}>{`Search`}</Button>
                        )}
                    </div>
                </form>
            </div>
        );
    }
}

export default withSearch(SearchBar)