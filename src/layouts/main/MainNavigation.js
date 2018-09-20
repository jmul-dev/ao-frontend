// @flow
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { LogoIcon, AccountIcon, UploadIcon, SettingsIcon, MetamaskIcon, NetworkExchangeIcon } from '../../assets/Icons';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter } from 'react-router';


const BrowseLink = ({overlayViewsActive, ...props}) => <Link to="/app" {...props} />
const AccountLink = ({overlayViewsActive, ...props}) => <NavLink to="/app/view/account" replace={overlayViewsActive} {...props} />
const UploadLink = ({overlayViewsActive, ...props}) => <NavLink to="/app/view/upload" replace={overlayViewsActive} {...props} />
const SettingsLink = ({overlayViewsActive, ...props}) => <NavLink to="/app/view/settings" replace={overlayViewsActive} {...props} />
const IcoLink = ({overlayViewsActive, ...props}) => <NavLink to="/app/view/ico" replace={overlayViewsActive} {...props} />

const openMetamask = () => {
    window.chrome.ipcRenderer.send('open-metamask-popup')
}

const MainNavigation = ({isElectron, teaserListingActive, overlayViewsActive, light, dark}) => (
    <nav className={classnames('MainNavigation', {light, dark, offcanvas: teaserListingActive})}>
        <div style={{display: 'flex'}}>
            <Button component={BrowseLink} overlayViewsActive={overlayViewsActive}>
                <LogoIcon />
            </Button>
            <Button component={IcoLink} overlayViewsActive={overlayViewsActive}>
                <NetworkExchangeIcon color={light ? '#000000' : '#FFFFFF'} />
            </Button>
            <Button component={AccountLink} overlayViewsActive={overlayViewsActive}>
                <AccountIcon color={light ? '#000000' : '#FFFFFF'} />
            </Button>
            <Button component={UploadLink} overlayViewsActive={overlayViewsActive}>
                <UploadIcon color={light ? '#000000' : '#FFFFFF'} />
            </Button>
            <Button component={SettingsLink} overlayViewsActive={overlayViewsActive}>
                <SettingsIcon color={light ? '#000000' : '#FFFFFF'} />
            </Button>            
            {isElectron ? (
                <Button style={{height: 80, marginTop: 'auto'}} onClick={openMetamask}>
                    <MetamaskIcon />
                </Button>
            ) : null}
        </div>
    </nav>
)
const mapStateToProps = (store) => {
    return {
        teaserListingActive: store.video.teaserListingActive,
        overlayViewsActive: store.router.location.pathname.indexOf('/app/view') > -1,
        isElectron: store.electron.isElectron,
    }
}
export default withRouter(connect(mapStateToProps)(MainNavigation))