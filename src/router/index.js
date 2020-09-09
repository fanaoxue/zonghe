import Vue from "vue";
import Router from "vue-router";
import recognize from './modules/recognize';
import bigCompre from './modules/bigCompre';

const HelloWorld = () => import("@/components/HelloWorld");
const errorPage = () => import("@/components/common/error.vue");
const wbsCarTeam = () => import("@/components/wbs/wbsCarTeam");
const wbsTeamChoose = () => import("@/components/wbs/wbsTeamChoose");
const wayBillInfo = () => import("@/components/wbs/wayBillInfo");
const settlementInfo = () => import("@/components/wbs/settlementInfo");
const carMasterReceiveMsg = () => import("@/components/wbs/carMasterReceiveMsg");
const webReciveMsg = () => import("@/components/wbs/webReciveMsg");
const wayBillSuccess = () => import("@/components/wbs/wayBillSuccess");
const waybillDetail = () => import("@/components/wbs/waybillDetail");
const wayBillPayDetail = () => import("@/components/wbs/wayBillPayDetail.vue");
const modifyWaybill = () => import("@/components/wbs/modifyWaybill.vue");
// const mauIndex = () => import("@/components/mau/mauIndex");
const wbsApplyPay = () => import("@/components/wbsPay/wbsApplyPay.vue");
const webUsuallyPay = () => import("@/components/wbsPay/webUsuallyPay.vue");
const modifyRecord = () => import("@/components/wbs/modifyRecord.vue");
const chooseCity = () => import("@/components/wbs/chooseCity.vue");

const chooseOilCard = () => import("@/components/oilCard/chooseOilCard.vue");
const addOilCard = () => import("@/components/oilCard/addOilCard.vue");
const oilCardManagement = () => import("@/components/oilCard/oilCardManagement.vue");
const claimRules = () => import("@/components/wbs/claimRules.vue");
const onlineService = () => import("@/components/common/onlineService.vue");
const commonTemplate = () => import("@/components/wbs/commonTemplate.vue");
const recommendedReward = () => import("@/components/wbs/recommendedReward.vue");
const alipayQRcode = () => import("@/components/wbs/alipayQRcode.vue");
const webReciveMsg2 = () => import("@/components/wbs/webReciveMsg2.vue");
const bulkWaybillDetail = () => import("@/components/bigCompre/bulkWaybillDetail.vue");
const uploadWeightBill = () => import("@/components/bigCompre/uploadWeightBill");
const uploadAgreement = () => import("@/components/bigCompre/uploadAgreement");
//大综模块
const transportInfo = () => import("@/components/bigCompre/transportInfo.vue");
const bigCompreCarTeam = () => import("@/components/bigCompre/bigCompreCarTeam.vue");
const bigCompareModifyWaybill = () => import("@/components/bigCompre/bigCompareModifyWaybill.vue");
const bigCompreWayBillInfo = () => import("@/components/bigCompre/bigCompreWayBillInfo.vue");
const bigCompreSettlementInfo = () => import("@/components/bigCompre/bigCompreSettlementInfo.vue");

const rewardActivity = () => import('@/components/wbs/rewardActivity.vue');
const webReciveMsg3 = () => import("@/components/wbs/webReciveMsg3.vue");
//运力模块
const TCIndex = () => import('@/components/transportCapactity/TCIndex.vue');
const TCDetail = () => import('@/components/transportCapactity/TCDetail.vue');
const addTransport = () => import('@/components/transportCapactity/addTransport.vue');
const addTransportSucc = () => import('@/components/transportCapactity/addTransportSucc.vue');
const myTransportCapactity = () => import('@/components/transportCapactity/myTransportCapactity.vue');
const transCapacityInstruction = () => import('@/components/transportCapactity/transCapacityInstruction.vue');

