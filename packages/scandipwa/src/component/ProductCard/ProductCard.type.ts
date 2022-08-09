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

import { RefObject } from 'react';

import {
    ProductComponentContainerFunctions,
    ProductComponentContainerPropKeys,
    ProductComponentProps,
    ProductContainerBaseProps,
    ProductContainerMapDispatchProps,
    ProductContainerMapStateProps
} from 'Component/Product/Product.type';
import { CategoryPageLayout } from 'Route/CategoryPage/CategoryPage.config';
import { NotificationType } from 'Store/Notification/Notification.type';
import {
    Children, Mix, ReactElement, Url
} from 'Type/Common.type';

export interface ProductCardContainerMapStateProps extends ProductContainerMapStateProps {
    baseLinkUrl: string;
    productUsesCategories: boolean;
    categoryUrlSuffix: string;
}

export interface ProductCardContainerMapDispatchProps extends ProductContainerMapDispatchProps {
    showNotification: (type: NotificationType, message: string) => void;
}

export interface ProductCartContainerBaseProps extends ProductContainerBaseProps {
    selectedFilters: Record<string, string[]>;
    hideCompareButton: boolean;
    hideWishlistButton: boolean;
    isLoading: boolean;
    renderContent: ((content: ContentObject) => ReactElement) | null;
    mix: Mix;
    layout: CategoryPageLayout;
    children: Children;
}

export type ProductCardContainerProps = ProductCardContainerMapStateProps
& ProductCardContainerMapDispatchProps
& ProductCartContainerBaseProps;

export interface ProductCartComponentContainerFunctions extends ProductComponentContainerFunctions {
    showSelectOptionsNotification: () => void;
}

export interface ProductCardComponentProps extends ProductComponentProps {
    children: Children;
    hideCompareButton: boolean;
    hideWishlistButton: boolean;
    isLoading: boolean;
    layout: CategoryPageLayout;
    mix: Mix;
    renderContent: ((content: ContentObject) => ReactElement) | null;
    thumbnail: string;
    linkTo?: Url | string;
    showSelectOptionsNotification: () => void;
    registerSharedElement: (ref: RefObject<HTMLElement>) => void;
}

export type ProductCardComponentContainerPropKeys = ProductComponentContainerPropKeys
| 'children'
| 'hideCompareButton'
| 'hideWishlistButton'
| 'isLoading'
| 'layout'
| 'mix'
| 'renderContent'
| 'thumbnail'
| 'linkTo';

export interface ContentObject {
    renderCardLinkWrapper: (children: Children, mix?: Mix) => ReactElement;
    pictureBlock: {
        picture: (mix?: Mix) => ReactElement;
    };
    content: {
        review: () => ReactElement;
        productPrice: () => ReactElement;
        mainDetails: () => ReactElement;
        additionalProductDetails: (withMeta?: boolean) => ReactElement;
    };
}