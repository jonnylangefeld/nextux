import getDefaultRegistry from "@rjsf/core/lib/getDefaultRegistry"
import { RegistryWidgetsType } from "@rjsf/utils"
import CheckboxWidget from "./CheckboxWidget"
import SelectWidget from "./SelectWidget"

const { widgets } = getDefaultRegistry()

const widgetOverrides: RegistryWidgetsType = {
  ...widgets,
  CheckboxWidget,
  SelectWidget,
}

export default widgetOverrides
