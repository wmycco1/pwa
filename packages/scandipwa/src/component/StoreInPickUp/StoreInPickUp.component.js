/* eslint-disable react/jsx-no-bind */

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

import Field from 'Component/Field';
import Html from 'Component/Html';
import Popup from 'Component/Popup';

import { STORE_IN_PICK_UP_POPUP_ID } from './StoreInPickUp.config';

import './StoreInPickUp.style';

/** @namespace StoreinPickup/Component/StoreInPickUp/Component/StoreInPickUpComponent */
export class StoreInPickUpComponent extends PureComponent {
    static propTypes = {
        handleStoreInput: PropTypes.func.isRequired,
        selectStore: PropTypes.func.isRequired,
        stores: PropTypes.arrayOf(
            PropTypes.shape({
                city: PropTypes.string,
                country: PropTypes.string,
                description: PropTypes.string,
                name: PropTypes.string,
                phone: PropTypes.string,
                pickup_location_code: PropTypes.string,
                postcode: PropTypes.string,
                region: PropTypes.string,
                street: PropTypes.string
            })
        )
    };

    static defaultProps = {
        stores: []
    };

    renderHeading() {
        return (
            <h3>{ __('Please provide postcode or city name to find nearest pickup locations.') }</h3>
        );
    }

    renderInput() {
        const { handleStoreInput } = this.props;

        return (
            <Field
              type="text"
              id="store-finder"
              name="store-finder"
              placeholder={ __('City or Postcode') }
              onChange={ handleStoreInput }
              mix={ { block: 'StoreInPickUp', elem: 'Input' } }
            />
        );
    }

    renderStore(store, selectStore) {
        const {
            city,
            country,
            description,
            name,
            phone,
            pickup_location_code,
            postcode,
            region,
            street
        } = store;

        return (
            <div block="StoreInPickUp" elem="Store" key={ pickup_location_code }>
                <div block="StoreInPickUp" elem="StoreData">
                    <h3>{ name }</h3>
                    <p>{ street }</p>
                    <p>{ `${city}, ${region} ${postcode}` }</p>
                    <p>{ country }</p>
                    <a href={ `tel:${phone}` }>{ phone }</a>
                    <Html content={ description } />
                </div>
                <div block="StoreInPickUp" elem="StoreActions">
                    <button
                      block="Button"
                      onClick={ () => selectStore(store) }
                      type="button"
                    >
                        { __('Ship here') }
                    </button>
                </div>
            </div>
        );
    }

    renderResult() {
        const { stores, selectStore } = this.props;

        if (!stores.length) {
            return null;
        }

        return (
            <div block="StoreInPickUp" elem="Results">
                { stores.map((store) => this.renderStore(store, selectStore)) }
            </div>
        );
    }

    renderContent() {
        return (
            <>
                { this.renderInput() }
                { this.renderResult() }
            </>
        );
    }

    render() {
        return (
            <Popup
              id={ STORE_IN_PICK_UP_POPUP_ID }
              clickOutside={ false }
              mix={ { block: 'StoreInPickUpPopup' } }
            >
                { this.renderHeading() }
                { this.renderContent() }
            </Popup>
        );
    }
}

export default StoreInPickUpComponent;
