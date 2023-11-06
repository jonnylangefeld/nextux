/**
 * This is a copy of the original RadioWidget.tsx from the @rjsf/utils package.
 * The only change is the className of the select element.
 * @see https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/widgets/RadioWidget.tsx
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  ariaDescribedByIds,
  enumOptionsIsSelected,
  enumOptionsValueForIndex,
  FormContextType,
  optionId,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from "@rjsf/utils"
import { FocusEvent, useCallback } from "react"

function RadioWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  options,
  value,
  required,
  disabled,
  readonly,
  autofocus = false,
  onBlur,
  onFocus,
  onChange,
  id,
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled, inline, emptyValue } = options

  const handleBlur = useCallback(
    ({ target: { value } }: FocusEvent<HTMLInputElement>) =>
      onBlur(id, enumOptionsValueForIndex<S>(value, enumOptions, emptyValue)),
    [onBlur, id]
  )

  const handleFocus = useCallback(
    ({ target: { value } }: FocusEvent<HTMLInputElement>) =>
      onFocus(id, enumOptionsValueForIndex<S>(value, enumOptions, emptyValue)),
    [onFocus, id]
  )

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2" id={id}>
      {Array.isArray(enumOptions) &&
        enumOptions.map((option, i) => {
          const checked = enumOptionsIsSelected<S>(option.value, value)
          const itemDisabled = Array.isArray(enumDisabled) && enumDisabled.indexOf(option.value) !== -1
          const disabledCls = disabled || itemDisabled || readonly ? "disabled" : ""

          const handleChange = () => onChange(option.value)

          const radio = (
            <div className="flex flex-row gap-x-2">
              <input
                key={i}
                type="radio"
                className="radio"
                id={optionId(id, i)}
                checked={checked}
                name={id}
                required={required}
                value={String(i)}
                disabled={disabled || itemDisabled || readonly}
                autoFocus={autofocus && i === 0}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                aria-describedby={ariaDescribedByIds<T>(id)}
              />
              <div className="label-text">{option.label}</div>
            </div>
          )

          return inline ? (
            <label key={i} className={`${disabledCls}`}>
              {radio}
            </label>
          ) : (
            radio
          )
        })}
    </div>
  )
}

export default RadioWidget
