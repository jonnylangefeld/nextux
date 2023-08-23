import { ObjectFieldTemplateProps } from "@rjsf/utils"

export default function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  return (
    <div className="form-control mt-4 gap-y-2">
      <div className="mb-2 text-xl">{props.title}</div>
      {props.description}
      {props.properties.map((element) => element.content)}
    </div>
  )
}
