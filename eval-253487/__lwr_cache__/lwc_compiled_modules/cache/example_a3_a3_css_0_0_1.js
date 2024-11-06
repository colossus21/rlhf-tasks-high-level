function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return ".radio-group" + shadowSelector + " {display: grid;grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));grid-gap: 1rem;}";
  /*LWC compiler v8.6.0*/
}
export default [stylesheet];