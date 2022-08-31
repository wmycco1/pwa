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

import {
    ButtonHTMLAttributes,
    ChangeEvent,
    ClassAttributes,
    DOMAttributes,
    InputHTMLAttributes,
    MutableRefObject,
    SelectHTMLAttributes,
    SyntheticEvent,
    TextareaHTMLAttributes
} from 'react';

import { DateFieldAttr } from 'Component/DateSelect/DateSelect.config';
import { Mix, ReactElement } from 'Type/Common.type';
import { FieldOptions, Option } from 'Type/Field.type';
import { GQLCurrencyEnum } from 'Type/Graphql.type';
import {
    FieldValidationOutput,
    ValidationDOMOutput,
    ValidationOutput,
    ValidationRule
} from 'Util/Validator/Validator.type';

import { FieldType } from './Field.config';

export interface FieldContainerFunctions {
    validate: (data?: (Event | SyntheticEvent) & ValidationOutput) => boolean | FieldValidationOutput;
}

export interface FieldContainerProps {
    id?: string;
    type: FieldType;
    attr: FieldAttributes;
    events: FieldEvents;
    isDisabled: boolean;
    mix: Mix;
    options: FieldOptions[];
    elemRef: MutableRefObject<HTMLElement>;
    changeValueOnDoubleClick: boolean;
    isSortSelect: boolean;
    validationRule: ValidationRule;
    validateOn: string[];
    showErrorAsLabel: boolean;
    label: ReactElement | string | null;
    subLabel: ReactElement | string | null;
    addRequiredTag: boolean;
    value: string | number;
}

export interface FieldContainerState {
    validationResponse: null | boolean | FieldValidationOutput;
    showLengthError: boolean;
}

export interface FieldComponentProps {
    type: FieldType;
    attr: FieldAttributes;
    events: FieldEvents;
    isDisabled: boolean;
    setRef: (elem: FieldRef | null) => void;
    mix: Mix;
    options: Option[];
    changeValueOnDoubleClick: boolean;
    isSortSelect: boolean;
    label: ReactElement | string | null;
    subLabel: ReactElement | string | null;
    addRequiredTag: boolean;
    showErrorAsLabel: boolean;
    validationResponse: null | boolean | ValidationDOMOutput;
}

export type FieldContainerPropsKeys =
'type'
| 'attr'
| 'isDisabled'
| 'mix'
| 'options'
| 'showErrorAsLabel'
| 'label'
| 'subLabel'
| 'addRequiredTag'
| 'changeValueOnDoubleClick'
| 'isSortSelect'
| 'validationResponse'
| 'events'
| 'setRef';

export type FieldRef = HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | HTMLSelectElement;
export type FieldAttributes = (InputHTMLAttributes<HTMLInputElement>
| ButtonHTMLAttributes<HTMLButtonElement>
| TextareaHTMLAttributes<HTMLTextAreaElement>
| SelectHTMLAttributes<HTMLSelectElement>)
& ClassAttributes<HTMLElement>
& {
    selectPlaceholder?: string;
    isExpanded?: boolean;
    noPlaceholder?: boolean;
    key?: string | number;
    [DateFieldAttr.TYPE]?: string;
    [DateFieldAttr.NAME]?: string;
};

export type FieldEvents = Omit<DOMAttributes<HTMLElement>, 'children' | 'dangerouslySetInnerHTML' | 'onChange'>
& {
    onChange?: ((event: ChangeEvent<HTMLInputElement>, field?: EventFieldData) => void)
    | FieldNumberCustomEvents['onChange']
    | FieldSelectCustomEvents['onChange']
    | FieldInputCustomEvents['onChange']
    | ((currencyCode: GQLCurrencyEnum) => void);
    onLoad?: FieldNumberCustomEvents['onLoad'];
};

export interface FieldNumberCustomEvents {
    onChange?: (value: number, field?: EventFieldData, event?: SyntheticEvent) => void;
    onLoad?: (value: number, field?: EventFieldData, event?: SyntheticEvent) => void;
}

export interface FieldSelectCustomEvents {
    onChange?: (value: string, field?: EventFieldData, event?: SyntheticEvent) => void;
}

export interface FieldInputCustomEvents {
    onChange?: (value: string, field?: EventFieldData, event?: SyntheticEvent) => void;
}

export type EventFieldData = FieldAttributes & { fieldRef: FieldRef; value: string; type: string };

export type FieldReactEvents<T> = Omit<DOMAttributes<T>, 'children' | 'dangerouslySetInnerHTML'>;