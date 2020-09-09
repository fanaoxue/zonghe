import server from "./server.js";
let $http = server.Axios;
export function activityMaidian(condition) { // 25006-日常活动行为埋点
  return new Promise((resolve, reject) => {
    $http({
      sid: '25006',
      iResType: 1,
      timeout: 60000,
      datas: condition
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}