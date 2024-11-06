import _implicitStylesheets from "./b1.css";
import _implicitScopedStylesheets from "./b1.scoped.css?scoped=true";
import _lightningRadioGroup from "lightning/radioGroup";
import {freezeTemplate, registerTemplate} from "lwc";
const stc0 = {
  key: 0
};
const stc1 = {
  "horizontal-radio-group": true
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, c: api_custom_element, h: api_element} = $api;
  const {_m0} = $ctx;
  return [api_element("main", stc0, [api_custom_element("lightning-radio-group", _lightningRadioGroup, {
    classMap: stc1,
    props: {
      "label": "Choose an option",
      "options": $cmp.options,
      "value": $cmp.value,
      "type": "radio"
    },
    key: 1,
    on: _m0 || ($ctx._m0 = {
      "change": api_bind($cmp.handleChange)
    })
  })])];
  /*LWC compiler v8.6.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-5u3je9t5hpj";
tmpl.legacyStylesheetToken = "example-b1_b1";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
