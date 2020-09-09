import server from "./server.js";
let $http = server.Axios;

/**
 * 25018-ETC活动信息
 *
 * @export
 * @returns
 */
export function getETCInfo() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "25018",
      datas: {
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

/**
 * 25021-ETC推荐奖励列表
 *
 * @export
 * @returns
 */
export function getETCRewardList() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "25021",
      datas: {
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

/**
 * 25022-ETC邀请记录
 *
 * @export
 * @returns
 */
export function getETCInvitationRecordList() {
  return new Promise((resolve, reject) => {
    $http({
      sid: "25022",
      datas: {
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
