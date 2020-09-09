/* eslint-disable no-unused-vars */
"use strict";
/**
 * 工具集合
 */
// 正则
const REG_MOBILE_PATTERN = /^1\d{10}$/;
let Utils = (function (root) {
  function Utils() { }
  //截取当前URL访问字符串，返回一个数组，通过url变量名获取对应的值，如果只不存在则返回null
  Utils.prototype.urlSearch = () => {
    let url = location.search;
    let qs = url ? url.split("?")[1] : url.length > 0 ? url.substring(1) : "";
    let args = {};
    let items = qs.length > 0 ? qs.split("&") : [];
    let item = "";
    let name = "";
    let value = "";
    let len = items.length;
    for (var i = 0; i < len; i++) {
      item = items[i].indexOf("=");
      if (item === -1) {
        continue;
      }
      name = items[i].substring(0, item);
      if (name === null || name.length === 0) {
        continue;
      }
      value = items[i].substring(item + 1, items[i].length);
      value = value != null || value.length !== 0 ? value : null;
      args[name] = value;
    }
    return args;
  };
  //判断字符串是否为空
  Utils.prototype.isNotEmpty = str => {
    return !(typeof str === "undefined" || str === null || str.length === 0);
  };
  //手机号验证
  Utils.prototype.isMobileNo = mob => {
    return REG_MOBILE_PATTERN.test(mob);
  };
  //获取存储数据
  Utils.prototype.getSession = key => {
    // eslint-disable-next-line no-redeclare
    var key = window.sessionStorage.getItem(key);
    return typeof key === "undefined" ? null : key;
  };
  //保存数据
  Utils.prototype.setSession = (key, val) => {
    window.sessionStorage.setItem(key, val);
  };
  //重设title
  Utils.prototype.setTitle = title => {
    document.title = title;
    if (
      typeof window.webkit !== "undefined" &&
      typeof window.webkit.messageHandlers.giveViewTitle !== "undefined"
    ) {
      window.webkit.messageHandlers.giveViewTitle.postMessage(title);
    }
  };
  return new Utils();
})(this);

export default {
  // eslint-disable-next-line no-unused-vars
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, "$utils", { value: Utils });
    Vue.$utils = Utils;
  }
};
