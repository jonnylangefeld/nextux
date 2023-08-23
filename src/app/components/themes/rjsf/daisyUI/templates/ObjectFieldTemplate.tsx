import { ObjectFieldTemplateProps } from "@rjsf/utils"

export default function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="mb-3 text-2xl">{props.title}</div>
      {props.description}
      {props.properties.map((element) => element.content)}
    </div>
  )
}
