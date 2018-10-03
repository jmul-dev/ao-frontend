import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import { LogoIcon } from '../../assets/Icons';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import navIconBrowseSrc from '../../assets/nav-icon-browse.svg';
import navIconTokenExchangeSrc from '../../assets/nav-icon-token-exchange.svg';
import navIconMyVideosSrc from '../../assets/nav-icon-my-videos.svg';
import navIconUploadSrc from '../../assets/nav-icon-upload-videos.svg';
import navIconWalletSrc from '../../assets/nav-icon-my-wallet.svg';
import navIconSettingsSrc from '../../assets/nav-icon-settings.svg';
import navIconMetamaskSrc from '../../assets/nav-icon-metamask.svg';
import DownloadsList from '../../modules/downloads/components/DownloadsList';
import { APP_STATES } from '../../store/app.reducer';
import BackArrow from '@material-ui/icons/KeyboardArrowLeft';


const openMetamask = () => {
    window.chrome.ipcRenderer.send('open-metamask-popup')
}

const MainNavigation = ({ isElectron, offcanvas, showDownloads, overlayViewsActive, classes, isVideoItemPage }) => (
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
                        <img src={navIconBrowseSrc} className={classes.navLinkIcon} alt="Browse" />
                        <Typography variant="caption" className={classes.navLinkCopy}>{'Browse'}</Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink className={classes.navListItemLink} to="/app/view/ico" replace={overlayViewsActive}>
                        <img src={navIconTokenExchangeSrc} className={classes.navLinkIcon} alt="Coin Exchange" />
                        <Typography variant="caption" className={classes.navLinkCopy}>{'Coin Exchange'}</Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink className={`${classes.navListItemLink} ${isVideoItemPage ? classes.navListItemLinkIndented : ''}`} to="/app/view/videos" replace={overlayViewsActive}>
                        {isVideoItemPage ? (
                            <BackArrow className={classes.navLinkIcon} />
                        ) : (
                            <img src={navIconMyVideosSrc} className={classes.navLinkIcon} alt="My Videos" />
                        )}
                        <Typography variant="caption" className={classes.navLinkCopy}>{isVideoItemPage ? 'Back to Videos' : 'My Videos'}</Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink className={classes.navListItemLink} to="/app/view/upload" replace={overlayViewsActive}>
                        <img src={navIconUploadSrc} className={classes.navLinkIcon} alt="Upload Videos" />
                        <Typography variant="caption" className={classes.navLinkCopy}>{'Upload Videos'}</Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink className={classes.navListItemLink} to="/app/view/wallet" replace={overlayViewsActive}>
                        <img src={navIconWalletSrc} className={classes.navLinkIcon} alt="Wallet" />
                        <Typography variant="caption" className={classes.navLinkCopy}>{'My Wallet'}</Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink className={classes.navListItemLink} to="/app/view/settings" replace={overlayViewsActive}>
                        <img src={navIconSettingsSrc} className={classes.navLinkIcon} alt="Settings" />
                        <Typography variant="caption" className={classes.navLinkCopy}>{'Settings'}</Typography>
                    </NavLink>
                </li>
                {isElectron ? (
                    <li className={classes.navListItem}>
                        <ButtonBase className={classes.navListItemLink} onClick={openMetamask} disableRipple={true}>
                            <img src={navIconMetamaskSrc} className={classes.navLinkIcon} alt="Metamask" />
                            <Typography variant="caption" className={classes.navLinkCopy}>{'Metamask'}</Typography>
                        </ButtonBase>
                    </li>
                ) : null}
            </ul>            
            {showDownloads ? (
                <div className={classes.downloadsContainer}>
                    <DownloadsList />
                </div>
            ) : null}                  
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
            overflow: 'hidden',
        },
        navListItemLink: {
            padding: `${12}px ${spacing.unit * 2}px`,
            transition: `transform 250ms ease-out`,
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            borderLeft: `3px solid transparent`,
            opacity: 0.75,
            '&.active': {
                borderLeft: `3px solid ${palette.primary.main}`,
                backgroundColor: palette.divider, // '#151515'
                color: palette.common.white,
                opacity: 1,
            },
        },
        navListItemLinkIndented: {
            transform: `translateX(${spacing.unit * 5}px)`
        },
        navLinkCopy: {
            fontWeight: 'bold',
        },
        navLinkIcon: {
            height: 20,
            width: 'auto',
            marginRight: spacing.unit,
        },
    downloadsContainer: {
        marginTop: 'auto',
        overflowY: 'scroll',
        overflowX: 'hidden',
    }
})

const mapStateToProps = (store) => {
    return {        
        offcanvas: store.video.teaserListingActive,
        showDownloads: store.app.ethAddress && store.app.states[APP_STATES.CORE_READY],
        overlayViewsActive: store.router.location.pathname.indexOf('/app/view') > -1,
        isElectron: store.electron.isElectron,
        isVideoItemPage: store.router.location.pathname.indexOf('/app/view/videos/') > -1,
    }
}

export default compose(
    withRouter,
    withStyles(styles),
    connect(mapStateToProps),
)(MainNavigation)
