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

import { Reducer } from 'redux';

import { CheckoutAgreement, CurrencyConfig, StoreConfig } from 'Query/Config.type';
import { Country } from 'Query/Region.type';
import BrowserDatabase from 'Util/BrowserDatabase';

import {
    ConfigAction,
    ConfigActionType,
    ConfigStore,
    ReviewRatingItem,
    ReviewRatings
} from './Config.type';

export const MAX_WIDTH = 150;
export const MAX_HEIGHT = 40;
export const DEFAULT_CATGORY_URL_SUFFIX = '.html';

/** @namespace Store/Config/Reducer/filterStoreConfig */
export const filterStoreConfig = (config: StoreConfig): Partial<StoreConfig> => Object.entries(config).reduce(
    (acc, [key, value]) => (value !== null ? { ...acc, [key]: value } : acc),
    {}
);

export const {
    countries, reviewRatings, storeConfig, currencyData, cartDisplayConfig
} = BrowserDatabase.getItem('config') || {
    countries: [],
    reviewRatings: [],
    storeConfig: {},
    currencyData: {},
    cartDisplayConfig: {
        display_tax_in_price: '',
        display_tax_in_subtotal: '',
        display_tax_in_shipping_amount: '',
        include_tax_in_order_total: false,
        display_full_tax_summary: false,
        display_zero_tax_subtotal: false
    }
};

/** @namespace Store/Config/Reducer/getIndexedRatings */
export const getIndexedRatings = (
    reviewRatings: ReviewRatings
): ReviewRatingItem[] => ((reviewRatings) ? reviewRatings.items || [] : []);

/** @namespace Store/Config/Reducer/getCurrencyData */
export const getCurrencyData = (
    base: CurrencyConfig,
    state: Partial<ConfigStore>
): CurrencyConfig => (base || state.currencyData || {});

/** @namespace Store/Config/Reducer/getCountryData */
export const getCountryData = (
    base: Country[],
    state: Partial<ConfigStore>
): Country[] => (base || state.countries || {});

/** @namespace Store/Config/Reducer/getCheckoutAgreementData */
export const getCheckoutAgreementData = (
    base: CheckoutAgreement[],
    state: Partial<ConfigStore>
): CheckoutAgreement[] => (base || state.checkoutAgreements || {});

/** @namespace Store/Config/Reducer/getInitialState */
export const getInitialState = (): Partial<ConfigStore> => ({
    ...filterStoreConfig(storeConfig),
    countries,
    reviewRatings,
    checkoutAgreements: [],
    currencyData,
    isLoading: true,
    cartDisplayConfig,
    priceTaxDisplay: {
        product_price_display_type: '',
        shipping_price_display_type: ''
    },
    category_url_suffix: DEFAULT_CATGORY_URL_SUFFIX,
    device: {
        isMobile: true,
        android: true,
        ios: false,
        blackberry: false,
        opera: false,
        windows: false,
        safari: false,
        standaloneMode: window.matchMedia('(display-mode: standalone)').matches
    }
});

/** @namespace Store/Config/Reducer/ConfigReducer */
export const ConfigReducer: Reducer<Partial<ConfigStore>, ConfigAction> = (
    state = getInitialState(),
    action
) => {
    const {
        type,
        config: {
            countries,
            reviewRatings,
            checkoutAgreements,
            currencyData,
            storeConfig = {},
            cartDisplayConfig = {}
        } = {},
        device
    } = action;

    switch (type) {
    case ConfigActionType.UPDATE_CONFIG:
        const filteredStoreConfig = filterStoreConfig(storeConfig);
        const { secure_base_media_url } = filteredStoreConfig;
        window.secure_base_media_url = secure_base_media_url;

        return {
            ...state,
            countries: getCountryData(countries, state),
            reviewRatings: getIndexedRatings(reviewRatings),
            checkoutAgreements: getCheckoutAgreementData(checkoutAgreements, state),
            currencyData: getCurrencyData(currencyData, state),
            ...filteredStoreConfig,
            // Should be updated manually as filteredStoreConfig does not contain header_logo_src when it is null
            // and header_logo_src takes old value
            isLoading: false,
            cartDisplayConfig
        };

    case ConfigActionType.UPDATE_CONFIG_DEVICE:
        return {
            ...state,
            device: {
                ...state.device,
                ...device
            }
        };

    default:
        return state;
    }
};

export default ConfigReducer;
