import { connect } from 'react-redux'
import { setSearchBarActive, updateSearchValue } from '../reducers/video.reducer'


// Redux
const mapDispatchToProps = {
    setSearchBarActive,
    updateSearchValue,
}

const mapStateToProps = (store) => {
    return {
        searchBarActive: store.video.searchBarActive,
        searchString: store.video.searchString,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)
