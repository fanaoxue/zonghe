<template>
  <div class="bulk-waybill-detail" v-show="showPage == true">
    <c-header>
      <x-header :left-options="{ backText: '' }">运单详情</x-header>
    </c-header>
    <div class="header-box">
      <div class="header">
        <div class="header-left">
          <div>
            <img src="../../assets/imgs/wbs/zhuang_icon@2x.png" alt width="20px" />
            <div class="title">
              <span class="text-over">{{ data.loadingAddressName }}</span>
            </div>
          </div>
          <div style="width: 20px;">
            <div class="line">
              <!-- <img src="../../assets/imgs/wbs/xuxian_icon@2x.png" alt height="20px" class="line"> -->
            </div>
          </div>
          <div>
            <img src="../../assets/imgs/wbs/xie_icon@2x.png" alt width="20px" />
            <div class="title">
              <span class="text-over">{{ data.unloadingAddressName }}</span>
            </div>
          </div>
          <div class="last">
            <img src="../../assets/imgs/wbs/huowu_icon@2x.png" alt width="20px" />
            <div class="title">
              <span class="text-over">{{ card }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间线 -->
    <div>
      <group label-width="6.0em" label-align="right">
        <div class="weui-cell vux-1px-b">
          <div class="vux-cell-bd">
            <p>
              <label class="vux-label group-title">承运信息</label>
            </p>
          </div>
        </div>
        <cell title="车牌号码：" value-align="left">
          <span>{{ data.cartBadgeNo }}</span>
        </cell>
        <cell title="司机姓名：" value-align="left">
          <span>{{ data.driverName }}</span>
        </cell>
        <cell title="司机手机：" value-align="left">
          <span style="color:#FFBA00;margin-right:5px;">{{ data.mobileNo }}</span>
          <img
            src="../../assets/imgs/wbs/dianhua_icon@2x.png"
            alt
            width="20"
            style="position:absolute;"
            @click="dialPhone(data.driverName, data.mobileNo)"
          />
        </cell>
      </group>
      <div class="container">
        <group label-width="7.0em" label-align="right">
          <div class="weui-cell vux-1px-b">
            <div class="vux-cell-bd">
              <p>
                <label class="vux-label group-title">结算信息</label>
              </p>
            </div>
          </div>
          <!-- 部分支付 -->
          <cell title="已付金额：" value-align="left" v-show="data.paidAllFreight && payState === '5'">
            <span class="highLight">{{ data.paidAllFreight | isEmpty }}元</span>
          </cell>
          <cell title="应付金额：" value-align="left" v-show="data.payable && payState === '5'">
            <span class="highLight">{{ data.payable | isEmpty }}元</span>
          </cell>
          <cell title="未付金额：" value-align="left" v-show="data.notPayFee && payState === '5'">
            <span class="highLight">{{ data.notPayFee | isEmpty }}元</span>
          </cell>
          <!-- 预申请 -->
          <cell
            title="申请支付金额："
            value-align="left"
            v-show="data.applyPayFee && (payState === '3' || payState === '6' || payState === '7')"
          >
            <span class="highLight">{{ data.applyPayFee | isEmpty }}元</span>
          </cell>
          <!--  -->
          <cell title="装货数量：" value-align="left">
            <span>{{ data.loadingTonnage | isEmpty }}</span>
          </cell>
          <cell title="卸货数量：" value-align="left">
            <span>{{ data.unloadingTonnage | isEmpty }}</span>
          </cell>
          <cell v-if="goodsAmountType==='0'" title="货损吨位：" value-align="left">
            <span>{{ huosundunwei }}吨</span>
            <span v-show="Number(parseFloat(data.allowLossWeight)) > 0">({{data.allowLossWeight}})</span>
          </cell>
          <cell title="货损单价：" value-align="left" v-show="Number(data.lossUnitPrice) > 0">
            <span>{{data.lossUnitPrice}}元</span>
          </cell>
          <cell
            title="货损金额："
            value-align="left"
            v-show="Number(huosundunwei) > Number(parseFloat(data.allowLossWeight))"
          >
            <span>{{lossMoney}}元</span>
          </cell>
          <cell
            title="应收货主运费："
            value-align="left"
            v-show="this.classify != 0 && data.carrierAllFreight"
          >
            <span>{{ data.carrierAllFreight }}元</span>
          </cell>
          <cell title="运费金额：" value-align="left">
            <span>{{ data.userFreight | isEmpty }}元</span>
            <span v-show="data.roundDownState === '1'">
              <span v-if="data.roundDownType === '0'">(小数抹零)</span>
              <span v-else>(个位数抹零)</span>
            </span>
          </cell>
          <cell title="预付现金：" value-align="left" v-show="data.prepayments">
            <span>{{ data.prepayments }}元</span>
          </cell>
          <cell title="预付油卡：" value-align="left" v-show="Number(data.prepaymentsOilCard) > 0">
            <span>{{ data.prepaymentsOilCard }}元</span>
          </cell>
          <cell title="油卡卡号：" value-align="left" v-show="Number(data.prepaymentsOilCard) > 0">
            <span v-if="data.oilCardNo">{{ data.oilCardNo }}</span>
            <span v-else>未选择</span>
          </cell>
          <cell title="线下油款：" value-align="left" v-show="Number(data.prepaymentsBuyOil) > 0">
            <span>{{ data.prepaymentsBuyOil }}元</span>
          </cell>
          <cell title="线下气款：" value-align="left" v-show="Number(data.prepaymentsBuyGas) > 0">
            <span>{{ data.prepaymentsBuyGas }}元</span>
          </cell>
          <cell title="运费增补：" value-align="left" v-show="Number(data.freightIncr) > 0">
            <span>{{ data.freightIncr }}元</span>
          </cell>
          <cell title="运费扣减：" value-align="left" v-show="Number(data.lossFee) > 0">
            <span>{{ data.lossFee }}元</span>
          </cell>

        </group>
        <group label-width="7.0em" label-align="right" :style="order">
          <div class="weui-cell vux-1px-b">
            <div class="vux-cell-bd flex-p-box">
              <p class="flex-p">
                <label class="vux-label group-title">运单信息</label>
                <label
                  @click="seeAareement"
                  v-show="payState === '2'"
                  class="vux-label group-title"
                  style="text-align: right;color:#15499A;text-decoration:underline;"
                >电子协议》</label>
              </p>
            </div>
          </div>
          <cell title="发货单位：" value-align="left" v-show="this.classify != 0 && data.orgName">
            <span>{{ data.orgName }}</span>
          </cell>
          <cell title="发车时间：" value-align="left" v-show="data.startTime">
            <span>{{ data.startTime }}</span>
          </cell>
          <cell title="运单号：" value-align="left" v-show="data.taxWaybillNo">
            <span>{{ data.taxWaybillNo }}</span>
          </cell>
          <cell title="装货地城市：" value-align="left" v-show="data.loadingCityName">
            <span>{{ data.loadingCityName }}</span>
          </cell>
          <cell title="卸货地城市：" value-align="left" v-show="data.unloadingCityName">
            <span>{{ data.unloadingCityName }}</span>
          </cell>
          <cell title="业务项目：" value-align="left" v-show="data.wbItem">
            <span>{{ data.wbItem }}</span>
          </cell>
          <cell title="发货人：" value-align="left" v-show="data.consignor">
            <span>{{ data.consignor }}</span>
          </cell>
          <cell title="受票方：" value-align="left" v-show="data.drawee">
            <span>{{ data.drawee }}</span>
          </cell>
          <cell title="趟次：" value-align="left" v-show="data.transTrip && this.classify != '0'">
            <span>{{ data.transTrip }}</span>
          </cell>
          <cell
            title="承运趟次："
            value-align="left"
            v-show="this.classify === '0' && Number(data.transTrip) > 1"
          >
            <span>{{ data.transTrip }}趟</span>
          </cell>
        </group>
      </div>
      <group
        label-width="7.0em"
        label-align="right"
        v-show="this.classify != 0 && ((data.payType && data.payType != 0) || data.payName)"
      >
        <div class="weui-cell vux-1px-b">
          <div class="vux-cell-bd">
            <p>
              <label class="vux-label group-title">收款人信息</label>
            </p>
          </div>
        </div>
        <!-- <cell title="收款人类型：" value-align="left" v-show="data.payType&&data.payType!=0">
          <span>{{payType}}</span>
        </cell>-->
        <cell title="收款人类型：" value-align="left" v-show="data.payType">
          <span v-if="data.payType == '1'">本人收款</span>
          <span v-else-if="data.payType == '0' || data.payType == '2' || data.payType == '3'">非本人收款</span>
          <span v-else>未选择</span>
        </cell>
        <cell title="收款人姓名：" value-align="left" v-show="data.payName">
          <span>{{ data.payName }}</span>
        </cell>
      </group>
      <!-- 按钮区域 -->
      <div id="footer"></div>
      <div id="button">
        <flexbox>
          <flexbox-item
            v-if="payState == 1 || payState == 2 || payState == 3 || payState == 5 || payState == 6 || payState == 7"
          >
            <x-button type="warn" @click.native="paymentDetail">支付明细</x-button>
          </flexbox-item>
          <flexbox-item v-if="invoiceState === '0' && payState == 0 && deleteWaybillCfg!='9'">
            <x-button type="default" @click.native="deleteWaybill">删除</x-button>
          </flexbox-item>
          <flexbox-item v-if="invoiceState === '0' && updateWaybillCfg!='9'">
            <x-button
              type="primary"
              @click.native="reWriteWaybill"
              :class="this.isModifyWaybill == '1' ? 'grey' : 'normal'"
            >修改</x-button>
          </flexbox-item>
        </flexbox>
      </div>
      <!-- :close-on-clicking-mask='false' -->
      <actionsheet
        v-model="showActionsheet"
        :menus="menusActionsheet"
        @on-click-menu="menuCheck"
        @on-after-hide="menuCancel"
        show-cancel
      ></actionsheet>
    </div>
  </div>
</template>

<script>
import {
  bigWayBillDetail,
  deleteWaybill,
  isRecordShow,
  getAgreementUrl,
  getCompanyConfig
} from "../../api/api.js";
import {
  AppUpdateWaybillData,
  AppGotoTell,
  systemType
} from "../../utils/app.js";
import { getCookie } from "../../utils/getCookie.js";
export default {
  name: "bulkWaybillDetail",
  data() {
    return {
      updateWaybillCfg: "",
      deleteWaybillCfg: "",
      xid: this.$route.query.xid,
      showPage: false, //默认页面不展示
      taxWaybillId: this.$route.query.taxWaybillId,
      classify: getCookie("classify") ? getCookie("classify") : "0", //类别分类 0：大宗自有运单(不扫码建单) 1：大宗外协运单
      payState: "", //3 预申请中,未确定支付类型 5 已部分支付
      invoiceState: "", //快路宝状态1:运输中  2:已完成
      data: {
        loadingTonnage: "",
        unloadingTonnage: "",
        allowLossWeight: ""
      }, //返回的卡片结果集
      order: "order:0", //排序
      showActionsheet: false,
      menusActionsheet: [],
      seeAareementDisabled: false,
      isModifyWaybill: "", //0：可修改 1：不可修改
      goodsAmountType: ""
    };
  },
  computed: {
    card() {
      let arr = [];
      this.data.goodsName && arr.push(this.data.goodsName);
      this.data.unitPrice && arr.push(this.data.unitPrice);
      return arr.toString();
    },
    huosundunwei() {
      let loadingTonnage = this.data.loadingTonnage.substring(
        0,
        this.data.loadingTonnage.length - 1
      );
      let unloadingTonnage = this.data.unloadingTonnage.substring(
        0,
        this.data.unloadingTonnage.length - 1
      );
      let temp = Number(loadingTonnage) - Number(unloadingTonnage);
      if (isNaN(temp) || temp < 0) {
        return "0.0000";
      }
      return temp.toFixed(4);
    },
    lossMoney() {
      return parseFloat(
        (Number(this.huosundunwei) -
          Number(parseFloat(this.data.allowLossWeight))) *
          this.data.lossUnitPrice
      ).toFixed(2);
    }
  },
  created() {
    console.log(this.classify);
  },
  mounted() {
    this._getCompanyConfig()
      .then(res => {
        let json = {
          taxWaybillId: this.taxWaybillId
        };
        bigWayBillDetail(json).then(res => {
          if (res.data.reCode == 0) {
            this.data = res.data.result;
            this.payState = res.data.result.payState;
            this.invoiceState = res.data.result.invoiceState;
            this.isModifyWaybill = res.data.result.isModifyWaybill;
            if (
              this.payState === "3" ||
              this.payState === "6" ||
              this.payState === "7" ||
              this.payState === "5"
            ) {
              this.order = "order:1";
            }
            this.goodsAmountType = res.data.result.goodsAmountType;
            this.showPage = true;
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
      })
      .catch(error => {});
  },
  methods: {
    _getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              this.updateWaybillCfg = res.data.result.updateWaybillCfg; // 修改运单配置 8：开通9：关闭
              this.deleteWaybillCfg = res.data.result.deleteWaybillCfg; // 删除运单配置 8：开通9：关闭
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch(error => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(error.message, "middle");
            reject();
          });
      });
    },
    _openNewWindow(pdfUrl) {
      let baseUrl = "http://pdf.log56.com/generic/web/viewer.html?file=";
      let url = baseUrl + pdfUrl;
      let json = {
        url: url
      };
      if (systemType() == 2) {
        window.location.href = url;
      } else {
        window.open(url);
      }
    },
    menuCancel() {
      this.menusActionsheet = [];
    },
    menuCheck(key, item) {
      if (key === "cancel") {
        return;
      }
      this._openNewWindow(item.pdfUrl);
    },
    seeAareement() {
      if (this.seeAareementDisabled) {
        return;
      }
      this.seeAareementDisabled = true;
      // 0 未上传
      // 1 已上传--pdf
      // 2 已上传--img
      if (this.data.xyState == 1) {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        let json = {
          taxWaybillId: this.taxWaybillId
        };
        getAgreementUrl(json).then(res => {
          if (res.data.reCode == 0) {
            let dataList = res.data.result.contractList;
            if (dataList.length > 1) {
              let _this = this;
              Object.keys(dataList).forEach(function(key) {
                _this.menusActionsheet.push({
                  label: dataList[key].contractTitle,
                  pdfUrl: dataList[key].contractUrl
                });
              });
              this.showActionsheet = true;
              this.seeAareementDisabled = false;
              this.$store.commit("updateLoadingStatus", { isLoading: false });
            } else {
              this.seeAareementDisabled = false;
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this._openNewWindow(dataList[0].contractUrl);
            }
          } else {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        });
      } else if (this.data.xyState == 2) {
        this.seeAareementDisabled = false;
        this.$router.push({
          path: "/uploadAgreement",
          query: {
            taxWaybillId: this.taxWaybillId,
            xid: this.xid,
            pageType: 2,
            isH5: true
          }
        });
      } else {
        this.seeAareementDisabled = false;
        this.$router.push({
          path: "/uploadAgreement",
          query: {
            taxWaybillId: this.taxWaybillId,
            xid: this.xid,
            pageType: 1,
            isH5: true
          }
        });
      }
    },
    //支付明细
    paymentDetail() {
      this.$router.push({
        path: "/wayBillPayDetail",
        query: { taxWaybillId: this.taxWaybillId }
      });
    },
    //删除按钮
    deleteWaybill() {
      this.$vux1.confirm.show({
        title: "提示",
        content: "是否删除此笔运单?",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: () => {
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          let json = {
            taxWaybillId: this.taxWaybillId
          };
          deleteWaybill(json)
            .then(res => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              if (res.data.reCode == 0) {
                //删除成功
                this.$vux.toast.text("删除运单成功！", "middle");
                setTimeout(() => {
                  let json = {
                    taxWaybillId: this.taxWaybillId, //运单号
                    type: "1" //1删除 2终结 3修改
                  };
                  //判断机型发送信息
                  this.postMessage(json);
                }, 1000);
              } else {
                this.$vux.toast.text("删除失败", "middle");
              }
            })
            .catch(err => {
              this.$vux.toast.text(err, "middle");
            });
        }
      });
    },
    //修改按钮
    reWriteWaybill() {
      if (this.isModifyWaybill == "1") {
        this.$vux.toast.text("企业开通司机金融，运单已确认不可修改!", "middle");
        return;
      }
      this.$router.push({
        path: "/bigCompareModifyWaybill",
        query: {
          taxWaybillId: this.taxWaybillId,
          type: "0",
          classify: this.classify //类别分类 0：大宗自有运单(不扫码建单) 1：大宗外协运单
        } //type:0从详情进入修改，1：列表进入修改
      });
      //this.$vux.toast.text("暂未开发,请稍后~", "middle");
    },
    //判断机型,向客户端发送信息
    postMessage: function(item) {
      AppUpdateWaybillData(item);
    },
    //拨打电话的弹框
    dialPhone(driverName, mobileNo) {
      try {
        MtaH5.clickStat("waybillinfo_phone");
      } catch (error) {
        JSON.stringify(error);
      }
      this.$vux1.confirm.show({
        title: "拨打电话",
        content:
          "<p style='text-align:left'>确认拨打：</p><p style='color:#FFBA00;text-align:left'>" +
          driverName +
          "</p><p style='color:#FFBA00;text-align:left'>" +
          mobileNo +
          "</p>",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: () => {
          //调用客户端的拨打电话功能
          try {
            MtaH5.clickStat("waybillinfo_dialsure");
          } catch (error) {
            JSON.stringify(error);
          }
          AppGotoTell(mobileNo);
        }
      });
    }
  },
  filters: {
    isEmpty: function(value) {
      if (!value) return "0.00";
      return value;
    }
  }
};
</script>

