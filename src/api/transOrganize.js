/**
 * 发货货源相关JS数据接口
 */
import server from "./server.js";
let $http = server.Axios;
// 24005 - 发货模板列表
export function getDeliveryGoodsTemplete(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "24005",
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

// 24006-发货模板详情
export function getTempleteDetails(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "24006",
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
// 24007-新增发货模板
export function addDeliveryGoodsTemplete(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "24007",
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
// 46000 - 新增货源
export function newAddGoodsResource(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "46000",
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

// 46001-修改货源
export function modifyGoodsResource(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "46001",
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

// 46002-取消货源
export function cancelGoodsResource(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "46002",
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

// 46003-货源建单
export function buildGoodsResource(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "46003",
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

// 46004-货源详情
export function goodsResourceDetail(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "46004",
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

// 46005 - 货源列表
export function goodsResourceList(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "46005",
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