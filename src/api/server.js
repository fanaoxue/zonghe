import axios from "axios";
// import sha1 from 'js-sha1'
import router from "../router";
import { systemType, AppGetTokenApi } from "../utils/app.js";
import { getToken, getAppVersion, getAid } from "./server.config.js";
import store from "../store";
let crypto = require("crypto");
let nodeWrapSha1 = function (message) {
  return crypto
    .createHash("sha1")
    .update(message, "utf8")
    .digest("hex");
};
let signCreateMethod = function (aid, token, sid, data) {
  let signStr = aid + sid + token;
  if (typeof data === "string") {
    signStr = signStr + data;
  } else {
    signStr = signStr + JSON.stringify(data);
  }
  return {
    sign: nodeWrapSha1(signStr)
  };
};
let sysType = systemType();

let u =
  navigator.userAgent +
  (sysType === 1 ? "KLB_ANDROID" : sysType === 2 ? "KLB_IOS" : "");
console.log(process.env.NODE_ENV);
let reqUrl =
  process.env.NODE_ENV === "development"
    ? "/api/gateway.do"
    : process.env.NODE_ENV === "testing"
      ? "https://test-microservice.log56.com/luge/gateway.do"
      : process.env.NODE_ENV === "pre"
        ? "//pre-syf.log56.com/luge/gateway.do"
        : "//syf.log56.com/luge/gateway.do";

let versionType =
  sysType === 1
    ? { android_version: getAppVersion() }
    : sysType === 2
      ? { ios_version: getAppVersion() }
      : { v: getAppVersion() };

// 创建一个axios的对象
console.log(reqUrl);
const Axios = axios.create({
  baseURL: reqUrl,
  method: "post",
  timeout: 60000,
  responseType: "json",
  withCredentials: false, // 是否允许带cookie这些
  headers: Object.assign(
    {
      "Content-Type": "application/json;charset=UTF-8"
      // eslint-disable-next-line no-undef
    },
    versionType
  ),
  imageFile: "",
  interfaceName: "",
  // data: {
  //   aid: getAid(), // aid
  //   token: getToken() // 登录令牌,token
  // },
  datas: {},
  sid: "",
  // ext: {
  //   version: getAppVersion(),
  //   terminalType: sysType + "",
  //   userAgent: u,
  //   n_state: ""
  // },
  iResType: 0 // 默认为0，渲染型数据类型接口 ，1：交互型数据类型接口
});
// POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    config.data = {
      aid: getAid(), // aid
      token: getToken() // 登录令牌,token
    };
    // config.data.aid = getAid();
    // config.data.token = getToken();
    config.ext = {
      version: getAppVersion(),
      terminalType: sysType + "",
      userAgent: u,
      n_state: ""
    };
    // 在发送请求之前做某件事
    let configdatasStr = JSON.stringify(config.datas);
    config.data.sid = config.sid;
    // config.data.data = JSON.stringify(config.datas)
    config.data.data = configdatasStr;
    config.data.ext = config.ext;
    config.data = Object.assign(
      config.data,
      signCreateMethod(
        getAid(),
        getToken(),
        config.sid,
        configdatasStr,
        config.ext
      )
    );
    return config;
  },
  error => {
    return Promise.reject(error.data.error.message);
  }
);
// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    // 对响应数据做些事
    console.log(res);
    if (res.data.reCode === "4" || res.data.reCode === "3") {
      // token 失效问题
      if (sysType === 0) {
        router.push({
          path: "/errorPage",
          query: { errorMsg: res.data.reInfo }
        });
      } else {
        // // 清除cookie里面的信息
        // var date = new Date()
        // date.setTime(date.getTime() - 10000)
        // document.cookie = 'token' + '=v; expires=' + date.toGMTString()
        // 清除store里面的信息
        store.commit("user/setToken", "");
        store.commit("user/setAid", "");
        store.commit("user/setAppVersion", "");
        // 延时调取客户端操作
        setTimeout(() => {
          AppGetTokenApi();
        }, 500);
      }
    } else if (
      res.data &&
      !(res.data.reCode === "0") &&
      res.config.iResType === 0
    ) {
      // "跳转至错误页面并且展示服务器返回的对应的错误信息："+res.data.reInfo
      router.push({
        path: "/errorPage",
        query: { errorMsg: res.data.reInfo }
      });
      return Promise.reject(res);
    }
    return res;
  },
  error => {
    // 跳转到错误页面...错误信息为：'+error.message;
    router.push({
      path: "/errorPage",
      query: { errorMsg: error.message }
    });
    return Promise.reject(error);
  }
);
// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, "$http", { value: Axios });
  },
  Axios
};
