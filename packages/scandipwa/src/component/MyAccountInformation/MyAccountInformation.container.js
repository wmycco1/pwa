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
import { withRouter } from 'react-router';

import MyAccountQuery from 'Query/MyAccount.query';
import { ACCOUNT_URL } from 'Route/MyAccount/MyAccount.config';
import { updateCustomerDetails, updateIsLoading } from 'Store/MyAccount/MyAccount.action';
import { CUSTOMER } from 'Store/MyAccount/MyAccount.dispatcher';
import { showNotification } from 'Store/Notification/Notification.action';
import { customerType } from 'Type/Account';
import { LocationType } from 'Type/Common';
import { isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import history from 'Util/History';
import { fetchMutation, getErrorMessage } from 'Util/Request';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';
import { appendWithStoreCode } from 'Util/Url';

import MyAccountInformation from './MyAccountInformation.component';

/** @namespace Component/MyAccountInformation/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    isMobile: state.ConfigReducer.device.isMobile,
    customer: state.MyAccountReducer.customer,
    isLoading: state.MyAccountReducer.isLoading
});

/** @namespace Component/MyAccountInformation/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    updateCustomer: (customer) => dispatch(updateCustomerDetails(customer)),
    showErrorNotification: (error) => dispatch(showNotification('error', getErrorMessage(error))),
    showSuccessNotification: (message) => dispatch(showNotification('success', message)),
    updateCustomerLoadingStatus: (status) => dispatch(updateIsLoading(status))
});

/** @namespace Component/MyAccountInformation/Container */
export class MyAccountInformationContainer extends PureComponent {
    static propTypes = {
        customer: customerType.isRequired,
        location: LocationType.isRequired,

        isLoading: PropTypes.bool.isRequired,
        isMobile: PropTypes.bool.isRequired,

        showErrorNotification: PropTypes.func.isRequired,
        showSuccessNotification: PropTypes.func.isRequired,
        updateCustomer: PropTypes.func.isRequired,
        updateCustomerLoadingStatus: PropTypes.func.isRequired
    };

    containerFunctions = {
        onCustomerSave: this.onCustomerSave.bind(this),
        handleChangeEmailCheckbox: this.handleChangeEmailCheckbox.bind(this),
        handleChangePasswordCheckbox: this.handleChangePasswordCheckbox.bind(this)
    };

    __construct(props) {
        super.__construct(props);

        const {
            location: {
                state: {
                    editPassword = false
                } = {}
            }
        } = this.props;

        this.state = {
            showEmailChangeField: false,
            showPasswordChangeField: editPassword,
            isErrorShow: false
        };
    }

    containerProps() {
        const { isMobile, customer, isLoading } = this.props;
        const { showEmailChangeField, showPasswordChangeField } = this.state;

        return {
            isMobile,
            isLoading,
            customer,
            showEmailChangeField,
            showPasswordChangeField
        };
    }

    onError = (error) => {
        const { showErrorNotification, updateCustomerLoadingStatus } = this.props;

        updateCustomerLoadingStatus(false);
        showErrorNotification(error);
        this.setState({ isErrorShow: true });
    };

    async onCustomerSave(fields) {
        const { showPasswordChangeField, showEmailChangeField } = this.state;
        const {
            firstname = '',
            lastname = '',
            taxvat = '',
            password = '',
            newPassword = '',
            email = ''
        } = fields;

        if (!isSignedIn()) {
            return;
        }

        await this.handleInformationChange({ firstname, lastname, taxvat });

        if (showPasswordChangeField) {
            await this.handleChangePasswordCheckbox({ password, newPassword });
        }

        if (showEmailChangeField) {
            await this.handleEmailChange({ email, password });
        }

        this.afterSubmit();
    }

    afterSubmit() {
        const { showSuccessNotification, updateCustomerLoadingStatus } = this.props;
        const { isErrorShow } = this.state;

        if (!isErrorShow) {
            updateCustomerLoadingStatus(false);
            history.push({ pathname: appendWithStoreCode(ACCOUNT_URL) });
            showSuccessNotification('You saved the account information.');
        } else {
            this.setState({ isErrorShow: false });
        }
    }

    handlePasswordChange(passwords) {
        const {
            updateCustomerLoadingStatus
        } = this.props;

        const mutation = MyAccountQuery.getChangeCustomerPasswordMutation(passwords);
        updateCustomerLoadingStatus(true);

        return fetchMutation(mutation).then(
            /** @namespace Component/MyAccountInformation/Container/MyAccountInformationContainer/handlePasswordChange/fetchMutation/then */
            () => {},
            this.onError
        );
    }

    handleInformationChange(passwords) {
        const {
            updateCustomer,
            updateCustomerLoadingStatus
        } = this.props;

        const mutation = MyAccountQuery.getUpdateInformationMutation(passwords);
        updateCustomerLoadingStatus(true);

        return fetchMutation(mutation).then(
            /** @namespace Component/MyAccountInformation/Container/MyAccountInformationContainer/handleInformationChange/fetchMutation/then */
            ({ updateCustomerV2: { customer } }) => {
                BrowserDatabase.setItem(customer, CUSTOMER, ONE_MONTH_IN_SECONDS);
                updateCustomer(customer);
            },
            this.onError
        );
    }

    handleEmailChange(fields) {
        const {
            updateCustomerLoadingStatus
        } = this.props;

        const mutation = MyAccountQuery.getUpdateEmailMutation(fields);
        updateCustomerLoadingStatus(true);

        return fetchMutation(mutation).then(
            /** @namespace Component/MyAccountInformation/Container/MyAccountInformationContainer/handleEmailChange/fetchMutation/then */
            () => {},
            this.onError
        );
    }

    handleChangePasswordCheckbox() {
        this.setState(({ showPasswordChangeField }) => ({ showPasswordChangeField: !showPasswordChangeField }));
    }

    handleChangeEmailCheckbox() {
        this.setState(({ showEmailChangeField }) => ({ showEmailChangeField: !showEmailChangeField }));
    }

    render() {
        return (
            <MyAccountInformation
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyAccountInformationContainer));
