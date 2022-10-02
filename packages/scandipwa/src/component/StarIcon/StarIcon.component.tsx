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

import { ReactElement } from 'Type/Common.type';

import { StartFill } from './StarIcon.config';
import { StarIconComponentProps } from './StarIcon.type';

import './StarIcon.style';

/** @namespace Component/StarIcon/Component */
export class StarIconComponent extends PureComponent<StarIconComponentProps> {
    getStarPath(): ReactElement {
        const { starFill } = this.props;

        if (starFill === StartFill.EMPTY) {
            return (
                <path d="M6.18899 14.3472L4.69899 20.7992C4.60699 21.1982 4.76699 21.6132 5.10499 21.8462C5.27599 21.9642 5.47399 22.0242 5.67299 22.0242C5.86599 22.0242 6.05999 21.9682 6.22799 21.8562L11.673 18.2262L17.118 21.8562C17.466 22.0882 17.923 22.0792 18.263 21.8322C18.601 21.5852 18.75 21.1522 18.635 20.7502L16.806 14.3502L21.342 10.2682C21.639 10.0002 21.748 9.58217 21.62 9.20417C21.491 8.82617 21.15 8.56017 20.752 8.52817L15.051 8.07417L12.584 2.61317C12.423 2.25417 12.066 2.02417 11.673 2.02417C11.28 2.02417 10.923 2.25417 10.762 2.61317L8.29499 8.07417L2.59399 8.52717C2.20199 8.55817 1.86499 8.81517 1.73299 9.18417C1.59899 9.55317 1.69499 9.96617 1.97499 10.2402L6.18899 14.3472ZM9.04199 10.0212C9.40499 9.99217 9.72499 9.76817 9.87399 9.43517L11.673 5.45417L13.472 9.43517C13.621 9.76817 13.941 9.99217 14.304 10.0212L18.276 10.3362L15.005 13.2802C14.721 13.5362 14.608 13.9302 14.712 14.2982L15.965 18.6832L12.229 16.1922C11.893 15.9672 11.456 15.9672 11.12 16.1922L7.21599 18.7952L8.26599 14.2492C8.34399 13.9092 8.23999 13.5522 7.98999 13.3092L4.95199 10.3472L9.04199 10.0212Z" />
            );
        }

        if (starFill === StartFill.HALF_FULL) {
            return (
                <path d="M5.02496 20.775C4.93296 21.174 5.09296 21.589 5.43096 21.822C5.60296 21.94 5.80096 22 5.99996 22C6.19296 22 6.38696 21.944 6.55496 21.832L12 18.202L17.445 21.832C17.793 22.064 18.249 22.055 18.59 21.808C18.928 21.561 19.077 21.128 18.962 20.726L17.133 14.326L21.669 10.244C21.966 9.977 22.075 9.558 21.947 9.18C21.818 8.802 21.477 8.535 21.079 8.504L15.378 8.05L12.911 2.589C12.75 2.23 12.393 2 12 2C11.607 2 11.25 2.23 11.089 2.588L8.62196 8.05L2.92096 8.503C2.52896 8.534 2.19196 8.791 2.05996 9.16C1.92596 9.529 2.02196 9.942 2.30196 10.216L6.51596 14.323L5.02496 20.775ZM12 5.429L14.042 9.95L14.63 9.997C14.631 9.997 14.631 9.997 14.631 9.997L18.603 10.312L15.332 13.256C15.331 13.257 15.331 13.257 15.331 13.258L14.868 13.674L15.039 14.271C15.039 14.271 15.039 14.273 15.039 14.274L16.292 18.659L12 15.798V5.429Z" />
            );
        }

        if (starFill === StartFill.FULL) {
            return (
                <path d="M21.9471 9.179C21.8181 8.801 21.4771 8.534 21.0791 8.503L15.3779 8.05L12.9108 2.589C12.7498 2.23 12.3928 2 11.9998 2C11.6068 2 11.2498 2.23 11.0888 2.588L8.62171 8.05L2.92052 8.503C2.52951 8.534 2.1925 8.791 2.05949 9.16C1.92649 9.529 2.02049 9.942 2.3015 10.216L6.51464 14.323L5.02459 20.775C4.93259 21.174 5.09359 21.589 5.4306 21.822C5.60261 21.94 5.80061 22 5.99962 22C6.19263 22 6.38663 21.944 6.55464 21.832L11.9998 18.202L17.445 21.832C17.793 22.064 18.25 22.055 18.59 21.808C18.928 21.561 19.077 21.128 18.962 20.726L17.133 14.326L21.6691 10.244C21.9661 9.976 22.0751 9.558 21.9471 9.179Z" />
            );
        }

        return null;
    }

    render(): ReactElement {
        return (
            <svg
              block="StarIcon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
                { this.getStarPath() }
            </svg>
        );
    }
}

export default StarIconComponent;
