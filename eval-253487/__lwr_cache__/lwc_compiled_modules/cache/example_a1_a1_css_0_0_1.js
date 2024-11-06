function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return ".radio-group" + shadowSelector + " {display: inline-flex;align-items: center;gap: 1rem;}.radio-option" + shadowSelector + " {display: flex;align-items: center;white-space: nowrap;}.radio-option" + shadowSelector + " input" + shadowSelector + " {margin-right: 0.5rem;}@media (max-width: 768px) {.radio-group" + shadowSelector + " {flex-direction: column;align-items: flex-start;}}";
  /*LWC compiler v8.6.0*/
}
export default [stylesheet];