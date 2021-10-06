/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { CUSTOMER_ACCOUNT, CUSTOMER_ACCOUNT_PAGE, CUSTOMER_WISHLIST } from 'Component/Header/Header.config';
import { updateMeta } from 'Store/Meta/Meta.action';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import OrderReducer from 'Store/Order/Order.reducer';
import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import {
    ACCOUNT_INFORMATION,
    ADDRESS_BOOK,
    FIRST_SECTION, MY_ACCOUNT, MY_DOWNLOADABLE, MY_ORDERS,
    MY_WISHLIST, NEWSLETTER_SUBSCRIPTION,
    SECOND_SECTION, THIRD_SECTION
} from 'Type/Account';
import { LocationType, MatchType } from 'Type/Common';
import { isSignedIn } from 'Util/Auth';
import { withReducers } from 'Util/DynamicReducer';
import history from 'Util/History';
import { appendWithStoreCode, replace } from 'Util/Url';

import MyAccount from './MyAccount.component';
import { ACCOUNT_LOGIN_URL, ACCOUNT_URL } from './MyAccount.config';

export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);
export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

/** @namespace Route/MyAccount/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isMobile: state.ConfigReducer.device.isMobile,
    isWishlistEnabled: state.ConfigReducer.wishlist_general_active,
    wishlistItems: state.WishlistReducer.productsInWishlist,
    isSignedIn: state.MyAccountReducer.isSignedIn,
    newsletterActive: state.ConfigReducer.newsletter_general_active,
    baseLinkUrl: state.ConfigReducer.base_link_url
});

/** @namespace Route/MyAccount/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    requestCustomerData: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch)
    ),
    toggleOverlayByKey: (key) => dispatch(toggleOverlayByKey(key)),
    updateMeta: (meta) => dispatch(updateMeta(meta)),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

/** @namespace Route/MyAccount/Container */
export class MyAccountContainer extends PureComponent {
    static propTypes = {
        changeHeaderState: PropTypes.func.isRequired,
        requestCustomerData: PropTypes.func.isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired,
        toggleOverlayByKey: PropTypes.func.isRequired,
        updateMeta: PropTypes.func.isRequired,
        match: MatchType.isRequired,
        location: LocationType.isRequired,
        isMobile: PropTypes.bool.isRequired,
        wishlistItems: PropTypes.object,
        newsletterActive: PropTypes.bool.isRequired,
        isWishlistEnabled: PropTypes.bool.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        baseLinkUrl: PropTypes.string.isRequired,
        showNotification: PropTypes.func.isRequired
    };

    static defaultProps = {
        wishlistItems: {}
    };

    static tabMap = {
        [MY_ACCOUNT]: {
            url: '',
            tabName: __('My Account'),
            section: FIRST_SECTION
        },
        [MY_ORDERS]: {
            url: '/my-orders',
            tabName: __('My Orders'),
            section: FIRST_SECTION
        },
        [MY_DOWNLOADABLE]: {
            url: '/my-downloadable',
            tabName: __('My Downloadable'),
            section: FIRST_SECTION
        },
        [MY_WISHLIST]: {
            url: '/my-wishlist',
            tabName: __('My Wish List'),
            section: FIRST_SECTION
        },
        [ADDRESS_BOOK]: {
            url: '/address',
            tabName: __('Address Book'),
            section: SECOND_SECTION
        },
        [ACCOUNT_INFORMATION]: {
            url: '/edit',
            tabName: __('Account Information'),
            title: __('Edit Account Information'),
            section: SECOND_SECTION
        },
        [NEWSLETTER_SUBSCRIPTION]: {
            url: '/newsletter-subscription',
            tabName: __('Newsletter Subscription'),
            section: THIRD_SECTION
        }
    };

    static isTabEnabled(props, tabName) {
        const { isWishlistEnabled, newsletterActive } = props;

        switch (tabName) {
        case MY_WISHLIST:
            return isWishlistEnabled;
        case NEWSLETTER_SUBSCRIPTION:
            return newsletterActive;
        default:
            return true;
        }
    }

    static navigateToSelectedTab(props, state = {}) {
        const {
            isSignedIn,
            match: {
                params: {
                    tab: historyActiveTab
                } = {}
            } = {},
            isMobile
        } = props;

        const { activeTab } = state;

        // redirect to Dashboard, if user visited non-existent or disabled page
        const newActiveTab = this.tabMap[historyActiveTab] && this.isTabEnabled(props, historyActiveTab)
            ? historyActiveTab
            : MY_ACCOUNT;
        const { url: activeTabUrl } = this.tabMap[newActiveTab];

        if (historyActiveTab !== newActiveTab && activeTab !== MY_ACCOUNT && isSignedIn && !isMobile) {
            history.push(appendWithStoreCode(`${ ACCOUNT_URL }${ activeTabUrl }`));
        }

        if (activeTab !== newActiveTab) {
            return { activeTab: newActiveTab };
        }

        return null;
    }

    containerFunctions = {
        changeActiveTab: this.changeActiveTab.bind(this),
        onSignIn: this.onSignIn.bind(this),
        onSignOut: this.onSignOut.bind(this),
        getMyWishlistSubHeading: this.getMyWishlistSubHeading.bind(this)
    };

    subHeadingRenderMap = {
        [MY_WISHLIST]: this.getMyWishlistSubHeading.bind(this)
    };

    __construct(props) {
        super.__construct(props);

        const {
            updateMeta,
            toggleOverlayByKey
        } = this.props;

        this.state = {
            ...MyAccountContainer.navigateToSelectedTab(this.props),
            isEditingActive: false
        };

        if (!isSignedIn()) {
            toggleOverlayByKey(CUSTOMER_ACCOUNT);
        }

        updateMeta({ title: __('My account') });

        this.redirectIfNotSignedIn();
        this.onSignIn();
        this.updateBreadcrumbs();

        window.scrollTo({ top: 0 });
    }

