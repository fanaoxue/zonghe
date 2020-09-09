import server from './server.js'
let $http = server.Axios
export function getBankName(bankCardNo) { // 申请支付根据卡号获取开户行名称
  return new Promise((resolve, reject) => {
    $http({
      //   sid: '8001',
      sid: '9000',
      iResType: 1,
      datas: {
        bankCardNo: bankCardNo
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function deletePayPerson(bankInfoId) { // 申请支付根据卡号获取开户行名称
  return new Promise((resolve, reject) => {
    $http({
      sid: '8004',
      iResType: 1,
      datas: {
        bankInfoId: bankInfoId
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function computedPayServerNum(eapfList) { // 申请支付根据卡号获取开户行名称
  return new Promise((resolve, reject) => {
    $http({
      sid: '8002',
      iResType: 1,
      datas: {
        eapfList: eapfList
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function sureApplyPay(options) { // 申请支付根据卡号获取开户行名称
  return new Promise((resolve, reject) => {
    $http({
      sid: '8000',
      timeout: 60000,
      iResType: 1,
      datas: options
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function sureApplyPay2(payType, oilCardNo, xid, payeeAmount) { // 申请支付根据卡号获取开户行名称
  return new Promise((resolve, reject) => {
    $http({
      sid: '8000',
      timeout: 60000,
      iResType: 1,
      datas: {
        payType: payType,
        oilCardNo: oilCardNo,
        xid: xid,
        payeeAmount: payeeAmount
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// export function applyDataInit (taxWaybillId) { // 申请支付页面数据初始化
//   return new Promise((resolve, reject) => {
//     $http({
//       sid: '3043',
//       datas: {
//         taxWaybillId: taxWaybillId
//       }
//     }).then((res) => {
//       resolve(res)
//     }).catch((error) => {
//       reject(error)
//     })
//   })
// }

export function applyDataInit(taxWaybillId) { // 申请支付页面数据初始化
  return new Promise((resolve, reject) => {
    $http({
      sid: '3079',
      datas: {
        taxWaybillId: taxWaybillId
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function infoEntry(options) { // 收款人信息录入
  return new Promise((resolve, reject) => {
    $http({
      sid: '8005',
      timeout: 60000,
      iResType: 1,
      datas: {
        mobileNo: options.mobileNo,
        payeeBankNo: options.payeeBankNo,
        payeeName: options.payeeName,
        payeeBankName: options.payeeBankName,
        payeeProvinceId: options.payeeProvinceId,
        payeeCityId: options.payeeCityId,
        payeeIdCard: options.payeeIdCard,
        payeeMobileNo: options.payeeMobileNo,
        alipayNo: options.alipayNo
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function getIdCard(items) { // 选择本人后获取身份证号
  return new Promise((resolve, reject) => {
    $http({
      sid: '5020',
      timeout: 60000,
      iResType: 1,
      datas: {
        driverMobileNo: items.driverMobileNo,
        driverName: items.driverName
      }
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function getHYBwallet(conditon) { // 8007-获取好运宝钱包
  return new Promise((resolve, reject) => {
    $http({
      sid: '8007',
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

export function isCanToPay(conditon) { // 3069-判断是否能申请支付
  return new Promise((resolve, reject) => {
    $http({
      sid: '3069',
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

// 8033 - 获取司机和车队长钱包信息
export function getCarMasterInfo(conditon) {
  return new Promise((resolve, reject) => {
    $http({
      sid: '8033',
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

// 3054-判断运单是否已支付完成预付油卡
export function getPrepaymentsOilCardNotPaid(conditon) { 
  return new Promise((resolve, reject) => {
    $http({
      sid: '3054',
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