// 好运宝钱包
// const discernSuccess = () => import('@/components/hybWallet/discernSuccess.vue');
const bindingBankCard = () => import('@/components/hybWallet/bindingBankCard.vue');
const hybWalletActivities = () => import('@/components/hybWallet/hybWalletActivities.vue');
const commonWallet = () => import('@/components/hybWallet/commonWallet.vue');
const receiveRecord = () => import('@/components/hybWallet/receiveRecord.vue');
const bank_list = () => import('@/components/hybWallet/banklist.vue');

// ETCActivityconst
const ETCActivity = () => import('@/components/activity/etc/ETCActivity.vue');
const ETCRecommendedReward = () => import('@/components/activity/etc/ETCRecommendedReward.vue');
const ETCQRcode = () => import('@/components/activity/etc/ETCQRcode.vue');// 到付金活动
const ETCInvitationRecord = () => import('@/components/activity/etc/ETCInvitationRecord.vue');
const settlementActivity = () => import('@/components/activity/settlementActivity.vue');

// 运力组织
const deliveryDetail = () => import('@/components/transOrganize/deliveryDetail.vue');
const delivery_goods = () => import('@/components/transOrganize/deliveryGoods.vue');
const delivery_goods_first = () => import('@/components/transOrganize/deliveryGoodsFirst.vue');
const delivery_goods_second = () => import('@/components/transOrganize/deliveryGoodsSecond.vue');
const delivery_goods_success = () => import('@/components/transOrganize/deliveryGoodsSuccess.vue');
const modifyDelivery = () => import('@/components/transOrganize/modifyDelivery.vue');
const deliveryGoodsRecord = () => import('@/components/transOrganize/deliveryGoodsRecord.vue');

//路优运力
const roadTransCapacity = () => import('@/components/roadTransCapacity/roadTransCapacity.vue');
const mytransCap = () => import('@/components/roadTransCapacity/mytransCap.vue');
const releaseNotice = () => import('@/components/roadTransCapacity/releaseNotice.vue');
const sendProtocol = () => import('@/components/roadTransCapacity/sendProtocol.vue');
const checkProtocol = () => import('@/components/roadTransCapacity/checkProtocol.vue');
const receivePerson = () => import('@/components/roadTransCapacity/receivePerson.vue');
const introducePage = () => import('@/components/roadTransCapacity/introducePage.vue');

// 货损保障
const goodsDamageDetail = () => import('@/components/goodsDamage/goodsDamageDetail.vue');
const SubmitDamage = () => import('@/components/goodsDamage/SubmitDamage.vue');
const SubmitDamageSuccess = () => import('@/components/goodsDamage/SubmitDamageSuccess.vue');
const checkPdf = () => import('@/components/wbs/checkPdf.vue');

