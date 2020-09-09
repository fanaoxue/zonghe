import server from "./server.js";
let $http = server.Axios;

// 1011-通过token获取用户相关信息
export function getUserInfo(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "1011",
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

// 48000-运力组织首页统计接口
export function getStatistics(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "48000",
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

// 48001-运力地图数据
export function getMapData(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "48001",
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

//   48002-运力组织列表总数统计
export function getInfos(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "48002",
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
// 48003-我的运力列表(直属、初级、审批)
export function getCapacityList(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "48003",
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
// 48004-接收人列表
export function receivePersonList(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "48004",
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

// 48005-审批操作接口
export function approvalOperation(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "48005",
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

//  48006-升级直属
export function upgradeDirect(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "48006",
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

// 48007-下发通知
export function releaseNotice(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "48007",
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

//  48010【W3】-获取服务条例信息
export function getServeInfo(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "48010",
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

// 48016 - 是否第一次进入直属页面
export function isFirstCome(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "48016",
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