// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { LogoIcon, AccountIcon, UploadIcon, SettingsIcon } from '../../assets/Icons';
import { connect } from 'react-redux';

const BrowseLink = props => <Link to="/app" {...props} />
const AccountLink = props => <Link to="/app/account" {...props} />
const UploadLink = props => <Link to="/app/upload" {...props} />
const SettingsLink = props => <Link to="/app/settings" {...props} />

const MainNavigation = ({teaserListingActive}) => (
    <nav className={`MainNavigation ${teaserListingActive ? 'offcanvas' : ''}`}>
        <div style={{display: 'flex'}}>
            <Button component={BrowseLink}>
                <LogoIcon />
            </Button>
            <Button component={AccountLink}>
                <AccountIcon />
            </Button>
            <Button component={UploadLink}>
                <UploadIcon />
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