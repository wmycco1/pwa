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

import {
    Children,
    cloneElement,
    createRef,
    PureComponent,
    RefObject
} from 'react';

import { ReactElement } from 'Type/Common.type';
import { noopFn } from 'Util/Common';

import { ClickOutsideComponentProps } from './ClickOutside.type';

/** @namespace Component/ClickOutside/Component */
export class ClickOutside extends PureComponent<ClickOutsideComponentProps> {
    childrenRefs: RefObject<HTMLElement>[] = [];

    static defaultProps: Partial<ClickOutsideComponentProps> = {
        onClick: noopFn,
        children: []
    };

    __construct(props: ClickOutsideComponentProps): void {
        super.__construct?.(props);

        const { children } = this.props;

        this.handleClick = this.handleClick.bind(this);

        this.childrenRefs = Children.map(
            children,
            () => createRef<HTMLElement>()
        );
    }

    componentDidMount(): void {
        document.addEventListener('click', this.handleClick);
    }

    componentWillUnmount(): void {
        document.removeEventListener('click', this.handleClick);
    }

    handleClick({ target }: MouseEvent): void {
        const { onClick } = this.props;

        if (this.childrenRefs?.every(
            (ref) => {
                const elementRef = ref.current?.overlayRef?.current || ref.current;

                return !elementRef.contains(target);
            }
        )) {
            onClick();
        }
    }

    render(): ReactElement {
        const { children } = this.props;

        return Children.map(children, (element, idx) => (
            cloneElement(element, { ref: this.childrenRefs[idx] })
        ));
    }
}

export default ClickOutside;