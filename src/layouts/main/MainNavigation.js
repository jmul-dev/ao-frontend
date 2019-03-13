import React from "react";
import { Link, NavLink } from "react-router-dom";
import ButtonBase from "@material-ui/core/ButtonBase";
import { connect } from "react-redux";
import classnames from "classnames";
import { compose } from "react-apollo";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import navIconBrowseSrc from "../../assets/nav-icon-browse.svg";
import navIconTokenExchangeSrc from "../../assets/nav-icon-token-exchange.svg";
import navIconMyVideosSrc from "../../assets/nav-icon-my-videos.svg";
import navIconUploadSrc from "../../assets/nav-icon-upload-videos.svg";
import navIconWalletSrc from "../../assets/nav-icon-my-wallet.svg";
import navIconSettingsSrc from "../../assets/nav-icon-settings.svg";
import navIconMetamaskSrc from "../../assets/nav-icon-metamask.svg";
import navIconIngressSrc from "../../assets/nav-icon-ingress.svg";
import navIconDevelopersSrc from "../../assets/nav-icon-developers.svg";
import navIconDaoSrc from "../../assets/icon-logo.svg";
import DownloadsList from "../../modules/downloads/components/DownloadsList";
import { APP_STATES } from "../../store/app.reducer";
import Account from "../../modules/account/components/Account";
import WalletBalances from "../../modules/wallet/components/WalletBalances";
import Tooltip from "@material-ui/core/Tooltip";
import WarningIcon from "@material-ui/icons/Warning";

const openMetamask = () => {
    window.chrome.ipcRenderer.send("open-metamask-popup");
};

const MainNavigation = ({
    isElectron,
    offcanvas,
    ethAddress,
    showDownloads,
    overlayViewsActive,
    primordialSaleEnded,
    ingressTabDisabled,
    classes
}) => (
    <nav className={classnames("MainNavigation", { offcanvas })}>
        <div className={classes.container}>
            <ul className={classes.navList}>
                <li
                    className={`${classes.navListItem} ${
                        classes.walletListItem
                    }`}
                >
                    <NavLink
                        className={`${classes.navListItemLink} ${
                            classes.navListItemWallet
                        }`}
                        to="/app/view/wallet"
                        replace={overlayViewsActive}
                    >
                        <div className={classes.navListItemWalletTitle}>
                            {ethAddress ? (
                                <Account
                                    display="ethIcon"
                                    className={classes.navLinkIcon}
                                    size={20}
                                />
                            ) : (
                                <Tooltip
                                    title={`Sign in via Metamask`}
                                    placement="right"
                                >
                                    <WarningIcon
                                        className={classes.navLinkIcon}
                                        alt="Sign in"
                                        color="action"
                                    />
                                </Tooltip>
                            )}
                            <Typography
                                variant="caption"
                                className={classes.navLinkCopy}
                            >
                                {"My Wallet"}
                            </Typography>
                        </div>
                        <div className={classes.navListItemWalletBalances}>
                            <WalletBalances>
                                {({
                                    primordialTokenBalanceFormatted,
                                    networkTokenBalanceFormatted
                                }) => (
                                    <React.Fragment>
                                        <Typography
                                            variant="caption"
                                            className={
                                                classes.walletBalanceCopy
                                            }
                                            style={{ marginBottom: 4 }}
                                        >
                                            {primordialTokenBalanceFormatted}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            className={
                                                classes.walletBalanceCopy
                                            }
                                        >
                                            {networkTokenBalanceFormatted}
                                        </Typography>
                                    </React.Fragment>
                                )}
                            </WalletBalances>
                        </div>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink
                        className={classes.navListItemLink}
                        to="/app"
                        exact
                    >
                        <img
                            src={navIconBrowseSrc}
                            className={classes.navLinkIcon}
                            alt="Browse"
                        />
                        <Typography
                            variant="caption"
                            className={classes.navLinkCopy}
                        >
                            {"Browse"}
                        </Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink
                        className={`${classes.navListItemLink} ${
                            primordialSaleEnded ? "ended" : ""
                        }`}
                        to="/app/view/ico"
                        replace={overlayViewsActive}
                    >
                        <img
                            src={navIconTokenExchangeSrc}
                            className={classes.navLinkIcon}
                            alt="Exchange"
                        />
                        <Typography
                            variant="caption"
                            className={classes.navLinkCopy}
                        >
                            {"Exchange"}
                        </Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink
                        className={classes.navListItemLink}
                        to="/app/view/account"
                        replace={overlayViewsActive}
                    >
                        <img
                            src={navIconMyVideosSrc}
                            className={classes.navLinkIcon}
                            alt="My Content"
                        />
                        <Typography
                            variant="caption"
                            className={classes.navLinkCopy}
                        >
                            {"My Content"}
                        </Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink
                        className={classes.navListItemLink}
                        to="/app/view/upload"
                        replace={overlayViewsActive}
                    >
                        <img
                            src={navIconUploadSrc}
                            className={classes.navLinkIcon}
                            alt="Upload Content"
                        />
                        <Typography
                            variant="caption"
                            className={classes.navLinkCopy}
                        >
                            {"Upload Content"}
                        </Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink
                        className={classes.navListItemLink}
                        to="/app/view/settings"
                        replace={overlayViewsActive}
                    >
                        <img
                            src={navIconSettingsSrc}
                            className={classes.navLinkIcon}
                            alt="Settings"
                        />
                        <Typography
                            variant="caption"
                            className={classes.navLinkCopy}
                        >
                            {"Settings"}
                        </Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink
                        className={classes.navListItemLink}
                        to="/app/view/ingress"
                        replace={overlayViewsActive}
                        disabled={ingressTabDisabled}
                    >
                        <img
                            src={navIconIngressSrc}
                            className={classes.navLinkIcon}
                            alt="Ingress"
                        />
                        <Typography
                            variant="caption"
                            className={classes.navLinkCopy}
                        >
                            {"Ingress"}
                        </Typography>
                    </NavLink>
                </li>
                {isElectron ? (
                    <li className={classes.navListItem}>
                        <ButtonBase
                            className={classes.navListItemLink}
                            onClick={openMetamask}
                            disableRipple={true}
                        >
                            <img
                                src={navIconMetamaskSrc}
                                className={classes.navLinkIcon}
                                alt="Metamask"
                            />
                            <Typography
                                variant="caption"
                                className={classes.navLinkCopy}
                            >
                                {"Metamask"}
                            </Typography>
                        </ButtonBase>
                    </li>
                ) : null}
                <li className={classes.navListItem}>
                    <NavLink
                        className={classes.navListItemLink}
                        to="/app/view/dao"
                    >
                        <img
                            src={navIconDaoSrc}
                            className={classes.navLinkIcon}
                            alt="The AO"
                        />
                        <Typography
                            variant="caption"
                            className={classes.navLinkCopy}
                        >
                            {"The AO"}
                        </Typography>
                    </NavLink>
                </li>
                <li className={classes.navListItem}>
                    <NavLink
                        className={classes.navListItemLink}
                        to="/app/view/developers"
                    >
                        <img
                            src={navIconDevelopersSrc}
                            className={classes.navLinkIcon}
                            alt="Developers"
                        />
                        <Typography
                            variant="caption"
                            className={classes.navLinkCopy}
                        >
                            {"Developers"}
                        </Typography>
                    </NavLink>
                </li>
            </ul>
            {showDownloads ? (
                <div className={classes.downloadsContainer}>
                    <DownloadsList />
                </div>
            ) : null}
        </div>
    </nav>
);

