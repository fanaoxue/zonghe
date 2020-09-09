<template>
  <div class="waybill-detail">
    <c-header>
      <x-header :left-options="{ backText: '' }">运单详情</x-header>
    </c-header>
    <!-- 时间线 -->
    <span v-show="showPage == true">
      <group label-width="7.0em" label-align="right">
        <div class="container">
          <div style="display:flex;display: -webkit-flex;">
            <div style="flex:1;display:flex;display: -webkit-flex;-webkit-flex:1;">
              <div style="flex:1;-webkit-flex:1;"></div>
              <div class="dot1">
                <img
                  src="../../assets/imgs/wbs/jiandan_icon@2x.png"
                  alt
                  width="24"
                  height="24"
                  class="img4"
                />
                <h3 class="time">建单时间</h3>
                <p class="time_val">{{ result.createdTime }}</p>
              </div>
              <div class="item1"></div>
            </div>
            <div style="flex:1;display:flex;display: -webkit-flex;-webkit-flex:1;">
              <div :class="[result.receiveTime ? 'item1' : 'item2']"></div>
              <div :class="[result.receiveTime ? 'dot1' : 'dot2']">
                <img
                  src="../../assets/imgs/wbs/fache_icon@2x.png"
                  alt
                  width="25"
                  height="20"
                  class="img5"
                />
                <h3 class="time" :class="[result.receiveTime ? '' : 'time_val_dash']">接单时间</h3>
                <p
                  class="time_val"
                  :class="[result.receiveTime ? '' : 'time_val_dash']"
                >{{ result.receiveTime }}</p>
              </div>
              <div :class="[result.receiveTime ? 'item1' : 'item2']"></div>
            </div>
            <div style="flex:1;display:flex;display: -webkit-flex;-webkit-flex:1;">
              <div :class="[payState == 2 ? 'item1' : 'item2']"></div>
              <div :class="[payState == 2 ? 'dot1' : 'dot2']">
                <img
                  src="../../assets/imgs/wbs/daoda_icon@2x.png"
                  alt
                  width="26"
                  height="26"
                  class="img6"
                />
                <h3 class="time" :class="[payState == 2 ? '' : 'time_val_dash']">到达时间</h3>
                <p
                  class="time_val"
                  :class="[payState == 2 ? '' : 'time_val_dash']"
                >{{ result.endTime }}</p>
              </div>
              <div style="flex:1;-webkit-flex:1;"></div>
            </div>
          </div>
        </div>
        <div class="baozhang_module" @click="gotoBaoZhangDetail" v-show="result.lossEnsureState">
          <div class="baozhang_left">
            <img
              src="../../assets/imgs/goodsDamage/huosuntub_icon@2x.png"
              alt
              class="huosuntub_icon"
            />
            货损保障
          </div>
          <div
            class="baozhang_right"
            :class="{'state1':result.lossEnsureState == 1,'state2':result.lossEnsureState == 2,'state3':result.lossEnsureState == 3,'state4':result.lossEnsureState == 4}"
          >
            <span v-if="result.lossEnsureState == 1">保障中>></span>
            <span v-else-if="result.lossEnsureState == 2">已受理>></span>
            <span v-else-if="result.lossEnsureState == 3">已完成>></span>
            <span v-else>已结束>></span>
          </div>
        </div>
      </group>
      <div class="card_group">
        <div class="list-card">
          <van-cell title="运单信息" class="header_cell_title"></van-cell>
          <div class="card-left-cell" v-show="result.taxWaybillNo != ''">
            <div class="left-cell-title">运单号：</div>
            <div class="left-cell-value">{{ result.taxWaybillNo }}</div>
          </div>
          <div class="card-left-cell" v-show="result.route != ''">
            <div class="left-cell-title">发车线路：</div>
            <div class="left-cell-value">{{ result.route }}</div>
          </div>
          <div class="card-left-cell" v-show="result.goodsName != ''">
            <div class="left-cell-title">货物名称：</div>
            <div class="left-cell-value">{{ result.goodsName }}</div>
          </div>
          <div class="card-left-cell" v-show="result.goodsAmount != ''">
            <div class="left-cell-title">货物数量：</div>
            <div class="left-cell-value">{{ result.goodsAmount }}</div>
          </div>
          <div class="card-left-cell" v-show="result.unitPrice != ''">
            <div class="left-cell-title">运输单价：</div>
            <div class="left-cell-value">{{ result.unitPrice }}</div>
          </div>
          <div class="card-left-cell" v-show="result.transTrip != ''">
            <div class="left-cell-title">运输趟次：</div>
            <div class="left-cell-value">{{ result.transTrip }}</div>
          </div>
          <div class="card-left-cell" v-show="result.wbItem != ''">
            <div class="left-cell-title">业务项目：</div>
            <div class="left-cell-value">{{ result.wbItem }}</div>
          </div>
          <div class="card-left-cell" v-show="result.startTime2 != ''">
            <div class="left-cell-title">起运时间：</div>
            <div class="left-cell-value">{{ result.startTime2 }}</div>
          </div>
          <div class="card-left-cell" v-show="result.drawee != ''">
            <div class="left-cell-title">受票方：</div>
            <div class="left-cell-value">{{ result.drawee }}</div>
          </div>
          <div class="card-left-cell" v-show="result.relatedShipper != ''">
            <div class="left-cell-title">货主：</div>
            <div class="left-cell-value">{{ result.relatedShipper }}</div>
          </div>
          <div class="card-left-cell" v-show="result.carrierProject != ''">
            <div class="left-cell-title">承运项目：</div>
            <div class="left-cell-value">{{ result.carrierProject }}</div>
          </div>
          <div class="card-left-cell" v-show="result.tranRequire != ''">
            <div class="left-cell-title">运输要求：</div>
            <div class="left-cell-value">{{ result.tranRequire }}</div>
          </div>
        </div>
      </div>
      <div class="card_group">
        <div class="list-card">
          <van-cell title="承运信息" class="header_cell_title">
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <template #right-icon>
              <span
                v-show="result.contractState === '1'"
                style="color:#15499a;font-weight:normal;font-size:15px;"
                @click="_toSeeAgreement"
              >查看协议>></span>
            </template>
          </van-cell>
          <div class="card-left-cell" v-show="result.driverName != ''">
            <div class="left-cell-title">姓名：</div>
            <div class="left-cell-value">{{ result.driverName }}</div>
          </div>
          <div class="card-left-cell" v-show="result.mobileNo != ''">
            <div class="left-cell-title">手机号：</div>
            <div class="left-cell-value highLight">
              {{ result.mobileNo }}
              <img
                src="../../assets/imgs/wbs/dianhua_icon@2x.png"
                alt
                width="18px"
                style="margin-left:2px;margin-bottom: -2px;"
                @click="dialPhone(result.driverName, result.mobileNo)"
              />
            </div>
          </div>
          <div class="card-left-cell" v-show="result.cartBadgeNo != ''">
            <div class="left-cell-title">车牌号码：</div>
            <div class="left-cell-value">{{ result.cartBadgeNo }}</div>
          </div>
          <div class="card-left-cell" v-show="result.cartType != ''">
            <div class="left-cell-title">车型：</div>
            <div class="left-cell-value">{{ result.cartType }}</div>
          </div>
          <div class="card-left-cell" v-show="result.cartLenAndTon != ''">
            <div class="left-cell-title">车长吨位：</div>
            <div class="left-cell-value">{{ result.cartLenAndTon }}</div>
          </div>
          <div class="card-left-cell" v-show="result.note != ''">
            <div class="left-cell-title">备注：</div>
            <div class="left-cell-value">{{ result.note }}</div>
          </div>
        </div>
      </div>
      <div class="card_group">
        <div class="list-card">
          <van-cell title="结算信息" class="header_cell_title"></van-cell>
          <div class="card-left-cell" v-if="collectTwoCfg === '8' && result.advancePayState">
            <div class="left-cell-title">付款方式：</div>
            <div class="left-cell-value">{{ result.advancePayState === '1' ? '供应链金融' : '企业自付' }}</div>
          </div>
          <div class="card-left-cell" v-show="result.paidAllFreight != ''">
            <div class="left-cell-title">已付金额：</div>
            <div class="left-cell-value">{{ result.paidAllFreight }}元</div>
          </div>
          <div class="card-left-cell" v-show="result.payable != ''">
            <div class="left-cell-title">应付金额：</div>
            <div class="left-cell-value">{{ result.payable }}元</div>
          </div>
          <div class="card-left-cell" v-show="result.notPayFee != ''">
            <div class="left-cell-title">未付金额：</div>
            <div class="left-cell-value">{{ result.notPayFee }}元</div>
          </div>
          <div class="card-left-cell" v-show="result.applyPayFee != ''">
            <div class="left-cell-title">申请支付金额：</div>
            <div class="left-cell-value">{{ result.applyPayFee }}元</div>
          </div>
          <div class="card-left-cell" v-show="result.userFreight != ''">
            <div class="left-cell-title">运费金额：</div>
            <div class="left-cell-value">{{ result.userFreight }}元</div>
          </div>
          <div class="card-left-cell" v-show="huosunState">
            <div class="left-cell-title">货损保障费：</div>
            <div class="left-cell-value">
              {{ result.insFee }}元
              <span class="highLight">(保障额度{{ result.lossEnsureLimit }}元)</span>
            </div>
          </div>
          <div class="card-left-cell" v-show="result.prepayments != ''">
            <div class="left-cell-title">预付现金：</div>
            <div class="left-cell-value highLight">{{ result.prepayments }}元</div>
          </div>
          <div class="card-left-cell" v-show="result.prepaymentsOilCard != ''">
            <div class="left-cell-title">预付油卡：</div>
            <div class="left-cell-value">{{ result.prepaymentsOilCard }}元</div>
          </div>
          <div
            class="card-left-cell"
            v-show="result.prepaymentsOilCard != '' && Number(result.prepaymentsOilCard) != '0'"
          >
            <div class="left-cell-title">油卡卡号：</div>
            <div class="left-cell-value">
              <span v-show="result.oilCardNo == ''">未选择</span>
              <span v-show="result.oilCardNo != ''">{{ result.oilCardNo }}</span>
            </div>
          </div>
          <div class="card-left-cell" v-show="result.lossFee != ''">
            <div class="left-cell-title">运费扣减：</div>
            <div class="left-cell-value">{{ result.lossFee }}元</div>
          </div>
          <div class="card-left-cell" v-show="result.freightIncr != ''">
            <div class="left-cell-title">运费增补：</div>
            <div class="left-cell-value">{{ result.freightIncr }}元</div>
          </div>
          <div class="card-left-cell" v-show="result.arrivePay != ''">
            <div class="left-cell-title">到付款：</div>
            <div class="left-cell-value">{{ result.arrivePay }}元</div>
          </div>
          <div class="card-left-cell" v-show="result.backFee != ''">
            <div class="left-cell-title">回单押金：</div>
            <div class="left-cell-value">{{ result.backFee }}元</div>
          </div>
          <div class="card-left-cell" v-show="result.prepaymentsBuyOil != ''">
            <div class="left-cell-title">线下油款：</div>
            <div class="left-cell-value">{{ result.prepaymentsBuyOil }}元</div>
          </div>
          <div class="card-left-cell" v-show="result.prepaymentsBuyEtc != ''">
            <div class="left-cell-title">线下路桥费：</div>
            <div class="left-cell-value">{{ result.prepaymentsBuyEtc }}元</div>
          </div>
          <div class="card-left-cell" v-show="result.prepaymentsBuyGas != ''">
            <div class="left-cell-title">线下气款：</div>
            <div class="left-cell-value">{{ result.prepaymentsBuyGas }}元</div>
          </div>
          <div
            class="card-left-cell"
            v-if="(result.priceInsuranceCfg == '8' && result.goodsCost != '') || (result.orgAttr == 2 && result.goodsCost != '')"
          >
            <div class="left-cell-title">货值：</div>
            <div class="left-cell-value">{{ result.goodsCost }}元</div>
          </div>
          <div
            class="card-left-cell"
            v-if="result.goodsInsuranceCfg == '8' && result.goodsCost != ''"
          >
            <div class="left-cell-title">购买保险：</div>
            <div class="left-cell-value">{{ result.goodsCost }}元</div>
          </div>
          <div
            class="card-left-cell"
            v-show="result.priceInsuranceCfg == '8' && result.goodsCost != '' && result.insFee != ''"
          >
            <div class="left-cell-title">保价费：</div>
            <div class="left-cell-value">{{ result.insFee }}元</div>
          </div>
          <div
            class="card-left-cell"
            v-show="!(result.depositCfg == '9' && Number(result.deposit) == '0')"
          >
            <div class="left-cell-title">定金：</div>
            <div class="left-cell-value">{{ result.deposit }}元</div>
          </div>
          <div
            class="card-left-cell"
            v-show="!(result.promotionFeeCfg == '9' && Number(result.promotionFee) == '0')"
          >
            <div class="left-cell-title">推广费：</div>
            <div class="left-cell-value">{{ result.promotionFee }}元</div>
          </div>
          <div
            class="card-left-cell"
            v-show="!(result.promotionFeeCfg == '9' && Number(result.promotionFee) == '0')"
          >
            <div class="left-cell-title">应收回款：</div>
            <div class="left-cell-value">{{ result.receivablePayback }}元</div>
          </div>
        </div>
      </div>
      <div class="card_group" v-show="result.payName">
        <div class="list-card">
          <van-cell title="收款人信息" class="header_cell_title"></van-cell>
          <div class="card-left-cell" v-show="zblState == '1'">
            <div class="left-cell-title">收款人类型：</div>
            <div class="left-cell-value">{{ result.payType == '1' ? '本人' : '非本人' }}</div>
          </div>
          <div class="card-left-cell">
            <div class="left-cell-title">收款方式：</div>
            <div class="left-cell-value">
              <span v-if="result.hkbPayeeType == '1'">好运宝收款</span>
              <span v-else-if="result.hkbPayeeType == '0'">银行卡收款</span>
              <span v-else>未选择</span>
            </div>
          </div>
          <div class="card-left-cell">
            <div class="left-cell-title">收款人姓名：</div>
            <div class="left-cell-value">
              <span v-if="result.payName">{{result.payName}}</span>
              <span v-else>未填写</span>
            </div>
          </div>
          <div class="card-left-cell" v-show="result.payIdCard != ''">
            <div class="left-cell-title">身份证号：</div>
            <div class="left-cell-value">{{ result.payIdCard }}</div>
          </div>
          <div class="card-left-cell" v-show="result.payBankNo != ''">
            <div class="left-cell-title">银行卡号：</div>
            <div class="left-cell-value">{{ result.payBankNo }}</div>
          </div>
          <div class="card-left-cell" v-show="result.payBankName != ''">
            <div class="left-cell-title">收款银行：</div>
            <div class="left-cell-value">{{ result.payBankName }}</div>
          </div>
          <div class="card-left-cell" v-show="result.payMobileNo != ''">
            <div class="left-cell-title">联系手机：</div>
            <div class="left-cell-value">{{ result.payMobileNo }}</div>
          </div>
          <div class="card-left-cell" v-show="result.payBankBranchName != ''">
            <div class="left-cell-title">开户行地址：</div>
            <div class="left-cell-value">{{ result.payBankBranchName }}</div>
          </div>
          <div
            class="card-left-cell"
            v-show="(result.zyCapitalCfg == '8' && result.hkbPayeeType == '1') || (result.zyCapitalCfg == '9' && zblState == '1')"
          >
            <div class="left-cell-title">支付宝账号：</div>
            <div class="left-cell-value">{{ result.aliPayNo }}</div>
          </div>
        </div>
      </div>

      <!-- 按钮区域 -->
      <div id="footer"></div>
      <!-- 可以拖拽的悬浮按钮 -->
      <div
        class="xuanfu"
        ref="div"
        v-show="show > '0' ? true : false"
        @click="gotoRecord"
        @mousedown="down"
        @mousemove="move"
        @mouseup="end"
        @touchstart="down"
        @touchmove.prevent="move"
        @touchend="end"
      >
        <img src="../../assets/imgs/wbs/xuanfu_icon@2x.png" alt width="25px" height="25px" />
        <p>修改记录</p>
      </div>
      <div id="button">
        <flexbox>
          <flexbox-item
            v-if="payState == 1 || payState == 2 || payState == 3 || payState == 5 || payState == 6 || payState == 7"
          >
            <x-button type="warn" @click.native="paymentDetail">支付明细</x-button>
          </flexbox-item>
          <flexbox-item v-if="invoiceState === '0' && payState == 0 && deleteWaybillCfg != '9'">
            <x-button type="default" @click.native="deleteWaybill">删除</x-button>
          </flexbox-item>
          <flexbox-item v-if="invoiceState === '0' && updateWaybillCfg != '9'">
            <x-button
              type="primary"
              @click.native="reWriteWaybill"
              :class="this.isModifyWaybill == '1' ? 'grey' : 'normal'"
            >修改</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </span>
  </div>
