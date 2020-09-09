<template>
  <div class="hello">
    <x-header :left-options="{ backText: '' }"
      >我是快路宝H5项目所有路由容器跳转接口</x-header
    >
    <group>
      <cell
        v-for="(item, index, key) in routerList"
        :key="key"
        :title="item.name"
        value
        is-link
        @click.native="routerClick(item.path, item.query)"
      ></cell>
    </group>
    <div v-for="(child, key) in newRouterList" :key="key">
      <van-cell-group :title="child.title">
        <van-cell
          v-for="(item, index) in child.children"
          :key="index"
          :title="item.name"
          is-link
          @click.native="routerClick(item.path, item.query)"
        ></van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from "vant";
// import { Cell, Group } from "vux";

export default {
  name: "HelloWorld",
  data() {
    return {
      routerList: [
        {
          name: "新建运单第二步-车队选择",
          path: "/wbsCarTeam"
        },
        {
          name: "新建运单第二步-车队搜索",
          path: "/wbsTeamChoose"
        },
        {
          name: "新建运单第一步-运单信息",
          path: "/wayBillInfo",
          query: { mWaybillTemplateId: "888" }
        },
        {
          name: "新建运单第三步-结算信息",
          path: "/settlementInfo"
        },
        {
          name: "收款人信息",
          path: "/carMasterReceiveMsg"
        },
        {
          name: "收款信息",
          path: "/webReciveMsg",
          query: {
            taxWaybillId: "4013786",
            mobileNo: "13500000079",
            classify: "0"
          }
        },
        {
          name: "最后一步简单成功页面",
          path: "/wayBillSuccess"
        },
        {
          name: "证件识别首页",
          path: "/mauIndex"
        },
        {
          name: "运单详情",
          path: "/waybillDetail",
          query: { taxWaybillId: "4101674", xid: "8205897" }
        },
        {
          name: "支付明细",
          path: "/wayBillPayDetail",
          query: { taxWaybillId: "4014438" }
        },
        {
          name: "修改运单",
          path: "/modifyWaybill",
          query: { taxWaybillId: "4101674" }
        },
        {
          name: "出错了~~~",
          path: "/errorPage",
          query: { errorMsg: "" }
        },
        {
          name: "申请支付",
          path: "/wbsApplyPay",
          query: { taxWaybillId: "4101238", type: "1" }
        },
        {
          name: "常用收款人",
          path: "/webUsuallyPay",
          query: {
            taxWaybillId: "3996878",
            mobileNo: "15755185578",
            payeeName: "",
            autoShowWalletCfg: "8"
          }
        },
        {
          name: "修改记录",
          path: "/modifyRecord",
          query: { taxWaybillId: "3911188" }
        },
        {
          name: "城市选择",
          path: "/chooseCity"
        },
        {
          name: "油卡部分-选择油卡",
          path: "/chooseOilCard",
          query: {
            belongActSys: "3",
            cartBadgeNo: "赣RGGRVB",
            prepaymentsOilCard: "200"
          }
        },
        {
          name: "油卡部分-绑定油卡",
          path: "/addOilCard",
          query: {
            prepaymentsOilCard: "200",
            cartBadgeNo: "皖A666666",
            belongActSys: "3"
          }
        },
        {
          name: "在线客服",
          path: "/onlineService"
        },
        {
          name: "修改常用模板",
          path: "/commonTemplate",
          query: { mWaybillTemplateId: "052" }
        },
        {
          name: "推荐奖励",
          path: "/recommendedReward",
          query: {}
        },
        {
          name: "支付宝推荐奖励",
          path: "/alipayQRcode",
          query: {}
        },
        {
          name: "回款宝-收款人信息页",
          path: "/webReciveMsg2"
        },
        {
          name: "大综-运单详情",
          path: "/bulkWaybillDetail",
          query: { xid: "8208762", taxWaybillId: "4010119", classify: "0" }
        },
        {
          name: "大综-上传磅单",
          path: "/uploadWeightBill",
          query: {
            xid: "8208762",
            taxWaybillId: "3926983",
            transportLineId: "563",
            pageType: "1"
          }
        },
        {
          name: "大综-上传协议",
          path: "/uploadAgreement",
          query: { xid: "8208762", taxWaybillId: "3922006", pageType: 2 }
        },
        {
          name: "大综-运输信息页",
          path: "/transportInfo",
          query: {
            scanResult: encodeURIComponent(
              JSON.stringify({
                transportLineId: "839",
                fid: "0",
                pageType: 0
              })
            )
          }
        },
        {
          name: "大综-承运信息页",
          path: "/bigCompreCarTeam"
        },
        {
          name: "大综-结算信息页",
          path: "/bigCompreSettlementInfo"
        },
        {
          name: "大综-修改运单页",
          path: "/bigCompareModifyWaybill",
          query: { taxWaybillId: "4022894", classify: "0" }
        },
        {
          name: "大综-运单信息页",
          path: "/bigCompreWayBillInfo",
          query: {
            transportLineId: "1776",
            classify: "0"
          }
        },
        {
          name: "开通好运宝收款",
          path: "/rewardActivity"
        },
        {
          name: "运力主页",
          path: "/TCIndex"
        },
        {
          name: "运力详情",
          path: "/TCDetail",
          query: {
            managerId: "180401"
          }
        },
        {
          name: "发展运力",
          path: "/addTransport"
        },
        {
          name: "发展运力成功",
          path: "/addTransportSucc"
        },
        {
          name: "我的运力",
          path: "/myTransportcapacity"
        },
        {
          name: "路优运力说明",
          path: "/transCapacityInstruction"
        },
        {
          name: "油卡部分-油卡管理",
          path: "/oilCardManagement",
          query: {
            hiddenNativeNav: "true"
          }
        },
        {
          name: "证件识别",
          path: "/discernSuccess",
          query: {
            cartBadgeNo: "豫GB7373",
            driverName: "国文芳",
            mobileNo: "15755175406",
            msg: "证件识别提交成功，请完善其他证件信息！",
            state: "1"
          }
        },
        {
          name: "绑定银行卡",
          path: "/bindingBankCard"
        },
        {
          name: "好运宝钱包付款活动",
          path: "/hybWalletActivities"
        },
        {
          name: "好运宝钱包领取记录",
          path: "/receiveRecord"
        },
        {
          name: "ETC活动",
          path: "/ETCActivity"
        },
        {
          name: "ETC推荐奖励",
          path: "/ETCRecommendedReward"
        },
        {
          name: "ETC二维码",
          path: "/ETCQRcode"
        },
        {
          name: "到付金活动",
          path: "/settlementActivity"
        },
        {
          name: "ETC邀请记录",
          path: "/ETCInvitationRecord"
        },
        {
          name: "银行卡列表",
          path: "/bank_list"
        },
        {
          name: "运力组织-发货详情页",
          path: "/deliveryDetail",
          query: {
            goodsId: "57",
            isFrom: "0" // 入口来源
          }
        },
        {
          name: "运力组织-修改发货页",
          path: "/modifyDelivery",
          query: {
            goodsId: "57"
          }
        },
        {
          name: "运力组织-发货记录",
          path: "/deliveryGoodsRecord"
        },
        {
          name: "运力组织-发货",
          path: "/deliveryGoods"
        },
        {
          name: "路优运力主页",
          path: "/roadTransCapacity"
        },
        {
          name: "我的运力",
          path: "/mytransCap"
        },
        {
          name: "下发通知",
          path: "/releaseNotice"
        },
        {
          name: "发送协议",
          path: "/sendProtocol"
        },
        {
          name: "接收人",
          path: "/receivePerson"
        },
        {
          name: "查看协议",
          path: "/checkProtocol"
        },
        {
          name: "路优运力介绍页",
          path: "/introducePage"
        },
        {
          name: "货损保障页",
          path: "/goodsDamageDetail",
          query: {
            taxWaybillId: "4014440",
            xid: "8205897"
          }
        },
        {
          name: "确认货损",
          path: "/SubmitDamage",
          query: {
            taxWaybillId: "4014317"
          }
        },
        {
          name: "证件识别",
          path: "/Recognize"
        }
      ],
      newRouterList: [
        {
          title: "证件识别",
          children: [
            {
              name: "证件识别说明页",
              path: "/mauIndex",
              query: {
                from: "2",
                driverName: "张慧",
                mobileNo: "15755171326",
                cartBadgeNo: "皖A678DM",
                recState: "2"
              }
            },
            {
              name: "证件识别填写信息页",
              path: "/RecognizeInfo",
              query: {
                from: "1",
                driverName: "张慧",
                mobileNo: "15755171326",
                cartBadgeNo: "皖A678DM",
                recState: "2"
              }
            }
          ]
        },
        {
          title: "大综2.0",
          children: [
            {
              name: "线路列表",
              path: "/LineList",
              query: {}
            },
            {
              name: "货物信息",
              path: "/GoodsInfo",
              query: {}
            },
    		    {
              name: "线路信息",
              path: "/LineInfo",
              query: {}
            },
            {
              name: "其他信息",
              path: "/OtherInfo",
              query: {}
            },
            {
              name: "修改线路",
              path: "/ModifyLine",
              query: {
                transportLineId:'2128'
              }
            },
  			    {
              name: "查看线路",
              path: "/LineDetail",
              query: {}
            },         
          ]
        }
      ],
    };
  },
  components: {
    vanCell: Cell,
    vanCellGroup: CellGroup
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    routerClick(path, query) {
      this.$router.push({
        path: path,
        query: query
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
