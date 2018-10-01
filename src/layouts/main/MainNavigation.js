import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import { LogoIcon, AccountIcon, UploadIcon, SettingsIcon, MetamaskIcon, NetworkExchangeIcon } from '../../assets/Icons';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';


const openMetamask = () => {
    window.chrome.ipcRenderer.send('open-metamask-popup')
}

const MainNavigation = ({ isElectron, offcanvas, overlayViewsActive, classes }) => (
    <nav className={classnames('MainNavigation', { offcanvas })}>
        <div style={{ display: 'flex' }}>
            <div className={classes.logoContainer}>
                <Link to="/app">
                    <LogoIcon />
                </Link>
            </div>
            <ul className={classes.navList}>
                <li className={classes.navListItem}>
                    <NavLink className={classes.navListItemLink} to="/app" exact>
                        <LogoIcon className={classes.navLinkIcon} />
                        <Typography variant="caption">{'Browse'}</Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink className={classes.navListItemLink} to="/app/view/ico" replace={overlayViewsActive}>
                        <NetworkExchangeIcon color={'#FFFFFF'} className={classes.navLinkIcon} />
                        <Typography variant="caption">{'Coin Exchange'}</Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink className={classes.navListItemLink} to="/app/view/account" replace={overlayViewsActive}>
                        <AccountIcon color={'#FFFFFF'} className={classes.navLinkIcon} />
                        <Typography variant="caption">{'My Videos'}</Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink className={classes.navListItemLink} to="/app/view/upload" replace={overlayViewsActive}>
                        <UploadIcon color={'#FFFFFF'} className={classes.navLinkIcon} />
                        <Typography variant="caption">{'Upload Videos'}</Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink className={classes.navListItemLink} to="/app/view/settings" replace={overlayViewsActive}>
                        <SettingsIcon color={'#FFFFFF'} className={classes.navLinkIcon} />
                        <Typography variant="caption">{'Settings'}</Typography>
                    </NavLink>
                </li>                
                {isElectron ? (
                    <li className={classes.navListItem}>
                        <ButtonBase className={classes.navListItemLink} onClick={openMetamask} disableRipple={true}>
                            <MetamaskIcon />
                            <Typography variant="caption">{'Metamask'}</Typography>
                        </ButtonBase>
                    </li>
                ) : null}
            </ul>
        </div>
    </nav>
)

const styles = ({palette, spacing}) => ({
    logoContainer: {
        marginTop: 40,
        marginBottom: 48,
        paddingLeft: spacing.unit * 2,
    },
    navList: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
    },
    navListItem: {

    },
    navListItemLink: {
        padding: `${spacing.unit}px ${spacing.unit * 2}px`,
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        borderLeft: `3px solid transparent`,
        '&.active': {
            borderLeft: `3px solid ${palette.primary.main}`,
            backgroundColor: palette.divider, // '#151515'
            color: palette.common.white,
        }
    },
    navLinkIcon: {
        width: 24,
        height: 24,
        marginRight: spacing.unit,
    }
})

const mapStateToProps = (store) => {
    return {
        offcanvas: store.video.teaserListingActive,
        overlayViewsActive: store.router.location.pathname.indexOf('/app/view') > -1,
        isElectron: store.electron.isElectron,
    }
}

export default compose(
    withRouter,
    withStyles(styles),
    connect(mapStateToProps),
)(MainNavigation)
