import { FieldTemplateProps } from "@rjsf/utils"

export default function FieldTemplate(props: FieldTemplateProps) {
  return (
    <div className="form-control" style={props.style}>
      {props.displayLabel && (
        <label className="label label-text">
          {props.label}
          {props.required ? "*" : null}
        </label>
      )}
      {props.children}
      {(props.description?.props.description || props.errors?.props.errors) && (
        <label className="label">
          {/* <span className="label-text-alt">{props.description}</span> */}
          <span className="label-text-alt">{props.errors}</span>
        </label>
      )}
      {props.help}
    </div>
  )
}
