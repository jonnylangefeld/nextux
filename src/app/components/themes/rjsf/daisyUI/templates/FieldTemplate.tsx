import { FieldTemplateProps } from "@rjsf/utils"

export default function FieldTemplate(props: FieldTemplateProps) {
  return (
    <div className="flex flex-row items-center gap-x-3" style={props.style}>
      {props.displayLabel && (
        <label className="label label-text" htmlFor={props.id}>
          {props.label}
          {props.required ? "*" : null}
        </label>
      )}
      {props.description}
      {props.children}
      {props.errors}
      {props.help}
    </div>
  )
}
