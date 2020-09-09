import server from "./server.js";
let $http = server.Axios;

/**
 *
 * 5019-查询认证信息
 * @export
 * @returns
 */
export function getCertification(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5019",
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

/**
 *
 * 5026-上传图片
 * @export
 * @returns
 */
export function confirmImage(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5026",      
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

/**
 *
 * 5016-提交身份证OCR验证
 * @export
 * @returns
 */
export function confirmIDCard(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5016",      
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

/**
 *
 * 5021-提交身份证反面OCR验证
 * @export
 * @returns
 */
export function confirmIDCardReverse(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5021",      
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

/**
 *
 * 5017-提交驾驶证OCR验证
 * @export
 * @returns
 */
export function confirmDriverLicense(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5017",      
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

/**
 *
 * 5018-提交行驶证OCR验证
 * @export
 * @returns
 */
export function confirmDrivingLicense(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5018",      
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

/**
 *
 * 5005-保存认证
 * @export
 * @returns
 */
export function submitCertification(condition) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5005",      
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