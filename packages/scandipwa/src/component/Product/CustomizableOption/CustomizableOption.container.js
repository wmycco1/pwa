/* eslint-disable */
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
import { Component } from 'react';
import CustomizableOption from "./CustomizableOption.component";
import { customizableOptionsToSelectTransform } from 'Util/Product/Transform';
import { connect } from 'react-redux';
import { CONFIG_FIELD_TYPE } from 'Component/Product/CustomizableOption/CustomizableOption.config';
import FIELD_TYPE from 'Config/Field.config';

export const mapStateToProps = (state) => ({
    currencyCode: state.ConfigReducer.currencyData.current_currency_code
});

export const mapDispatchToProps = () => ({
});

export class CustomizableOptionContainer extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        isRequired: PropTypes.bool.isRequired,
        type: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.object).isRequired,
        updateSelectedValues: PropTypes.func.isRequired,
        currencyCode: PropTypes.string.isRequired
    };

    state = {
        dropdownOptions: []
    };

    shouldComponentUpdate(nextProps, nextState) {
        const { options: nextOptions, type: nextType } = nextProps;
        const { options, type } = this.props;

        const { dropdownOptions: nextDropdownOptions } = nextState;
        const { dropdownOptions } = this.state;

        return nextOptions !== options
            || nextDropdownOptions !== dropdownOptions
            || nextType !== type;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { options: prevOptions } = prevProps;
        const { options, type } = this.props;
        const { dropdownOptions } = this.state;

        if (type === CONFIG_FIELD_TYPE.select) {
            if (
                options !== prevOptions
                || !dropdownOptions
                || (Array.isArray(dropdownOptions) && dropdownOptions.length === 0)
            ) {
                this.buildDropdownOptions();
            }
        }
    }

    getFieldType() {
        const { type } = this.props;
        const typeKey = Object.keys(CONFIG_FIELD_TYPE).find(key => CONFIG_FIELD_TYPE[key] === type);

        return FIELD_TYPE[typeKey];
    }

    buildDropdownOptions() {
        const { options, currencyCode, type } = this.props;
        if (type !== CONFIG_FIELD_TYPE.select) {
            return;
        }

        this.setState({
            dropdownOptions: customizableOptionsToSelectTransform(options, currencyCode)
        });
    }

    render() {
        return (
            <CustomizableOption
                { ...this.props }
                { ...this.containerFunctions }
                { ...this.state }
                fieldType={ this.getFieldType() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomizableOptionContainer);
