// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import PlayIcon from '@material-ui/icons/PlayArrow';
import { connect } from 'react-redux';

const BrowseLink = props => <Link to="/app" {...props} />
const AccountLink = props => <Link to="/app/account" {...props} />
const UploadLink = props => <Link to="/app/upload" {...props} />
const SettingsLink = props => <Link to="/app/settings" {...props} />

const MainNavigation = ({teaserListingActive}) => (
    <nav className={`MainNavigation ${teaserListingActive ? 'offcanvas' : ''}`}>
        <div style={{display: 'flex'}}>
            <Button component={BrowseLink}>
                <PlayIcon />
            </Button>
            <Button component={AccountLink}>
                <PersonIcon />
            </Button>
            <Button component={UploadLink}>
                <AddIcon />
            </Button>
            <Button component={SettingsLink}>
                <SettingsIcon />
            </Button>
        </div>
    </nav>
)
const mapStateToProps = (store) => {
    return {
        teaserListingActive: store.video.teaserListingActive
    }
}
export default connect(mapStateToProps)(MainNavigation)