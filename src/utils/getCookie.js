export function getCookie(key) {
  let reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return arr[2]
  } else {
    return ''
  }
}

//替换指定传入参数的值,paramName为参数,replaceWith为新值
export function replaceParamVal(paramName, replaceWith) {
  var oUrl = this.location.href.toString();
  var re = eval('/(' + paramName + '=)([^&]*)/gi');
  var nUrl = oUrl.replace(re, paramName + '=' + replaceWith);
  this.location = nUrl;
  window.location.href = nUrl
}