"use strict";
/**
 * 公共常量
 */
//tc服务器访问地址
let SERVER_BASE_URL;
let HYB_WALLET;
let APP_URL;
switch (process.env.NODE_ENV) {
  case "development":
    SERVER_BASE_URL = "/api"; //http://220.248.226.76:20131/luge/gateway.do
    HYB_WALLET = "https://dcatest.log56.com/dca/loginMD5Check.action"
    // APP_URL = window.location.protocol + window.location.host + '/#'
    APP_URL = '/#'
    break;
  case "testing":
    // SERVER_BASE_URL = "/mstest.log56.com:20135";
    SERVER_BASE_URL = "/test-microservice.log56.com";
    HYB_WALLET = "https://dcatest.log56.com/dca/loginMD5Check.action"
    APP_URL = window.location.protocol + window.location.host + '/ngcbapp_h5/dist/index.html#'
    break;
  case "pre":
    SERVER_BASE_URL = "pre-syf.log56.com";
    HYB_WALLET = "https://dcatest.log56.com/dca/loginMD5Check.action"
    APP_URL = window.location.protocol + window.location.host + '/ngcbapp_h5/dist/index.html#'
    break;
  case "production":
    SERVER_BASE_URL = "syf.log56.com";
    HYB_WALLET = "https://dca.log56.com/dca/loginMD5Check.action";
    APP_URL = window.location.protocol + window.location.host + '/ngcbapp_h5/dist/index.html#'
    break;
  default:
    SERVER_BASE_URL = "syf.log56.com";
    HYB_WALLET = "https://dca.log56.com/dca/loginMD5Check.action";
    APP_URL = window.location.protocol + window.location.host + '/ngcbapp_h5/dist/index.html#'
    break;
}

export default {
  tc_base_http: SERVER_BASE_URL,
  HYB_WALLET: HYB_WALLET,
  APP_URL,
  CART_BADGE_COLOR_ARR: ['黄色', '蓝色', '绿色', '黄绿色', '渐变绿', '农绿色'],
};
