import { WidgetProps } from "@rjsf/utils"

export default function CheckboxWidget(props: WidgetProps) {
  return (
    <label className="label flex cursor-pointer flex-row gap-x-3">
      <p className="label-text">{props.label}</p>
      <input type="checkbox" checked={props.value} className="checkbox" onChange={() => props.onChange(!props.value)} />
    </label>
  )
}
