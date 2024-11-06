import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./b1.html";
class RadioButtonHorizontal extends LightningElement {
  constructor(...args) {
    super(...args);
    this.value = '';
    // to hold the selected value
    this.options = [{
      label: 'Option 1',
      value: 'option1'
    }, {
      label: 'Option 2',
      value: 'option2'
    }, {
      label: 'Option 3',
      value: 'option3'
    }];
  }
  handleChange(event) {
    this.value = event.detail.value;
  }
  /*LWC compiler v8.6.0*/
}
_registerDecorators(RadioButtonHorizontal, {
  track: {
    value: 1
  },
  fields: ["options"]
});
const __lwc_component_class_internal = _registerComponent(RadioButtonHorizontal, {
  tmpl: _tmpl,
  sel: "example-b1",
  apiVersion: 63
});
export default __lwc_component_class_internal;