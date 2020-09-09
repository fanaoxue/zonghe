import { HYB_RECIVE } from "./const";
export const getPayTypeAndHkbPayeeType = function({
  reciveType = "",
  recivePersonName = "",
  driverName = "",
  advancePayState = "0",
  zyCapitalCfg = "9"
}) {
  let payType = "";
  let hkbPayeeType = "";
  if (advancePayState === "0") {
    // 不是垫付单
    if (zyCapitalCfg === "8") {
      // 开通回款宝配置
      if (recivePersonName == driverName) {
        // 收款人姓名和司机姓名相同
        payType = "1";
      } else {
        payType = "0";
      }
      if (reciveType == HYB_RECIVE) {
        //  好运宝收款
        payType = "1";
        hkbPayeeType = "1";
      } else if (reciveType == "") {
        payType = "";
        hkbPayeeType = "";
      } else {
        hkbPayeeType = "0";
      }
    } else {
      // 未开通回款宝配置
      if (recivePersonName == driverName) {
        // 收款人姓名和司机姓名相同
        payType = "1";
      } else {
        payType = "0";
      }
      hkbPayeeType = "0";
    }
  } else if (advancePayState === "1") {
    // 是垫付单
    if (recivePersonName == driverName) {
      // 收款人姓名和司机姓名相同
      payType = "1";
    } else {
      payType = "0";
    }
    hkbPayeeType = "0";
  }
  return { payType, hkbPayeeType };
};
