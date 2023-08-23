import getDefaultRegistry from "@rjsf/core/lib/getDefaultRegistry"
import { RegistryWidgetsType } from "@rjsf/utils"
import CheckboxWidget from "./CheckboxWidget"

const { widgets } = getDefaultRegistry()

const widgetOverrides: RegistryWidgetsType = {
    ...widgets,
    CheckboxWidget,
}

export default widgetOverrides
