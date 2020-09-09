// 德邦外协使用接口
import server from "./server.js";
let $http = server.Axios;
// 3084 - 派单
export function waixieDeliverWaybill(conditon) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '3084',
      timeout: 60000,
      iResType: 1,
      datas: conditon
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

//  3085-获取外协供应商信息
export function getWaixieCarrier(conditon) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '3085',
      timeout: 60000,
      iResType: 1,
      datas: conditon
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 3086 - 外协修改运单
export function waixieModifyWaybill(conditon) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '3086',
      timeout: 60000,
      iResType: 1,
      datas: conditon
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}