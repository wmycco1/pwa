/* eslint-disable max-len */

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

import Image from 'Component/Image/Image.component';
import {
    ImageState
} from 'Component/Image/Image.config';
import { ImageRatio } from 'Component/Image/Image.type';
import logo from 'Style/icons/logos/mainLogo.svg';
import { ReactElement } from 'Type/Common.type';

import { LogoComponentProps } from './Logo.type';

import './Logo.style';

/** @namespace Component/Logo/Component */
export class Logo extends Image<LogoComponentProps> {
    renderPlaceholderLogo(): ReactElement {
        return (
            <div
              block="Logo"
              elem="Placeholder"
            >
                <Image
                  src={ logo }
                  alt="LogoPlaceholder"
                  ratio={ ImageRatio.IMG_CUSTOM }
                />
            </div>
        );
    }

    renderImage(): ReactElement {
        const { imageStatus } = this.state;
        const { src } = this.props;

        if (!src) {
            return this.renderPlaceholderLogo();
        }

        switch (imageStatus) {
        case ImageState.IMAGE_NOT_FOUND:
        case ImageState.IMAGE_NOT_SPECIFIED:
            return this.renderPlaceholderLogo();
        default:
            return super.renderImage();
        }
    }

    render(): ReactElement {
        const { imageStatus } = this.state;

        return (
            <div
              block="Image"
              mods={ { imageStatus } }
              mix={ { block: 'Logo' } }
            >
                { this.renderImage() }
            </div>
        );
    }
}

export default Logo;