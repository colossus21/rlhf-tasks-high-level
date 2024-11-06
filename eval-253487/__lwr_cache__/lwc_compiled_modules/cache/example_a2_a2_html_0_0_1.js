import _implicitStylesheets from "./a2.css";
import _implicitScopedStylesheets from "./a2.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<main${3}><div class="radio-group${0}"${2}><label class="radio-option${0}"${2}><input type="radio" name="option"${"a3:id"} value="option1" checked${3}>Option 1</label><label class="radio-option${0}"${2}><input type="radio" name="option"${"a6:id"} value="option2"${3}>Option 2</label></div></main>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {gid: api_scoped_id, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1, 1, [api_static_part(3, {
    attrs: {
      "id": api_scoped_id("option1")
    }
  }, null), api_static_part(6, {
    attrs: {
      "id": api_scoped_id("option2")
    }
  }, null)])];
  /*LWC compiler v8.6.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-15b8mm9fj04";
tmpl.legacyStylesheetToken = "example-a2_a2";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
