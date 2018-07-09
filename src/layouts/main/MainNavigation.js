// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { LogoIcon, AccountIcon, UploadIcon, SettingsIcon } from '../../assets/Icons';
import { connect } from 'react-redux';
import classnames from 'classnames'

const BrowseLink = props => <Link to="/app" {...props} />
const AccountLink = props => <Link to="/app/view/account" {...props} />
const UploadLink = props => <Link to="/app/view/upload" {...props} />
const SettingsLink = props => <Link to="/app/view/settings" {...props} />

const MainNavigation = ({teaserListingActive, light, dark}) => (
    <nav className={classnames('MainNavigation', {light, dark, offcanvas: teaserListingActive})}>
        <div style={{display: 'flex'}}>
            <Button component={BrowseLink}>
                <LogoIcon />
            </Button>
            <Button component={AccountLink}>
                <AccountIcon color={light ? '#000000' : '#FFFFFF'} />
            </Button>
            <Button component={UploadLink}>
                <UploadIcon color={light ? '#000000' : '#FFFFFF'} />
            </Button>
            <Button component={SettingsLink}>
                <SettingsIcon color={light ? '#000000' : '#FFFFFF'} />
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