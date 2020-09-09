import server from "./server.js";
let $http = server.Axios;

// 3077-大宗运输线路列表
export function getLineList(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3077",
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

// 3097-查询大宗运输线路详情
export function getLineDetail(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3097",
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

// 3105-大宗新增线路
export function newAddLine(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3105",
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

// 3106-大宗修改线路
export function modifyLine(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "3106",
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
