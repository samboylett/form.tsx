import { useMemo } from 'react';
import { ValuesFields } from '../types/ValuesFields';
import { UseFieldBlurArg, UseFieldBlurReturn } from './useFieldBlur';
import { UseFieldFocusArg, UseFieldFocusReturn } from './useFieldFocus';
import { UseChangeHandlerArg, UseChangeHandlerReturn } from './useChangeHandler';
import { UseFieldValueArg, UseFieldValueReturn } from './useFieldValue';
import { DeepIndex } from '../types/DeepIndex';

export interface UseHTMLInputArg<Values, Name extends ValuesFields<Values>> {
    name: DeepIndex<Values, Name> extends string ? Name : never;
}

export interface UseHTMLInputReturn<Values, Name extends ValuesFields<Values>> extends UseFieldBlurReturn, UseFieldFocusReturn {
    name: Name;
    value: string;
    onChange: UseChangeHandlerReturn<Values, Name>['handleChangeEvent'];
}

export interface CreateUseHTMLInputDependencies<Values> {
    useFieldValue: <Name extends ValuesFields<Values>>(arg: UseFieldValueArg<Name>) => UseFieldValueReturn<Values, Name>;
    useFieldFocus: <Name extends ValuesFields<Values>>(arg: UseFieldFocusArg<Name>) => UseFieldFocusReturn;
    useFieldBlur: <Name extends ValuesFields<Values>>(arg: UseFieldBlurArg<Name>) => UseFieldBlurReturn;
    useChangeHandler: <Name extends ValuesFields<Values>>(arg: UseChangeHandlerArg<Name>) => UseChangeHandlerReturn<Values, Name>;
}

export const createUseHTMLInput = <Values>({ useFieldValue, useFieldFocus, useFieldBlur, useChangeHandler }: CreateUseHTMLInputDependencies<Values>) => {
    /**
     * Get the props to be used on a native HTML input, textarea or select element.
     * 
     * @param {UseHTMLInputArg<Values, Name>} 
     * @returns {UseHTMLInputReturn<Values, Name>}
     */
    const useHTMLInput = <Name extends ValuesFields<Values>>({ name }: UseHTMLInputArg<Values, Name>): UseHTMLInputReturn<Values, Name> => {
        const { value: baseValue } = useFieldValue<Name>({ name });
        const { onFocus } = useFieldFocus<Name>({ name });
        const { onBlur } = useFieldBlur<Name>({ name });
        const { handleChangeEvent } = useChangeHandler<Name>({ name });

        const value = `${baseValue}`;

        return useMemo(() => ({
            name,
            value,
            onBlur,
            onFocus,
            onChange: handleChangeEvent,
        }), [
            name,
            value,
            onBlur,
            onFocus,
            handleChangeEvent,
        ]);
    };

    return useHTMLInput;
};
