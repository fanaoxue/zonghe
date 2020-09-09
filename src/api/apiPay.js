import server from "./server.js";
let $http = server.Axios;

export function getRecPayHistory(data) {
  // 获取填写收款信息页面收款记录列表
  return new Promise((resolve, reject) => {
    $http({
      sid: "8003",
      timeout: 60000,
      iResType: "1",
      datas: {
        taxWaybillId: data.taxWaybillId,
        mobileNo: data.mobileNo,
        payeeName: data.payeeName,
        entType: data.entType,
        hybWalletCfg: data.hybWalletCfg,
        autoShowWalletCfg: data.autoShowWalletCfg,
        cartBadgeNo: data.cartBadgeNo,
        driverName: data.driverName
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
