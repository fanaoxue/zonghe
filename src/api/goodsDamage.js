import server from "./server.js";
let $http = server.Axios;
// 3089 - 查询运单保障记录数据
export function getGoodsDamageDetail(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3089",
      iResType: 1,
      datas: condition
    }).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
}

// 25028-获取快路宝用户弹窗次数
export function getPupupTime(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "25028",
      iResType: 1,
      datas: condition
    }).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
}

//  3089-查询运单保障记录数据
export function getLossEnsureId(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3089",
      iResType: 1,
      datas: condition
    }).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
}

// 3090-企业确认货损
export function submitDamage(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3090",
      iResType: 1,
      datas: condition
    }).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
}

// 17005-推送钉钉系统消息
export function submitDdMessage(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "17005",
      iResType: 1,
      datas: condition
    }).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
}

// 17007 - 获取apollo参数
export function getApolloParams(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "17007",
      iResType: 1,
      datas: condition
    }).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
}