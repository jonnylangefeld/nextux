import getDefaultRegistry from "@rjsf/core/lib/getDefaultRegistry"
import { TemplatesType } from "@rjsf/utils"
import BaseInputTemplate from "./BaseInputTemplate"
import FieldTemplate from "./FieldTemplate"
import ObjectFieldTemplate from "./ObjectFieldTemplate"
import TitleFieldTemplate from "./TitleFieldTemplate"

const { templates } = getDefaultRegistry()

const templateOverrides: TemplatesType = {
  ...templates,
  BaseInputTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  TitleFieldTemplate,
}

export default templateOverrides
