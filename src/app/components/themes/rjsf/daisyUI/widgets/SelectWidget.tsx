import { WidgetProps } from "@rjsf/utils"

export default function SelectWidget(props: WidgetProps) {
  return (
    <select
      id={props.id}
      name={props.id}
      multiple={props.multiple}
      className="select-bordered select w-full"
      value={typeof props.selectedIndexes === "undefined" ? props.emptyValue : props.selectedIndexes}
      required={props.required}
      disabled={props.disabled || props.readonly}
      autoFocus={props.autofocus}
      onBlur={props.handleBlur}
      onFocus={props.handleFocus}
      onChange={props.handleChange}
    >
      {!props.multiple && props.schema.default === undefined && <option value="">{props.placeholder}</option>}
      {Array.isArray(props.options.enumOptions) &&
        props.options.enumOptions.map(({ value, label }, i) => {
          const disabled = props.enumDisabled && props.enumDisabled.indexOf(value) !== -1
          return (
            <option key={i} value={String(i)} disabled={disabled}>
              {label}
            </option>
          )
        })}
    </select>
  )
}