</template>

<script>
import { Cell, CellGroup } from "vant";
import {
  waybillDetail,
  deleteWaybill,
  zblState,
  isRecordShow,
  getCompanyConfig,
  toSeeAgreement,
} from "../../api/api.js";
import { AppUpdateWaybillData, AppGotoTell } from "../../utils/app.js";
export default {
  name: "waybillDetail",
  components: {
    vanCellGroup: CellGroup,
    vanCell: Cell,
  },
  data() {
    return {
      collectTwoCfg: "",
      updateWaybillCfg: "",
      deleteWaybillCfg: "",
      orgCfg713: "",
      orgCfg715: "",
      klbState: "", //开票状态
      payState: "", //支付状态
      invoiceState: "", //快路宝状态
      result: "", //返回的卡片结果集
      // time: "", //返回的时间进度条结果集
      taxWaybillId: this.$route.query.taxWaybillId,
      isModifyWaybill: "", //0：可修改 1：不可修改
      createdTime: "", //建单时间
      startTime: "", //发车时间
      endTime: "", //到达时间
      show: "0", // 1  存在   0 不存在
      flags: false,
      showPage: false, //默认页面不展示
      position: {
        x: 0,
        y: 0,
      },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
      moveDiv: "",
      zblState: "", //0：未授信（默认0）1：已授信
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "modifyWaybill") {
      next((vm) => {
        window.localStorage.clear();
      });
    }
    next();
  },
  computed: {
    // 判断货损保障费展示状态
    huosunState() {
      if (
        Number(this.result.lossEnsureLimit) > 0 &&
        (Number(this.result.driverInsFee) == 0 ||
          this.result.driverInsFee == "")
      ) {
        return true;
      }
      return false;
    },
  },
  created() {},
  mounted() {
    this._getCompanyConfig()
      .then((res) => {
        this.moveDiv = this.$refs.div;
        let json = {
          taxWaybillId: this.taxWaybillId,
        };
        waybillDetail(json)
          .then((res) => {
            //3053
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode == 0) {
              this.result = res.data.result;
              this.klbState = res.data.result.klbState;
              this.payState = res.data.result.payState;
              this.invoiceState = res.data.result.invoiceState;
              this.isModifyWaybill = res.data.result.isModifyWaybill;
              //查询是否存在修改记录
              isRecordShow(json).then((res) => {
                if (res.data.reCode === "0") {
                  // 1  存在   0 不存在
                  this.show = res.data.result.count;
                }
                zblState().then((response) => {
                  this.zblState = response.data.result.zblState;
                });
              });
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
            }
            this.showPage = true;
          })
          .catch((err) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
            this.showPage = true;
          });
      })
      .catch((error) => {});
  },
  methods: {
    _getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let result = res.data.result;
              this.updateWaybillCfg = result.updateWaybillCfg;
              this.deleteWaybillCfg = result.deleteWaybillCfg;
              this.collectTwoCfg = result.collectTwoCfg;
              this.orgCfg713 = result.orgCfg713;
              this.orgCfg715 = result.orgCfg715;
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch((error) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(error.message, "middle");
            reject();
          });
      });
    },
    //支付明细
    paymentDetail() {
      this.$router.push({
        path: "/wayBillPayDetail",
        query: { taxWaybillId: this.taxWaybillId },
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
            taxWaybillId: this.taxWaybillId,
          };
          deleteWaybill(json)
            .then((res) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              if (res.data.reCode == 0) {
                //删除成功
                this.$vux.toast.text("删除运单成功！", "middle");
                setTimeout(() => {
                  let json = {
                    taxWaybillId: this.taxWaybillId, //运单号
                    type: "1", //1删除 2终结 3修改
                  };
                  //判断机型发送信息
                  this.postMessage(json);
                }, 1000);
              } else {
                this.$vux.toast.text(res.data.reInfo, "middle");
              }
            })
            .catch((err) => {
              this.$vux.toast.text(err, "middle");
            });
        },
      });
    },
    //修改按钮
    reWriteWaybill() {
      if (this.isModifyWaybill == "1") {
        this.$vux.toast.text("存在提前收款支付单不可修改运单!", "middle");
        return;
      }
      this.$router.push({
        path: "/modifyWaybill",
        query: {
          taxWaybillId: this.taxWaybillId,
          xid: this.$route.query.xid,
          type: "0",
        }, //type:0从详情进入修改，1：列表进入修改
      });
      //this.$vux.toast.text("暂未开发,请稍后~", "middle");
    },
    //判断机型,向客户端发送信息
    postMessage: function (item) {
      AppUpdateWaybillData(item);
    },
    //点击跳转到记录页面
    gotoRecord() {
      this.$router.push({
        path: "/modifyRecord",
        query: { taxWaybillId: this.taxWaybillId },
      });
    },
    // 实现移动端拖拽
    down() {
      this.flags = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = this.moveDiv.offsetLeft;
      this.dy = this.moveDiv.offsetTop;
    },
    move() {
      if (this.flags) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx + this.nx;
        this.yPum = this.dy + this.ny;
        this.moveDiv.style.left = this.xPum + "px";
        this.moveDiv.style.top = this.yPum + "px";
        //阻止页面的滑动默认事件
        // document.addEventListener("touchmove",function(){
        //     event.preventDefault();
        // },false);
      }
    },
    //鼠标释放时候的函数
    end() {
      this.flags = false;
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
          `<p style='text-align:left'>确认拨打：</p><p style='color:#FFBA00;text-align:left'>` +
          driverName +
          `</p><p style='color:#FFBA00;text-align:left'>` +
          mobileNo +
          `</p>`,
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
        },
      });
    },
    gotoBaoZhangDetail() {
      console.log("跳转到保障页面");
      this.$router.push({
        path: "/goodsDamageDetail",
        query: {
          taxWaybillId: this.taxWaybillId,
        },
      });
    },
    _toSeeAgreement() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      toSeeAgreement({ taxWaybillId: this.taxWaybillId })
        .then((res) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            if (res.data.result.contractList.length === 0) {
              this.$vux.toast.text("协议为空,不可查看！", "middle");
            } else if (res.data.result.contractList.length === 1) {
              let urlStr =
                "http://pdf.log56.com/generic/web/viewer.html?file=" +
                res.data.result.contractList[0].contractUrl;
              console.log(urlStr);
              // window.open(urlStr, "name1");
              // ios兼容open
              window.location.href = urlStr;
            } else {
              // 去下一页
              this.$router.push({
                path: "/checkPdf",
                query: {
                  taxWaybillId: this.taxWaybillId,
                },
              });
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch((err) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
    },
  },
};
</script>

