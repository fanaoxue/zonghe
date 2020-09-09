import { AppGetTokenApi, systemType } from '../utils/app.js'
import { getCookie } from '../utils/getCookie.js'
import store from '../store'
let sysType = systemType();
/**
 * 获取Token信息
 */
export function getToken() {
  let token_val = store.state.user.token
  if (token_val) {
    return token_val
  }
  token_val = getCookie('token')
  store.commit('user/setToken', token_val)
  return token_val
}
/**
 * aid
 */
export function getAid() {
  let aid_val = store.state.user.aid
  if (aid_val) {
    return aid_val
  }
  if (sysType == 1 || sysType == 2) {
    aid_val = getCookie('client_aid')
  } else {
    aid_val = process.env.NODE_ENV === 'development' ? 'QDD201809061356001' : (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'pre' ? 'QDD201809061356001' : 'QDD201810091648001')
  }
  store.commit('user/setAid', aid_val)
  return aid_val
}
/**
 * appVersion
 */
export function getAppVersion() {
  let appVersion_val = store.state.user.appVersion
  if (appVersion_val) {
    return appVersion_val
  }
  if (sysType == 1 || sysType == 2) {
    appVersion_val = getCookie('app_version')
  } else {
    appVersion_val = ''
  }
  store.commit('user/setAppVersion', appVersion_val)
  return appVersion_val
}