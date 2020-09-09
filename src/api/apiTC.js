
import server from './server.js'
let $http = server.Axios
//20000-获取运力项目
export function getTCItem() {
  return new Promise((resolve, reject) => {
    $http({
      sid: '20000',
      iResType: 1,
      timeout: 60000
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

//20003-日志
export function ruleLogIfs(type, requestBody) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '20003',
      iResType: 1,
      timeout: 60000,
      datas: {
        type: type,
        requestBody: JSON.stringify(requestBody)
      },
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 20002-运力详情
export function getTCDetail(type, managerId) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '20002',
      iResType: 1,
      timeout: 60000,
      datas: {
        type: type,
        managerId: managerId
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 20001-新增运力接口
export function addTransportCapactity(cartBadgeNo, driverName, mobileNo) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '20001',
      iResType: 1,
      timeout: 60000,
      datas: {
        cartBadgeNo: cartBadgeNo,
        driverName: driverName,
        mobileNo: mobileNo
      },
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

//20005-修改运力前的查询
export function beforeUpdateTransportCapactity(cartBadgeNo) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '20005',
      iResType: 1,
      timeout: 60000,
      datas: {
        cartBadgeNo: cartBadgeNo,
      },
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

//20004-修改运力
export function updateTransportCapactity(data) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '20004',
      iResType: 1,
      timeout: 60000,
      datas: {
        cartBadgeNo: data.cartBadgeNo,
        transportCapacityRecId: data.transportCapacityRecId,
        driverName: data.driverName,
        mobileNo: data.mobileNo
      },
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 25027-我的运力列表
export function myTransportCapactity(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '25027',
      iResType: 1,
      timeout: 60000,
      datas: condition,
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}