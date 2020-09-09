import server from "./server.js";
let $http = server.Axios;
// 5022-获取最新一条收款银行卡信息
export function getNewBankCard(params) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5022",
      iResType: 1,
      datas: {
        realName: params.realName,
        payeeIdCard: params.payeeIdCard
      },
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

// 5023-绑定网商银行卡
export function bindBankCard(params) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5023",
      iResType: 1,
      datas: {
        dcaWsUserId: params.dcaWsUserId,
        bankCardNo: params.bankCardNo,
        bankName: params.bankName,
        realName: params.realName,
        from: params.from
      },
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

// 5019-查询认证信息
export function getCertificationInformation(params) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5019",
      iResType: 1,
      datas: {
        mobileNo: params.mobileNo,
        driverName: params.driverName,
        cartBadgeNo: params.cartBadgeNo
      },
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

// 5024-网商-判断是否已绑定银行卡
export function getIsBindBankcard(params) {
  return new Promise((resolve, reject) => {
    $http({
      sid: "5024",
      iResType: 1,
      datas: {
        dcaWsUserId: params.dcaWsUserId
      },
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

export function hybWalletActivities(condition) { // 25015-好运宝钱包付款活动
  return new Promise((resolve, reject) => {
    $http({
      sid: "25015",
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

export function gethybRewards(condition) { // 25016 - 领取好运宝钱包奖励
  return new Promise((resolve, reject) => {
    $http({
      sid: "25016",
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

export function getMd5(condition) { // 1014 - 获取我的钱包md5
  return new Promise((resolve, reject) => {
    $http({
      sid: "1014",
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

export function getReceiveRecord(condition) { // 25023-好运宝活动领取奖励记录
  return new Promise((resolve, reject) => {
    $http({
      sid: "25023",
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

export function getBankList(condition) { // 【2034】新-查询网商支持银行卡接口
  return new Promise((resolve, reject) => {
    $http({
      sid: "5025",
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