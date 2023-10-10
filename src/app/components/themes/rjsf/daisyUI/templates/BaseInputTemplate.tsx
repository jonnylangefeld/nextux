import getDefaultRegistry from "@rjsf/core/lib/getDefaultRegistry"
import { BaseInputTemplateProps } from "@rjsf/utils"

export default function BaseInputTemplate(props: BaseInputTemplateProps) {
  const {
    templates: { BaseInputTemplate },
  } = getDefaultRegistry()

  return (
    <BaseInputTemplate
      className={`input-bordered ${props.rawErrors !== undefined ? "input-error" : ""} input w-full`}
      {...props}
    />
  )
}
