import { TitleFieldProps } from "@rjsf/utils"

export default function TitleField(props: TitleFieldProps) {
  return (
    <p className="mb-3 text-2xl" id={props.id}>
      {props.title}
      {props.required && <mark>?</mark>}
    </p>
  )
}