<style lang="less">
.waybill-detail {
  width: 100%;
  text-align: left;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .van-cell {
    font-size: 16px;
  }
  .card_group {
    background: #ffffff;
    width: 100%;
    margin-top: 10px;
    position: relative;
    &:before {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #d9d9d9;
      color: #d9d9d9;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .list-card {
      width: 100%;
      .van-cell {
        padding: 12px;
        &::after {
          left: 0px;
        }
      }
      .header_cell_title {
        color: #121212;
        font-weight: bold;
      }
      .card-left-cell {
        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        padding: 8px 12px;
        .left-cell-title {
          width: 120px;
          text-align: justify;
          text-align-last: justify;
          height: 20px;
          color: #797979;
          &:after {
            content: "";
            display: inline-block;
            width: 100%;
          }
        }
        .left-cell-value {
          flex: 3;
          -webkit-flex: 3;
          color: #202020;
          word-break: break-word;
          margin-left: -2px;
        }
        .highLight {
          color: #ffba00;
        }
      }
    }
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
  //进度条自定义样式
  .container {
    width: 100%;
    height: 120px;
    padding-top: 20px;
    .dot1 {
      width: 35px;
      height: 35px;
      border-radius: 35px;
      border: 2px solid #28b072;
      background: #28b072;
      margin: auto;
      margin-bottom: -18px;
      position: relative;
      img {
        position: absolute;
        left: 6px;
        top: 6px;
      }
    }
    .time {
      color: #121212;
      position: absolute;
      font-size: 16px;
      width: 70px;
      left: -14px;
      top: 44px;
      font-weight: bold;
      text-align: center;
    }
    .time_val {
      position: absolute;
      font-size: 12px;
      width: 98px;
      left: -30px;
      top: 70px;
      text-align: center;
    }
    .time_val_dash {
      color: #dfdfdf;
    }
    .dot2 {
      width: 35px;
      height: 35px;
      border-radius: 35px;
      border: 2px solid #dcdcdc;
      background: #dcdcdc;
      margin: auto;
      margin-bottom: -18px;
      position: relative;
      img {
        position: absolute;
        left: 6px;
        top: 6px;
      }
    }
    .item1 {
      flex: 1;
      -webkit-flex: 1;
      border-bottom: 2px solid #28b072;
    }
    .item2 {
      flex: 1;
      -webkit-flex: 1;
      border-bottom: 2px solid #dcdcdc;
    }
    .bg {
      background: #28b072;
    }
  }
  .baozhang_module {
    background: url("../../assets/imgs/goodsDamage/huosunbg_img@2x.png")
      no-repeat center center;
    height: 50px;
    line-height: 50px;
    width: 90%;
    background-size: 100% 100%;
    margin: 0 auto 10px;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    padding: 0px 15px;
    box-sizing: border-box;
    .baozhang_left {
      color: #ffffff;
      font-weight: bold;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      text-align: left;
      .huosuntub_icon {
        width: 32px;
        margin-top: -2px;
        vertical-align: middle;
      }
    }
    .baozhang_right {
      font-size: 15px;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      text-align: right;
    }
    .state1 {
      color: #ffd200;
    }
    .state2 {
      color: #8df4fd;
    }
    .state3 {
      color: #ffd200;
    }
    .state4 {
      color: #ffffff;
    }
  }

  .xuanfu {
    height: 3.5rem;
    width: 3.5rem;
    position: fixed;
    bottom: 5rem;
    right: 0.5rem;
    border-radius: 1.8rem;
    background-color: #ffba00;
    z-index: 990;
    box-shadow: 0px 0px 1px 1px #ccc;
    touch-action: none;
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-40%) translateY(-80%);
    }
    p {
      position: absolute;
      font-size: 0.6rem;
      color: #fff;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      min-width: 48px;
      text-align: center;
    }
  }
  .normal {
    background: #15499a;
  }
  .grey {
    background: #dcdcdc;
  }
}
</style>
