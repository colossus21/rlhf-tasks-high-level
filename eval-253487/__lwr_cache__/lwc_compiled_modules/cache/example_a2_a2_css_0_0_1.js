function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return ".radio-option" + shadowSelector + " {display: inline-block;margin-right: 1rem;}";
  /*LWC compiler v8.6.0*/
}
export default [stylesheet];