<style lang="less">
.bulk-waybill-detail {
  width: 100%;
  text-align: left;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .header-box {
    padding: 15px;
    background: #fff;
    .header {
      max-height: 150px;
      min-height: 120px;
      height: auto;
      font-size: 16px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: #202020;
      background-image: url(../../assets/imgs/wbs/bg_img@2x.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      display: flex;
      justify-content: flex-start;
      .header-left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 10px;
        .line {
          border-left: 1px dashed #000;
          height: 20px;
          align-self: center;
        }
        & > div {
          display: flex;
          justify-content: center;
          align-items: center;
          .title {
            white-space: nowrap;
            line-height: 18px;
            font-size: 16px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: #202020;
            overflow: hidden;
            .text-over {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              white-space: normal;
              width: 70vw;
              margin-left: 10px;
            }
          }
        }
        .last {
          padding-top: 10px;
          flex: auto;
          // align-items: flex-end;
          align-items: center;
        }
      }
    }
  }
  .group-title {
    font-size: 17px;
    text-align: right;
    color: #121212;
    font-weight: bold;
    font-family: PingFang-SC-Bold;
    padding: 5px 0;
  }
  .flex-p-box {
    width: 100%;
    .flex-p {
      display: flex;
      justify-content: space-between;
    }
  }
  .container {
    display: flex;
    flex-direction: column;
  }
  .img4 {
    width: 24px;
    height: 24px;
  }
  .img5 {
    width: 25px;
    height: 20px;
  }
  .img6 {
    width: 26px;
    height: 26px;
  }
  .weui-cell:before {
    // left: 0px;
    border: none;
  }
  .weui-cell {
    // padding: 8px 10px !important;
    .weui-cell__ft {
      color: #202020;
      word-break: break-all;
    }
    p {
      color: #797979;
    }
  }
  .weui-wepay-flow {
    padding: 20px 50px 70px;
  }
  .weui-wepay-flow__process {
    background: #28b072;
  }
  #button {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    .weui-btn_primary {
      background-color: #15499a !important;
    }
  }
  .weui-btn {
    border-radius: 0px;
  }
  .weui-btn:after {
    border-radius: 0px;
  }
  .vux-flexbox-item {
    margin-left: 0px !important;
  }
  #footer {
    height: 3.5rem;
  }
  .highLight {
    color: #ffba00;
  }
  .normal {
    background: #15499a;
  }
  .grey {
    background: #dcdcdc;
  }
}
</style>
