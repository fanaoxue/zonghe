import server from './server.js'
let $http = server.Axios
export function dazongModifyBill(taxWaybillId) { // 大综-修改运单前的查询
    return new Promise((resolve, reject) => {
        $http({
            sid: '3063',
            iResType: 1,
            datas: {
                taxWaybillId: taxWaybillId
            },
            timeout: 60000
        }).then((res) => {
            resolve(res)
        }).catch((error) => {
            reject(error)
        })
    })
}
export function dazongNewBill(json) { // 大综-新增运单前的查询
    return new Promise((resolve, reject) => {
        $http({
            sid: '3064',
            iResType: 1,
            datas: json,
            timeout: 60000
        }).then((res) => {
            resolve(res)
        }).catch((error) => {
            reject(error)
        })
    })
}
export function dazongBuildWaybill(condition) { // 大综-扫码建单
    return new Promise((resolve, reject) => {
        $http({
            sid: '3066',
            iResType: 1,
            datas: condition,
            timeout: 60000
        }).then((res) => {
            resolve(res)
        }).catch((error) => {
            reject(error)
        })
    })
}
export function dazongModifyWayBill(condition) { // 大综-修改运单
    return new Promise((resolve, reject) => {
        $http({
            sid: '3068',
            iResType: 1,
            datas: condition,
            timeout: 60000
        }).then((res) => {
            resolve(res)
        }).catch((error) => {
            reject(error)
        })
    })
}
export function getTransportInfo(condition) { // 大综-扫码进来通过ID去查数据
    return new Promise((resolve, reject) => {
        $http({
            sid: '3097',
            iResType: 1,
            datas: condition,
            timeout: 60000
        }).then((res) => {
            resolve(res)
        }).catch((error) => {
            reject(error)
        })
    })
}
