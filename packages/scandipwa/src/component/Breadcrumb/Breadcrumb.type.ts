/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/scandipwa
 */

import { Url } from 'Type/Common.type';

export interface BreadcrumbComponentProps {
    index: number;
    isDisabled: boolean;
    url: string | Url;
    name: string;
}