    static getDerivedStateFromProps(props, state) {
        return MyAccountContainer.navigateToSelectedTab(props, state);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            wishlistItems: prevWishlistItems,
            isSignedIn: prevIsSignedIn
        } = prevProps;

        const {
            wishlistItems,
            isSignedIn: currIsSignedIn
        } = this.props;

        const { activeTab: prevActiveTab } = prevState;
        const { activeTab } = this.state;

        this.redirectIfNotSignedIn();

        if (prevIsSignedIn !== currIsSignedIn) {
            this.changeMyAccountHeaderState();
        }

        if (prevActiveTab !== activeTab) {
            this.updateBreadcrumbs();
            this.changeMyAccountHeaderState();

            window.scrollTo({ top: 0 });
        }

        if (Object.keys(wishlistItems).length !== Object.keys(prevWishlistItems).length) {
            this.changeMyAccountHeaderState();
        }

        if (!isSignedIn()) {
            this.changeMyAccountHeaderState();
        }
    }

    containerProps() {
        const { activeTab, isEditingActive } = this.state;

        return {
            activeTab,
            isEditingActive,
            subHeading: this.getSubHeading()
        };
    }

    // #region GETTERS
    getSubHeading() {
        const { activeTab } = this.state;

        const subHeadingFunc = this.subHeadingRenderMap[activeTab];

        if (!subHeadingFunc) {
            return null;
        }

        return subHeadingFunc();
    }

    getMyWishlistSubHeading() {
        const count = this.getWishlistItemsCount();

        return ` (${ count })`;
    }

    getWishlistItemsCount() {
        const { wishlistItems } = this.props;

        const { length } = Object.keys(wishlistItems);

        return length;
    }

    getMyWishlistHeaderTitle = () => {
        const count = this.getWishlistItemsCount();

        return `${ count } ${ count === 1 ? __('item') : __('items') }`;
    };
    // #endregion

    // #region HANDLE TABS
    isTabEnabled(tabName) {
        const { isWishlistEnabled, newsletterActive } = this.props;

        switch (tabName) {
        case MY_WISHLIST:
            return isWishlistEnabled;
        case NEWSLETTER_SUBSCRIPTION:
            return newsletterActive;
        default:
            return true;
        }
    }

    tabsFilterEnabled() {
        return Object.fromEntries(Object.entries(MyAccountContainer.tabMap)
            .filter(([tabName]) => this.isTabEnabled(this.props, tabName)));
    }

    changeActiveTab(activeTab) {
        const { [activeTab]: { url } } = this.tabsFilterEnabled(MyAccountContainer.tabMap);

        history.push(appendWithStoreCode(`${ ACCOUNT_URL }${ url }`));
        this.changeMyAccountHeaderState();
    }
    // #endregion

    // #region EVENT
    onSignOut() {
        const { toggleOverlayByKey } = this.props;
        this.setState({ activeTab: MY_ACCOUNT });
        toggleOverlayByKey(CUSTOMER_ACCOUNT);
        history.replace(appendWithStoreCode('/'));
    }

    onSignIn() {
        const { requestCustomerData } = this.props;

        if (isSignedIn()) {
            requestCustomerData();
        }

        this.changeMyAccountHeaderState();
    }

    changeMyAccountHeaderState() {
        const { changeHeaderState } = this.props;
        const { activeTab } = this.state;
        const isActiveTabWishList = activeTab === MY_WISHLIST;

        changeHeaderState({
            title: isActiveTabWishList ? this.getMyWishlistHeaderTitle() : __('My account'),
            name: isActiveTabWishList ? CUSTOMER_WISHLIST : CUSTOMER_ACCOUNT_PAGE,
            onBackClick: () => {
                history.push(appendWithStoreCode('/'));
            }
        });
    }

    changeHeaderState(activeTabParam) {
        const { activeTab: activeTabState } = this.state;
        const activeTab = activeTabParam || activeTabState;

        if (activeTab !== MY_WISHLIST) {
            this.changeDefaultHeaderState();

            return;
        }

        this.changeWishlistHeaderState();
    }

    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const { activeTab } = this.state;
        const { url, tabName } = MyAccountContainer.tabMap[activeTab];
        const breadcrumbs = [];

        if (activeTab !== MY_ACCOUNT) {
            breadcrumbs.push({ url: `${ ACCOUNT_URL }${ url }`, name: tabName });
        }

        breadcrumbs.push({ name: __('My Account'), url: `${ ACCOUNT_URL }/${ MY_ACCOUNT }` });

        updateBreadcrumbs(breadcrumbs);
    }

    redirectIfNotSignedIn() {
        const {
            isMobile,
            baseLinkUrl,
            showNotification
        } = this.props;

        if (isSignedIn()) { // do nothing for signed-in users
            return;
        }

        if (isMobile) { // do not redirect on mobile
            return;
        }

        const path = baseLinkUrl
            ? appendWithStoreCode(ACCOUNT_LOGIN_URL)
            : replace(/\/customer\/account\/.*/, ACCOUNT_LOGIN_URL);

        history.replace({ pathname: path });
        showNotification('info', __('Please, sign in to access this page contents!'));
    }
    // #endregion

    render() {
        return (
            <MyAccount
              { ...this.containerProps() }
              { ...this.containerFunctions }
              tabMap={ this.tabsFilterEnabled(MyAccountContainer.tabMap) }
            />
        );
    }
}

export default withReducers({
    OrderReducer
})(connect(mapStateToProps, mapDispatchToProps)(MyAccountContainer));
