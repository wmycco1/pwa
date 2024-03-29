/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/scandipwa
 * @link https://github.com/scandipwa/scandipwa
 */

import { PureComponent } from 'react';

import CheckoutAddressBook from 'Component/CheckoutAddressBook';
import CheckoutDeliveryOptions from 'Component/CheckoutDeliveryOptions';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import LockIcon from 'Component/LockIcon';
import StoreInPickUpComponent from 'Component/StoreInPickUp';
import { CheckoutSteps } from 'Route/Checkout/Checkout.config';
import { ReactElement } from 'Type/Common.type';
import { GQLCurrencyEnum } from 'Type/Graphql.type';
import { getAllCartItemsSku } from 'Util/Cart';
import { formatPrice } from 'Util/Price';

import { CheckoutShippingComponentProps } from './CheckoutShipping.type';

import './CheckoutShipping.style';

/** @namespace Component/CheckoutShipping/Component */
export class CheckoutShippingComponent extends PureComponent<CheckoutShippingComponentProps> {
    static defaultProps: Partial<CheckoutShippingComponentProps> = {
        cartTotalSubPrice: null,
    };

    renderOrderTotalExclTax(): ReactElement {
        const {
            cartTotalSubPrice,
            totals: { prices: { quote_currency_code = null } = {} },
        } = this.props;

        if (!cartTotalSubPrice) {
            return null;
        }

        const orderTotalExclTax = formatPrice(cartTotalSubPrice, quote_currency_code as GQLCurrencyEnum);

        return (
            <span block="Checkout" elem="SubPrice">
                { __('Excl. tax: %s', orderTotalExclTax) }
            </span>
        );
    }

    renderPriceLine(price: number): ReactElement {
        const { totals: { prices: { quote_currency_code = null } = {} } } = this.props;

        return formatPrice(price, quote_currency_code as GQLCurrencyEnum);
    }

    renderOrderTotal(): ReactElement {
        const {
            totals: {
                prices: {
                    grand_total: {
                        value: grand_total = 0,
                    } = {},
                    quote_currency_code = null,
                } = {},
            },
        } = this.props;

        if (!grand_total) {
            return null;
        }

        const orderTotal = formatPrice(grand_total, quote_currency_code as GQLCurrencyEnum);

        return (
            <dl block="Checkout" elem="OrderTotal">
                <dt>
                    { __('Order total') }
                </dt>
                <dt block="Checkout" elem="TotalValue">
                    { orderTotal }
                    { this.renderOrderTotalExclTax() }
                </dt>
            </dl>
        );
    }

    renderActions(): ReactElement {
        const { selectedShippingMethod } = this.props;

        const isDisabled = !selectedShippingMethod?.carrier_code;

        return (
            <div block="Checkout" elem="StickyButtonWrapper">
                { this.renderOrderTotal() }
                <button
                  type="submit"
                  block="Button"
                  disabled={ isDisabled }
                  mix={ { block: 'CheckoutShipping', elem: 'Button' } }
                >
                    <LockIcon />
                    { __('Proceed to billing') }
                </button>
            </div>
        );
    }

    renderPickInStoreMethod(): ReactElement {
        const {
            estimateAddress: { country_id } = {},
            shippingMethods,
            onStoreSelect,
            onShippingMethodSelect,
            totals: { items },
        } = this.props;

        return (
            <StoreInPickUpComponent
              countryId={ country_id || 'US' }
              shippingMethods={ shippingMethods }
              onStoreSelect={ onStoreSelect }
              onShippingMethodSelect={ onShippingMethodSelect }
              cartItemsSku={ getAllCartItemsSku(items || []) }
            />
        );
    }

    renderDelivery(): ReactElement {
        const {
            shippingMethods,
            onShippingMethodSelect,
            handleSelectDeliveryMethod,
            selectedShippingMethod,
        } = this.props;

        return (
            <CheckoutDeliveryOptions
              shippingMethods={ shippingMethods }
              onShippingMethodSelect={ onShippingMethodSelect }
              handleSelectDeliveryMethod={ handleSelectDeliveryMethod }
              selectedShippingMethod={ selectedShippingMethod }
            />
        );
    }

    renderAddressBook(): ReactElement {
        const {
            onAddressSelect,
            onShippingEstimationFieldsChange,
            isSubmitted,
        } = this.props;

        return (
            <CheckoutAddressBook
              onAddressSelect={ onAddressSelect }
              onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
              isSubmitted={ isSubmitted }
            />
        );
    }

    renderContent(): ReactElement {
        const { isLoading, isPickInStoreMethodSelected } = this.props;

        if (isPickInStoreMethodSelected) {
            return this.renderPickInStoreMethod();
        }

        return (
            <>
                { this.renderAddressBook() }
                <div>
                    <Loader isLoading={ isLoading } />
                    { this.renderDelivery() }
                    { this.renderActions() }
                </div>
            </>
        );
    }

    render(): ReactElement {
        const {
            onShippingSuccess,
            onShippingError,
        } = this.props;

        return (
            <Form
              attr={ {
                  id: CheckoutSteps.SHIPPING_STEP,
              } }
              onSubmit={ onShippingSuccess }
              onError={ onShippingError }
            >
                { this.renderContent() }
            </Form>
        );
    }
}

export default CheckoutShippingComponent;
