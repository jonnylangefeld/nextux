/**
 * This is a copy of the original SelectWidget.tsx from the @rjsf/daisyui package.
 * The only change is the className of the select element.
 * @see https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/widgets/SelectWidget.tsx
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  ariaDescribedByIds,
  enumOptionsIndexForValue,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from "@rjsf/utils"
import { ChangeEvent } from "react"

function SelectWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  id,
  options,
  value,
  disabled,
  readonly,
  autofocus = false,
  onChange,
  onBlur,
  onFocus,
  placeholder,
}: WidgetProps<T, S, F>) {
  const { enumOptions } = options

  const handleCheckboxChange = (checked: boolean, optionValue: string) => {
    // Ensure that newValue is always an array
    let newValue: any[] = Array.isArray(value) ? [...value] : []
    if (checked) {
      newValue.push(optionValue)
    } else {
      newValue = newValue.filter((v: any) => v !== optionValue)
    }
    onChange(newValue)
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {enumOptions?.map(({ value: optionValue, label }, i) => (
        <div key={i} className="form-control">
          <label className="flex cursor-pointer flex-row gap-x-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={value.includes(optionValue)}
              disabled={disabled || readonly}
              autoFocus={autofocus && i === 0} // Only the first checkbox should receive the autofocus.
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleCheckboxChange(event.target.checked, optionValue)
              }
              id={`${id}_${i}`}
              name={`${id}_${i}`}
              onBlur={(event) => onBlur && onBlur(id, event.target.value)}
              onFocus={(event) => onFocus && onFocus(id, event.target.value)}
              aria-describedby={ariaDescribedByIds<T>(id)}
            />
            <span className="label-text">{label}</span>
          </label>
        </div>
      ))}
    </div>
  )
}

export default SelectWidget
