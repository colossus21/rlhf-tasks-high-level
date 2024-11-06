import _implicitStylesheets from "./a1.css";
import _implicitScopedStylesheets from "./a1.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<main${3}><div class="radio-group${0}"${2}><label class="radio-option${0}"${2}><input type="radio" name="option"${"a3:id"} value="option1" checked${3}><span${3}>Option 1</span></label><label class="radio-option${0}"${2}><input type="radio" name="option"${"a7:id"} value="option2"${3}><span${3}>Option 2</span></label><label class="radio-option${0}"${2}><input type="radio" name="option"${"a11:id"} value="option3"${3}><span${3}>Option 3</span></label></div></main>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {gid: api_scoped_id, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1, 1, [api_static_part(3, {
    attrs: {
      "id": api_scoped_id("option1")
    }
  }, null), api_static_part(7, {
    attrs: {
      "id": api_scoped_id("option2")
    }
  }, null), api_static_part(11, {
    attrs: {
      "id": api_scoped_id("option3")
    }
  }, null)])];
  /*LWC compiler v8.6.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-6ulsa31pv5c";
tmpl.legacyStylesheetToken = "example-a1_a1";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
