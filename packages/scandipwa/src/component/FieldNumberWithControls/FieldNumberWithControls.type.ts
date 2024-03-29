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

import { InputHTMLAttributes } from 'react';

import { FieldEvents, FieldNumberCustomEvents } from 'Component/Field/Field.type';

export interface FieldNumberWitControlsContainerFunctions {
    setRef: (elem: HTMLInputElement | null) => void;
    handleValueChange: (value: number) => void;
}

export interface FieldNumberWitControlsContainerProps {
    attr: InputHTMLAttributes<HTMLInputElement>;
    events: Omit<FieldEvents, 'onChange' | 'onLoad'> & FieldNumberCustomEvents;
    isDisabled: boolean;
    value: number | string;
    setRef: (elem: HTMLInputElement | null) => void;
}

export interface FieldNumberWitControlsContainerState {
    value: number | string;
}

export interface FieldNumberWitControlsComponentProps {
    attr: InputHTMLAttributes<HTMLInputElement>;
    events: Omit<FieldEvents, 'onChange' | 'onLoad'> & FieldNumberCustomEvents;
    setRef: (elem: HTMLInputElement | null) => void;
    value: string | number;
    stateValue: string | number;
    handleValueChange: (value: number) => void;
    isDisabled: boolean;
}

export type FieldNumberWitControlsContainerPropsKeys = 'attr'
| 'events'
| 'isDisabled'
| 'value'
| 'stateValue';
