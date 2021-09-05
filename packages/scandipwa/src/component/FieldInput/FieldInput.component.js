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

/** @namespace Component/FieldInput/Component */
export class FieldInput extends PureComponent {
    static propTypes = {
        formRef: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.shape({ current: PropTypes.instanceOf(Element) })
        ]),
        validateSeparately: PropTypes.bool,
        isSubmitted: PropTypes.bool,
        fileExtensions: PropTypes.string,
        filename: PropTypes.string
    };

    static defaultProps = {
        formRef: () => {},
        validateSeparately: false,
        isSubmitted: false,
        fileExtensions: '',
        filename: ''
    };

    render() {
        /* eslint-disable no-unused-vars */
        const {
            formRef,
            validateSeparately,
            isSubmitted,
            fileExtensions,
            filename,
            ...validProps
        } = this.props;
        /* eslint-enable no-unused-vars */

        return (
            <input
              ref={ formRef }
              // eslint-disable-next-line @scandipwa/scandipwa-guidelines/jsx-no-props-destruction
              { ...validProps }
            />
        );
    }
}

export default FieldInput;
