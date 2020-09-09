import server from './server.js'
let $http = server.Axios
export function selectOilCard (belongActSys, cartBadgeNo,driverMobileNo) { // 进入选择油卡页面前的查询
  return new Promise((resolve, reject) => {
    $http({
      sid: '16001', // 3050
      iResType: 1,
      datas: {
        belongActSys: belongActSys,
        cartBadgeNo: cartBadgeNo,
        driverMobileNo:driverMobileNo
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function newAddOilCard (prepaymentsOilCard, cartBadgeNo, belongActSys) { // 绑定油卡
  return new Promise((resolve, reject) => {
    $http({
      sid: '16002',
      iResType: 1,
      datas: {
        prepaymentsOilCard: prepaymentsOilCard,
        cartBadgeNo: cartBadgeNo,
        belongActSys: belongActSys
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}
export function oilCardManagement () { // 油卡管理
	return new Promise((resolve, reject) => {
		$http({
			sid: '16003',
			iResType: 1,
			datas: {}
		}).then((res) => {
			resolve(res)
		}).catch((error) => {
			reject(error)
		})
	})
}

export function bindOilCard (oilCardNo, cartBadgeNo, driverName, mobileNo) { // 绑定油卡接口
  return new Promise((resolve, reject) => {
    $http({
      sid: '16004', // 3055
      iResType: 1,
      datas: {
        oilCardNo: oilCardNo,
        cartBadgeNo: cartBadgeNo,
        driverName: driverName,
        driverMobileNo: mobileNo
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function oilCardCheck (item) { // 油卡校验接口
  return new Promise((resolve, reject) => {
    $http({
      sid: '16005',
      iResType: 1,
      datas: {
        prepaymentsOilCard: item.prepaymentsOilCard,
        cartBadgeNo: item.cartBadgeNo,
        belongActSys: item.belongActSys,
        oilCardNo: item.oilCardNo
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

/**
 *通过手机号判断是否已经开通电子油卡
 *
 * @export
 * @param {*} driverMobileNo
 * @param {*} driverName
 * @returns
 */
export function openElectronicOilCard (driverMobileNo,driverName) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '16006',
      iResType: 1,
      datas: {
        driverMobileNo:driverMobileNo,
        driverName:driverName
      },
      timeout: 60000
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}


/**
 *判断是否是电子油卡
 *
 * @export
 * @param {*} oilCardNo
 * @returns
 */
export function queryOilCardType (oilCardNo) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '16007',
      iResType: 1,
      datas: {
        oilCardNo:oilCardNo
      },
      timeout: 60000
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

/**
 * 16008-获取电子油卡卡号
 *
 * @export
 * @param {*} driverMobileNo
 * @returns
 */
export function getOilCardNo (params) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '16008',
      iResType: 1,
      datas: {
        driverMobileNo:params.driverMobileNo
      },
      timeout: 60000
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}
