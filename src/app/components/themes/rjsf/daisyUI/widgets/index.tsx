import getDefaultRegistry from "@rjsf/core/lib/getDefaultRegistry"
import { RegistryWidgetsType, WidgetProps } from "@rjsf/utils"
import CheckboxWidget from "./CheckboxWidget"
import RadioWidget from "./RadioWidget"
import SelectWidget from "./SelectWidget"

const { widgets } = getDefaultRegistry()

// SelectOrRadioWidget chooses a RadioWidget for single selections but chooses the SelectWidget by Default
function SelectOrRadioWidget(props: WidgetProps) {
  const { schema } = props

  // Choose the RadioWidget for single selections
  if (schema.type !== "boolean" && schema.enum) {
    return <RadioWidget {...props} />
  }

  // Fallback to the default select if none of the above conditions are met
  return <SelectWidget {...props} />
}

const widgetOverrides: RegistryWidgetsType = {
  ...widgets,
  CheckboxWidget,
  SelectWidget: SelectOrRadioWidget,
  RadioWidget,
}

export default widgetOverrides
