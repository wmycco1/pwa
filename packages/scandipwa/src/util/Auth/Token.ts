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

import { updateCustomerSignInStatus } from 'Store/MyAccount/MyAccount.action';
import BrowserDatabase from 'Util/BrowserDatabase';
import { deleteGuestQuoteId } from 'Util/Cart';
import { removeUid } from 'Util/Compare';
import { debounce } from 'Util/Request';
import getStore from 'Util/Store';
import { RootState } from 'Util/Store/Store.type';

export const AUTH_TOKEN = 'auth_token';

export const ONE_HOUR_IN_SECONDS = 3600;
export const ONE_HOUR = 1;
export const TOKEN_REFRESH_DELAY = 2000;

/** @namespace Util/Auth/Token/setAuthorizationToken */
export const setAuthorizationToken = (token: string | null): void => {
    if (!token) {
        return;
    }

    const state = getStore().getState() as RootState;
    const {
        access_token_lifetime = ONE_HOUR
    } = state.ConfigReducer;

    BrowserDatabase.setItem(token, AUTH_TOKEN, access_token_lifetime * ONE_HOUR_IN_SECONDS);
};

/** @namespace Util/Auth/Token/deleteAuthorizationToken */
export const deleteAuthorizationToken = (): void => BrowserDatabase.deleteItem(AUTH_TOKEN);

/** @namespace Util/Auth/Token/getAuthorizationToken */
export const getAuthorizationToken = (): string | null => BrowserDatabase.getItem(AUTH_TOKEN);

/** @namespace Util/Auth/Token/refreshAuthorizationToken */
export const refreshAuthorizationToken = debounce(
    () => setAuthorizationToken(getAuthorizationToken()),
    TOKEN_REFRESH_DELAY
);

/** @namespace Util/Auth/Token/isInitiallySignedIn */
export const isInitiallySignedIn = (): boolean => !!getAuthorizationToken();

/** @namespace Util/Auth/Token/isSignedIn */
export const isSignedIn = (): boolean => {
    const hasAuthToken = !!getAuthorizationToken();
    const store = getStore();

    const {
        MyAccountReducer: {
            isSignedIn: isCustomerSignedIn = false
        } = {}
    } = store.getState() as RootState;

    const { dispatch } = store;

    if (!hasAuthToken && isCustomerSignedIn) {
        // since logout is async and slow, remove cart id / compare uid
        // and set customer sign in status here on auth token expiration
        deleteGuestQuoteId();
        dispatch(updateCustomerSignInStatus(false));
        removeUid();

        const MyAccountDispatcher = import('../../store/MyAccount/MyAccount.dispatcher');
        MyAccountDispatcher.then(
            ({ default: dispatcher }) => dispatcher.logout(true, true, dispatch)
        );
    }

    return hasAuthToken;
};