const styles = ({ palette, spacing }) => ({
    container: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto"
    },
    navList: {
        listStyle: "none",
        margin: 0,
        padding: 0
    },
    walletListItem: {
        borderBottom: `1px solid ${palette.divider}`
    },
    navListItem: {
        overflow: "hidden"
    },
    navListItemLink: {
        padding: `${12}px ${spacing.unit * 2}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        textDecoration: "none",
        borderLeft: `3px solid transparent`,
        opacity: 0.75,
        "&.active": {
            borderLeft: `3px solid ${palette.primary.main}`,
            backgroundColor: palette.divider, // '#151515'
            color: palette.common.white,
            opacity: 1
        },
        "&:hover": {
            backgroundColor: `rgba(255, 255, 255, 0.1)`
        }
    },
    navListItemWallet: {
        flexDirection: "column",
        alignItems: "flex-start",
        paddingTop: 32,
        paddingBottom: 24
    },
    navListItemWalletTitle: {
        display: "flex",
        alignItems: "center"
    },
    navListItemWalletBalances: {
        paddingLeft: 29,
        marginTop: 8
    },
    walletBalanceCopy: {
        color: "#777777",
        fontWeight: "bold"
    },
    navLinkCopy: {
        fontWeight: "bold"
    },
    navLinkIcon: {
        height: 20,
        width: 20,
        marginRight: spacing.unit
    },
    downloadsContainer: {
        marginTop: "auto",
        minHeight: "min-content"
    }
});

const mapStateToProps = store => {
    return {
        offcanvas: store.video.teaserListingActive,
        showDownloads:
            store.app.ethAddress && store.app.states[APP_STATES.CORE_READY],
        overlayViewsActive:
            store.router.location.pathname.indexOf("/app/view") > -1,
        isElectron: store.electron.isElectron,
        ethAddress: store.app.ethAddress,
        primordialSaleEnded: store.ico.primordialSaleEnded,
        ingressTabDisabled: !store.contracts.settings.ingressUrl
    };
};

export default compose(
    withRouter,
    withStyles(styles),
    connect(mapStateToProps)
)(MainNavigation);
