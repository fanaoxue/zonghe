import server from "./server.js";
let $http = server.Axios;

// 车队选择列表数据请求
export function getDriverMsgList() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3022"
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 车队选择列表数据请求
export function getDriverMsgSearch(params) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3003",
      datas: {
        condition: params.condition,
        pageSize: params.pageSize,
        pageIdx: params.pageIdx
      },
      iResType: 1
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 获取运单号
export function qeurywaybillNo() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3023",
      iResType: 1
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 查询所有运单配置
export function queryWaybill() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3013",
      iResType: 1
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 获取受票方
export function getDrawee(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3015",
      iResType: 1,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 获取承运项目
export function getCarrierProject(json) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3072",
      iResType: 1,
      datas: {
        taxDraweePartyId: json
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 验证运单重复性风控
export function validateTaxWaybillNo(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3009",
      iResType: 1,
      datas: {
        condition: condition
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 运单号判断运单是否重复
export function waybillRepeat(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3018",
      iResType: 1,
      datas: {
        taxWaybillNo: condition
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 检验运费合理性
export function checkFee(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3010",
      iResType: 1,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 建单
export function success(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3006",
      iResType: 1,
      timeout: 60000,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 通过模板ID去后台查信息
export function wayBillTemp(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3025",
      iResType: 1,
      datas: {
        mWaybillTemplateId: condition
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 获取填写收款信息页面收款记录列表
export function getRecPayHistory(conditions) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "8003",
      timeout: 60000,
      iResType: 1,
      datas: conditions
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 获取填写收款信息页面银行卡列表
export function getBankList() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "9001",
      iResType: 1,
      datas: {}
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 获取回款宝支持的银行列表
export function getHkbBankList() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "9002",
      iResType: 1,
      datas: {}
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 获取填写收款信息页面银行卡列表
export function gateCheckOfCardNum(payName, payeeIdCard) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5015",
      iResType: 1,
      datas: {
        name: payName,
        idCard: payeeIdCard
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 同城区县必填
export function checkCommonCity(
  fromProvId,
  fromCityId,
  toCityId,
  fromCountyId,
  toCountyId
) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3008",
      iResType: 1,
      datas: {
        fromProvId: fromProvId, // 起始省份编码
        fromCityId: fromCityId, // 起始城市编码
        toCityId: toCityId, // 目的城市编码
        fromCountyId: fromCountyId, // 起始区县编码
        toCountyId: toCountyId // 目的区县编码
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function checkOrderAgain(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3009",
      iResType: 1,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 运单详情
export function waybillDetail(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3053",
      iResType: 1,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 删除运单
export function deleteWaybill(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3002",
      iResType: 1,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 运单支付明细
export function waybillPayMsg(taxWaybillId) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3035",
      datas: {
        taxWaybillId: taxWaybillId
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 修改运单页面的配置
export function queryWaybillChange(taxWaybillId) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3017",
      iResType: 1,
      datas: {
        taxWaybillId: taxWaybillId
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 修改运单
export function reWriteWaybill(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3007",
      iResType: 1,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 司机列表查询过后点击下一步
export function driverNext(
  mobileNo,
  cartBadgeNo,
  driverName,
  carType,
  carLength,
  carTonnage
) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "2001",
      iResType: 1,
      datas: {
        mobileNo: mobileNo,
        cartBadgeNo: cartBadgeNo,
        driverName: driverName,
        cartType: carType,
        cartLength: carLength,
        cartTonnage: carTonnage
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 查看运单修改记录是否存在
export function isRecordShow(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3045",
      iResType: 1,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 查看运单修改记录
export function modifyRecord(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3044",
      iResType: 1,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 再建一单
export function buildWaybillAgain(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3048",
      iResType: 1,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 获取运单最热门起始目的地
export function getHotCity(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3049",
      iResType: 1,
      datas: {
        type: condition
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 查询自保理状态
export function zblState() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3004",
      iResType: 1,
      datas: {}
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 查询自供应链金融配置
export function supplyChainState() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "1008",
      iResType: 1,
      datas: {}
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 验证司机四要素
export function yanzhenFourElement(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3059",
      iResType: 1,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 根据手机号获取司机回款宝四要素信息
export function phoneGetName(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3058",
      iResType: 1,
      datas: condition
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 查询自供应链金融配置
export function getRecommendedReward() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3060",
      iResType: 1,
      datas: {},
      timeout: 60000
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 查询自供应链金融配置
export function getAlipayQRcode() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3061",
      iResType: 1,
      datas: {},
      timeout: 60000
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function uploadImage(imageFileList) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "25014",
      iResType: 1,
      timeout: 60000,
      datas: {
        imageFileList: imageFileList
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//11002-查询运单图片信息
export function getBillImage(data) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "11002",
      iResType: 1,
      timeout: 60000,
      datas: {
        imageType: data.imageType,
        xid: data.xid
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 3067-上传磅单/协议
export function uploadImgUrl(data) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3067",
      iResType: 1,
      timeout: 60000,
      datas: {
        taxWaybillId: data.taxWaybillId,
        xid: data.xid,
        sucOutPhotoUrl: data.sucOutPhotoUrl,
        sucReceiptPhotoUrl: data.sucReceiptPhotoUrl,
        contractPhotoUrl: data.contractPhotoUrl,
        transTripType: data.transTripType
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//3065-大宗版运单详情
export function bigWayBillDetail(data) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3065",
      iResType: 1,
      timeout: 60000,
      datas: {
        taxWaybillId: data.taxWaybillId
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 11003-查看协议
export function getAgreementUrl(data) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "11003",
      iResType: 1,
      timeout: 60000,
      datas: {
        taxWaybillId: data.taxWaybillId
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 11038-查询车队信息
export function getDriverMsgSearchPagination(params) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "11038",
      datas: {
        condition: params.condition,
        pageSize: params.pageSize,
        pageIdx: params.pageIdx
      },
      iResType: 1
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 3078-磅单页面区分接口
export function getWeightBillPageType(params) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3078",
      datas: {
        transportLineId: params.transportLineId,
        xid: params.xid,
        taxWaybillId: params.taxWaybillId
      },
      iResType: 1
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 3020-获取企业配置信息
export function getCompanyConfig() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3020",
      datas: {},
      iResType: 1
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//  8006-查询上一笔运费是否是相同的司机收款
export function beforeSureApplyPay(params) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "8006",
      timeout: 60000,
      iResType: 1,
      datas: params
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//  1015-获取当前登陆用户的基本信息
export function getBaseInfo(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "1015",
      iResType: 1,
      datas: condition,
      timeout: 60000
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//   17004-货源通知短信接口
export function sendTransOrganizeMessages(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "17004",
      iResType: 1,
      datas: condition,
      timeout: 60000
    }).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
}

//  3034-查看协议
export function toSeeAgreement(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3034",
      iResType: 1,
      datas: condition,
      timeout: 60000
    }).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
}