Vue.use(Router);
export default new Router({
  routes: [{
    path: "",
    name: "HelloWorld",
    component: HelloWorld
  },
  {
    path: "/errorPage",
    name: "errorPage",
    component: errorPage,
    meta: {
      title: "出错了~~~"
    }
  },
  {
    path: "/wbsCarTeam",
    name: "wbsCarTeam",
    component: wbsCarTeam,
    meta: {
      title: "填写承运信息",
      keepAlive: true
    }
  },
  {
    path: "/wbsTeamChoose",
    name: "wbsTeamChoose",
    component: wbsTeamChoose,
    meta: {
      title: "我的车队"
    }
  },
  {
    path: "/wayBillInfo",
    name: "wayBillInfo",
    component: wayBillInfo,
    meta: {
      title: "运单信息",
      keepAlive: true
    }
  },
  {
    path: "/settlementInfo",
    name: "settlementInfo",
    component: settlementInfo,
    meta: {
      title: "填写结算信息",
      keepAlive: true
    }
  },
  {
    path: "/carMasterReceiveMsg",
    name: "carMasterReceiveMsg",
    component: carMasterReceiveMsg,
    meta: {
      title: "收款人信息",
      keepAlive: true
    }
  },
  {
    path: "/webReciveMsg",
    name: "webReciveMsg",
    component: webReciveMsg,
    meta: {
      title: "填写收款信息"
    }
  },
  {
    path: "/wayBillSuccess",
    name: "wayBillSuccess",
    component: wayBillSuccess,
    meta: {
      title: "建单成功"
    }
  },
  // {
  //   path: "/mauIndex",
  //   name: "mauIndex",
  //   component: mauIndex,
  //   meta: {
  //     title: "证件识别"
  //   }
  // },
  {
    path: "/waybillDetail",
    name: "waybillDetail",
    component: waybillDetail,
    meta: {
      title: "运单详情"
    }
  },
  {
    path: "/wayBillPayDetail",
    name: "wayBillPayDetail",
    component: wayBillPayDetail,
    meta: {
      title: "支付明细"
    }
  },
  {
    path: "/modifyWaybill",
    name: "modifyWaybill",
    component: modifyWaybill,
    meta: {
      title: "修改运单",
      keepAlive: true
    }
  },
  {
    path: "/wbsApplyPay",
    name: "wbsApplyPay",
    component: wbsApplyPay,
    meta: {
      title: "申请支付"
    }
  },
  {
    path: "/webUsuallyPay",
    name: "webUsuallyPay",
    component: webUsuallyPay,
    meta: {
      title: "常用收款人"
    }
  },
  {
    path: "/modifyRecord",
    name: "modifyRecord",
    component: modifyRecord,
    meta: {
      title: "修改记录"
    }
  },
  {
    path: "/chooseCity",
    name: "chooseCity",
    component: chooseCity,
    meta: {
      title: "城市选择"
    }
  },
  // {
  //   path: '/lineDetail',
  //   name: 'lineDetail',
  //   component: lineDetail,
  //   meta: {
  //     title: '线路详情'
  //   }
  // }, {
  //   path: '/uploadPoundList',
  //   name: 'uploadPoundList',
  //   component: uploadPoundList,
  //   meta: {
  //     title: '上传磅单'
  //   }
  // }, {
  //   path: '/trailDetail',
  //   name: 'trailDetail',
  //   component: trailDetail,
  //   meta: {
  //     title: '轨迹详情'
  //   }
  // },
  {
    path: "/chooseOilCard",
    name: "chooseOilCard",
    component: chooseOilCard,
    meta: {
      title: "选择油卡"
    }
  },
  {
    path: "/addOilCard",
    name: "addOilCard",
    component: addOilCard,
    meta: {
      title: "绑定油卡"
    }
  },
  {
    path: "/oilCardManagement",
    name: "oilCardManagement",
    component: oilCardManagement,
    meta: {
      title: "油卡管理"
    }
  },
  {
    path: "/claimRules",
    name: "claimRules",
    component: claimRules,
    meta: {
      title: "理赔规则"
    }
  },
  {
    path: "/onlineService",
    name: "onlineService",
    component: onlineService,
    meta: {
      title: "在线客服"
    }
  },
  {
    path: "/commonTemplate",
    name: "commonTemplate",
    component: commonTemplate,
    meta: {
      title: "修改常用模板",
      keepAlive: true
    }
  },
  {
    path: "/recommendedReward",
    name: "recommendedReward",
    component: recommendedReward,
    meta: {
      title: "回款宝推荐奖励"
    }
  },
  {
    path: "/alipayQRcode",
    name: "alipayQRcode",
    component: alipayQRcode,
    meta: {
      title: "支付宝推荐码"
    }
  },
  {
    path: "/webReciveMsg2",
    name: "webReciveMsg2",
    component: webReciveMsg2,
    meta: {
      title: "收款人信息"
    }
  },
  {
    path: "/bulkWaybillDetail",
    name: "bulkWaybillDetail",
    component: bulkWaybillDetail,
    meta: {
      title: "运单详情"
    }
  },
  {
    path: "/uploadWeightBill",
    name: "uploadWeightBill",
    component: uploadWeightBill,
    meta: {
      title: "上传磅单",
      keepAlive: true
    }
  },
  {
    path: "/uploadAgreement",
    name: "uploadAgreement",
    component: uploadAgreement,
    meta: {
      title: "上传纸质协议"
    }
  },
  {
    path: "/transportInfo",
    name: "transportInfo",
    component: transportInfo,
    meta: {
      title: "运输信息",
      keepAlive: true
    }
  },
  {
    path: "/bigCompreCarTeam",
    name: "bigCompreCarTeam",
    component: bigCompreCarTeam,
    meta: {
      title: "承运信息",
      keepAlive: true
    }
  },
  {
    path: "/bigCompreSettlementInfo",
    name: "bigCompreSettlementInfo",
    component: bigCompreSettlementInfo,
    meta: {
      title: "结算信息",
      keepAlive: true
    }
  },
  {
    path: "/bigCompareModifyWaybill",
    name: "bigCompareModifyWaybill",
    component: bigCompareModifyWaybill,
    meta: {
      title: "修改运单",
      keepAlive: true
    }
  },
  {
    path: "/rewardActivity",
    name: "rewardActivity",
    component: rewardActivity,
    meta: {
      title: "开通好运宝收款"
    }
  },
  {
    path: "/webReciveMsg3",
    name: "webReciveMsg3",
    component: webReciveMsg3,
    meta: {
      title: "收款人信息"
    }
  },
  {
    path: "/TCIndex",
    name: "TCIndex",
    component: TCIndex,
    meta: {
      title: "发展运力"
    }
  },
  {
    path: "/TCDetail",
    name: "TCDetail",
    component: TCDetail,
    meta: {
      title: "运力详情",
      keepAlive: true
    }
  },
  {
    path: "/addTransport",
    name: "addTransport",
    component: addTransport,
    meta: {
      title: "发展运力"
    }
  },
  {
    path: "/addTransportSucc",
    name: "addTransportSucc",
    component: addTransportSucc,
    meta: {
      title: "发展运力成功"
    }
  },
  {
    path: "/bigCompreWayBillInfo",
    name: "bigCompreWayBillInfo",
    component: bigCompreWayBillInfo,
    meta: {
      title: "运单信息",
      keepAlive: true
    }
  },
  // {
  //   path: "/discernSuccess",
  //   name: "discernSuccess",
  //   component: discernSuccess,
  //   meta: {
  //     title: "证件识别"
  //   }
  // },
  {
    path: "/bindingBankCard",
    name: "bindingBankCard",
    component: bindingBankCard,
    meta: {
      title: "绑定银行卡",
      keepAlive: true
    }
  }, {
    path: "/hybWalletActivities",
    name: "hybWalletActivities",
    component: hybWalletActivities,
    meta: {
      title: "好运宝钱包付款活动"
    }
  }, {
    path: "/commonWallet",
    name: "commonWallet",
    component: commonWallet,
    meta: {
      title: "钱包"
    }
  },
  {
    path: "/receiveRecord",
    name: "receiveRecord",
    component: receiveRecord,
    meta: {
      title: "领取记录"
    }
  },
  {
    path: "/ETCActivity",
    name: "ETCActivity",
    component: ETCActivity,
    meta: {
      title: "ETC活动"
    }
  },
  {
    path: "/ETCRecommendedReward",
    name: "ETCRecommendedReward",
    component: ETCRecommendedReward,
    meta: {
      title: "ETC推荐奖励"
    }
  },
  {
    path: "/ETCQRcode",
    name: "ETCQRcode",
    component: ETCQRcode,
    meta: {
      title: "二维码"
    }
  },
  {
    path: "/settlementActivity",
    name: "settlementActivity",
    component: settlementActivity,
    meta: {
      title: "提前收款"
    }
  },
  {
    path: "/ETCInvitationRecord",
    name: "ETCInvitationRecord",
    component: ETCInvitationRecord,
    meta: {
      title: "ETC邀请记录"
    }
  },
  {
    path: "/bank_list",
    name: "bank_list",
    component: bank_list,
    meta: {
      title: "银行卡列表"
    }
  },
  {
    path: "/deliveryDetail",
    name: "deliveryDetail",
    component: deliveryDetail,
    meta: {
      title: "发货详情"
    }
  },
  {
    path: "/deliveryGoods",
    name: "delivery_goods",
    component: delivery_goods,
    meta: {
      title: "发货"
    }
  },
  {
    path: "/delivery_goods_first",
    name: "delivery_goods_first",
    component: delivery_goods_first,
    meta: {
      title: "发布货源",
      keepAlive: true
    }
  },
  {
    path: "/delivery_goods_second",
    name: "delivery_goods_second",
    component: delivery_goods_second,
    meta: {
      title: "发布货源",
      keepAlive: true
    }
  },
  {
    path: "/delivery_goods_success",
    name: "delivery_goods_success",
    component: delivery_goods_success,
    meta: {
      title: "发布货源"
    }
  },
  {
    path: "/modifyDelivery",
    name: "modifyDelivery",
    component: modifyDelivery,
    meta: {
      title: "修改发货",
      keepAlive: true
    }
  },
  {
    path: "/deliveryGoodsRecord",
    name: "deliveryGoodsRecord",
    component: deliveryGoodsRecord,
    meta: {
      title: "发货记录",
      keepAlive: true
    }
  },
  {
    path: "/myTransportcapacity",
    name: "myTransportCapactity",
    component: myTransportCapactity,
    meta: {
      title: "我的运力",
    }
  },
  {
    path: "/transCapacityInstruction",
    name: "transCapacityInstruction",
    component: transCapacityInstruction,
    meta: {
      title: "路优运力说明",
    }
  },
  {
    path: "/roadTransCapacity",
    name: "roadTransCapacity",
    component: roadTransCapacity,
    meta: {
      title: "路优运力主页",
    }
  },
  {
    path: "/mytransCap",
    name: "mytransCap",
    component: mytransCap,
    meta: {
      title: "我的运力",
      keepAlive: true
    }
  },
  {
    path: "/introducePage",
    name: "introducePage",
    component: introducePage,
    meta: {
      title: "路优运力介绍页",
    }
  },
  {
    path: "/releaseNotice",
    name: "releaseNotice",
    component: releaseNotice,
    meta: {
      title: "下发通知",
    }
  },
  {
    path: "/sendProtocol",
    name: "sendProtocol",
    component: sendProtocol,
    meta: {
      title: "发送协议",
    }
  },
  {
    path: "/checkProtocol",
    name: "checkProtocol",
    component: checkProtocol,
    meta: {
      title: "查看协议",
    }
  },
  {
    path: "/receivePerson",
    name: "receivePerson",
    component: receivePerson,
    meta: {
      title: "接收人",
    }
  }, 
  {
    path: "/ReciveMessage",
    name: "ReciveMessage",
    component:() => import('@/components/wbsPay/ReciveMessage.vue'),
    meta: {
      title: "填写收款信息",
      keepAlive: true
    }
  },
  {
    path: "/goodsDamageDetail",
    name: "goodsDamageDetail",
    component: goodsDamageDetail,
    meta: {
      title: "货损保障",
    }
  },
  {
    path: "/checkPdf",
    name: "checkPdf",
    component: checkPdf,
    meta: {
      title: "查看合同",
    }
  },
  {
    path: "/SubmitDamage",
    name: "SubmitDamage",
    component: SubmitDamage,
    meta: {
      title: "确认货损",
    }
  },
  {
    path: "/SubmitDamageSuccess",
    name: "SubmitDamageSuccess",
    component: SubmitDamageSuccess,
    meta: {
      title: "确认完成",
    }
  },
  ...recognize,
  ...bigCompre,
  ]
});
