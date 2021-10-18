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

import MyAccountAddressForm from 'Component/MyAccountAddressForm/MyAccountAddressForm.component';
import transformToNameValuePair from 'Util/Form/Transform';

/** @namespace Component/CheckoutAddressForm/Component */
export class CheckoutAddressForm extends MyAccountAddressForm {
    static propTypes = {
        ...MyAccountAddressForm.propTypes,
        onShippingEstimationFieldsChange: PropTypes.func
    };

    static defaultProps = {
        ...MyAccountAddressForm.defaultProps,
        onShippingEstimationFieldsChange: () => {}
    };

    componentDidMount() {
        const {
            address: {
                countryId,
                regionId,
                region,
                city,
                postcode
            },
            defaultCountry,
            onShippingEstimationFieldsChange
        } = this.props;

        onShippingEstimationFieldsChange({
            country_id: countryId || defaultCountry,
            region_id: regionId !== '' ? regionId : null,
            region,
            city,
            postcode
        });
    }

    get fieldMap() {
        const fieldMap = super.fieldMap;
        const addressGroup = fieldMap.find(({ name }) => name === 'addressGroup');

        if (addressGroup) {
            addressGroup.events = {
                // Updates shipping methods on address blurt
                onBlur: this.onAddressChange,
                // Updates shipping methods on start
                onLoad: this.onAddressChange
            };
        }

        fieldMap.splice(0, 2);

        return fieldMap;
    }

    onAddressChange = (event, data) => {
        const { fields = {} } = data;
        const {
            country_id,
            region_id: regionId,
            region_string: region,
            city,
            postcode
        } = transformToNameValuePair(fields);

        const { onShippingEstimationFieldsChange } = this.props;

        onShippingEstimationFieldsChange({
            country_id,
            region_id: regionId !== '' ? regionId : null,
            region,
            city,
            postcode
        });
    };

    renderActions() {
        return null;
    }

    render() {
        return (
            <div block="CheckoutAddressForm">
                { this.renderFormBody() }
            </div>
        );
    }
}

export default CheckoutAddressForm;
