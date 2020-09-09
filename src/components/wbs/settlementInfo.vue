<template>
  <div class="settlement-info">
    <c-header>
      <x-header :left-options="{ backText: '' }">填写结算信息</x-header>
    </c-header>
    <div
      class="radio-container"
      v-if="collectTwoType !== '42' && (collectTwoCfg==='8' && waybillRangeCfg == 39 || wbBusinessType == 2)"
    >
      <div>
        <span class="vertical-line"></span>请选择付款方式：
      </div>
      <van-radio-group v-model="modelRadio" class="radio-group">
        <van-radio
          name="1"
          checked-color="#15499A"
          :class="modelRadio==='1'?'checked':''"
          :disabled="disabled1"
        >企业自付</van-radio>
        <van-radio
          name="2"
          checked-color="#15499A"
          :class="modelRadio==='2'?'checked':''"
          :disabled="disabled2"
        >
          供应链金融 (提前收款)
          <i class="iconfont iconwenhao" @click="seeSettlementActivity"></i>
        </van-radio>
      </van-radio-group>
    </div>
    <div v-if="modelRadio==='1'||modelRadio===''" @click.capture="checkChooseModel">
      <group label-width="6.8em" label-align="right" class="group0">
        <x-input
          title="运费金额："
          type="number"
          v-model.trim="allFreight"
          placeholder="请填写运费金额"
          @on-blur="arriveBlur"
          :disabled="collectTwoCfg==='8'&&modelRadio==='' && waybillRangeCfg == 39"
        >
          <div slot="label" style="text-align:right;width:6.8em;">
            <img
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">运费金额：</span>
          </div>
        </x-input>
        <x-input
          title="预付现金："
          placeholder="请填写预付现金"
          v-model.trim="prepayments"
          type="number"
          @on-blur="arriveBlur"
          :disabled="collectTwoCfg==='8'&&modelRadio==='' && waybillRangeCfg == 39"
        ></x-input>
        <x-input
          title="预付油卡："
          placeholder="请填写预付油卡"
          type="number"
          v-model.trim="prepaymentsOilCard"
          @on-blur="arriveBlur"
          v-show="oilCardCfg == '8'&&!(isSfOrg==='1'&&collectTwoCfg==='8'&& waybillRangeCfg == 39 )"
          ref="oilcardVal"
          :disabled="collectTwoCfg==='8'&&modelRadio===''&& waybillRangeCfg == 39 "
        ></x-input>
        <cell
          title="油卡卡号："
          is-link
          v-model="oilCardNo"
          v-show="(oilCardCfg == '8' && (prepaymentsOilCard != '' && prepaymentsOilCard != 0 && /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/.test(prepaymentsOilCard)))&&!(isSfOrg==='1'&&collectTwoCfg==='8'&& waybillRangeCfg == 39)"
          @click.native="gotoSelectOilCard(prepaymentsOilCard)"
        >
          <div slot="value" style="color:#757575;text-align: left;" v-show="oilCardNo == ''">请选择卡号</div>
        </cell>

        <x-input
          title="货值："
          type="number"
          v-model="goodsCost"
          @on-blur="inputBlur()"
          placeholder="请填写实际货值"
          :show-clear="false"
          v-if="priceInsuranceCfg == '8'"
          :disabled="collectTwoCfg==='8'&&modelRadio===''&& waybillRangeCfg == 39 "
        >
          <div slot="label" style="text-align:right;width:6.8em;">
            <img
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">货值：</span>
          </div>
          <div
            slot="right"
            style="color:#15499a"
            v-show="orgCfg718 !== '49'"
            @click="claimRules()"
          >理赔规则》</div>
        </x-input>
        <x-input
          title="保价费："
          placeholder="请填写保价费"
          type="number"
          :value="insFee"
          disabled
          v-show="priceInsuranceCfg == '8'"
        ></x-input>
        <x-input
          title="线下油款："
          type="number"
          @on-blur="arriveBlur"
          placeholder="请填写线下油款"
          v-model.trim="prepaymentsBuyOil"
          v-show="existsAvaibleOilStation == '1'"
          :disabled="collectTwoCfg==='8'&&modelRadio===''&& waybillRangeCfg == 39"
        ></x-input>
        <x-input
          title="线下气款："
          placeholder="请填写线下气款"
          type="number"
          @on-blur="arriveBlur"
          v-model.trim="prepaymentsBuyGas"
          v-show="existsAvaibleGasStation == '1'"
          :disabled="collectTwoCfg==='8'&&modelRadio===''&& waybillRangeCfg == 39"
        ></x-input>
        <x-input
          title="线下路桥费："
          placeholder="请填写线下路桥费"
          type="number"
          @on-blur="arriveBlur"
          v-model.trim="prepaymentsBuyEtc"
          v-show="existsAvaibleEtcStation == '1'"
          :disabled="collectTwoCfg==='8'&&modelRadio===''&& waybillRangeCfg == 39"
        ></x-input>
        <x-input
          title="到付金额："
          type="number"
          v-model.trim="arrivePay"
          @on-blur="arriveBlur"
          disabled
        ></x-input>
        <!-- 到付金额=运费金额—预付现金—预付油卡—线下油款—线下气款—线下路桥费—回单押金 -->
        <x-input
          title="回单押金："
          type="number"
          placeholder="请填写回单押金"
          v-model.trim="backFee"
          @on-blur="arriveBlur"
          :disabled="collectTwoCfg==='8'&&modelRadio===''&& waybillRangeCfg == 39"
        ></x-input>
        <div class="weui-cell" v-show="goodsInsuranceCfg == '8'">
          <checker v-model="items1Value" selected-item-class="selected" @on-change="changeType">
            <checker-item value="1" style="width: 6.8em; text-align: right; margin-right: 1em;">
              <img
                :src="src"
                alt
                width="15"
                height="15"
                style="vertical-align: middle;"
                class="img2"
              />
              <span style="vertical-align: middle;margin-left:0.5em;">购买保险</span>
            </checker-item>
          </checker>
        </div>
        <x-input
          title="货值："
          type="number"
          v-model.trim="goodsCost"
          placeholder="请输入实际货值"
          v-if="(goodsInsuranceCfg == '8' && items1Value == 0) || orgAttr == '2'"
          :disabled="collectTwoCfg==='8'&&modelRadio===''&& waybillRangeCfg == 39"
        >
          <div slot="label" style="text-align:right;width:6.8em;">
            <img
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">货 值：</span>
          </div>
        </x-input>
      </group>
      <div style="height:10px;"></div>
      <ReciveComponent advancePayState="0" ref="reciver_0"></ReciveComponent>
      <group label-width="6.8em" label-align="right" class="group1">
        <x-input
          title="定金："
          type="number"
          v-model.trim="deposit"
          v-show="this.depositCfg == '8'"
          placeholder="请填写定金"
          :disabled="collectTwoCfg==='8'&&modelRadio===''&& waybillRangeCfg == 39"
        ></x-input>
        <x-input
          title="推广费："
          type="number"
          v-model.trim="promotionFee"
          v-show="this.promotionFeeCfg == '8'"
          placeholder="请填写推广费"
          :disabled="collectTwoCfg==='8'&&modelRadio===''&& waybillRangeCfg == 39"
        ></x-input>
        <x-input
          title="应收回款："
          type="number"
          v-model.trim="receivablePayback"
          v-show="this.receivablePaybackCfg == '8'"
          placeholder="请填写应收回款"
          :disabled="collectTwoCfg==='8'&&modelRadio===''&& waybillRangeCfg == 39"
        ></x-input>
      </group>
    </div>
    <div v-if="modelRadio==='2'">
      <group label-width="6.8em" label-align="right" class="group0">
        <x-input
          title="运费金额："
          type="number"
          v-model.trim="allFreight_2"
          placeholder="请填写运费金额"
          @on-blur="arriveBlur(1)"
        >
          <div slot="label" style="text-align:right;width:6.8em;">
            <img
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">运费金额：</span>
          </div>
        </x-input>
        <x-input
          title="预付现金："
          placeholder="请填写预付现金"
          v-model.trim="prepayments_2"
          type="number"
          @on-blur="arriveBlur"
          v-show="collectTwoCfg == 8 && collectTwoPreCashCfg == 8"
        ></x-input>
        <x-input
          title="预付油卡："
          placeholder="请填写预付油卡"
          type="number"
          v-model.trim="prepaymentsOilCard_2"
          @on-blur="arriveBlur(2)"
          ref="prepayOilcard"
        >
          <div
            slot="label"
            style="text-align:right;width:6.8em;"
            v-if="Number(this.oilCardPayLowerCfg) > 0"
          >
            <img
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">预付油卡：</span>
          </div>
        </x-input>
        <x-input
          title="油卡卡号："
          placeholder="请选择卡号"
          type="text"
          :readonly="true"
          v-model="oilCardNo_2"
          @click.native="gotoSelectOilCard(prepaymentsOilCard_2)"
        >
          <div
            slot="label"
            style="text-align:right;width:6.8em;"
            v-if="Number(this.oilCardPayLowerCfg) > 0"
          >
            <img
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">油卡卡号：</span>
          </div>
          <div slot="right">
            <i class="iconfont iconarr-right"></i>
          </div>
        </x-input>
        <!-- 到付金额=运费金额—预付现金—预付油卡—线下油款—线下气款—线下路桥费—回单押金 -->
        <x-input
          title="回单押金："
          type="number"
          placeholder="请填写回单押金"
          v-model.trim="backFee_2"
          @on-blur="arriveBlur"
          v-show="collectTwoCfg == 8 && collectTwoRecDepositCfg == 8"
        ></x-input>

        <x-input
          title="到付金额："
          type="number"
          v-model.trim="arrivePay_2"
          @on-blur="arriveBlur"
          disabled
        >
          <div slot="label" style="text-align:right;width:6.8em;">
            <img
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">到付金额：</span>
          </div>
        </x-input>
        <x-input
          title="货值："
          type="number"
          v-model="goodsCost"
          @on-blur="inputBlur()"
          placeholder="请填写实际货值"
          :show-clear="false"
          v-if="priceInsuranceCfg == '8'"
        >
          <div slot="label" style="text-align:right;width:6.8em;">
            <img
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">货值：</span>
          </div>
          <div
            slot="right"
            style="color:#15499a"
            @click="claimRules()"
            v-show="orgCfg718 !== '49'"
          >理赔规则》</div>
        </x-input>
        <x-input
          title="保价费："
          placeholder="请填写保价费"
          type="number"
          :value="insFee"
          disabled
          v-show="priceInsuranceCfg == '8'"
        ></x-input>
        <div class="weui-cell" v-show="goodsInsuranceCfg == '8'">
          <checker v-model="items1Value" selected-item-class="selected" @on-change="changeType">
            <checker-item value="1" style="width: 6.8em; text-align: right; margin-right: 1em;">
              <img
                :src="src"
                alt
                width="15"
                height="15"
                style="vertical-align: middle;"
                class="img2"
              />
              <span style="vertical-align: middle;margin-left:0.5em;">购买保险</span>
            </checker-item>
          </checker>
        </div>
        <x-input
          title="货值："
          type="number"
          v-model.trim="goodsCost"
          placeholder="请输入实际货值"
          v-if="(goodsInsuranceCfg == '8' && items1Value == 0) || orgAttr == '2'"
        >
          <div slot="label" style="text-align:right;width:6.8em;">
            <img
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">货 值：</span>
          </div>
        </x-input>
      </group>
      <div style="height:10px;"></div>
      <ReciveComponent ref="reciver_1" advancePayState="1"></ReciveComponent>
    </div>
    <div class="footer" style="height:80px;"></div>
    <div class="button">
      <x-button type="primary" @click.native="buildWaybill">建单</x-button>
    </div>
  </div>
</template>
<script>
import { RadioGroup, Radio, Toast } from "vant";
import { mapState } from "vuex";
import {
  queryWaybill,
  success,
  checkFee,
  buildWaybillAgain,
  getCompanyConfig,
} from "../../api/api.js";
import { divide, multiply, subtract, add } from "../../utils/calc";
import { infoEntry, getCarMasterInfo } from "../../api/applyPay.js";
import { oilCardCheck, getOilCardNo } from "../../api/apiOil.js";
import { waixieDeliverWaybill } from "../../api/dbwaixie.js";
import ReciveComponent from "./components/ReciveCom";
import { HYB_RECIVE, YHK_RECIVE, HYB_WALLET } from "./components/const";
import { getPayTypeAndHkbPayeeType } from "./components/utils";
export default {
  name: "settlementInfo",
  data() {
    return {
      firstLoad: true,
      allFreight_2: "",
      prepayments_2: "",
      prepaymentsOilCard_2: "",
      oilCardNo_2: "",
      arrivePay_2: "0.00",
      backFee_2: "", //开通供应链金融到付2的回单押金
      modelRadio: "",
      allFreight: "", //运费金额
      arrivePay: "0.00", //到付金额
      backFee: "", //回单押金
      prepayments: "", //预付现金
      prepaymentsOilCard: "", //预付油卡
      oilCardNo: "", // 油卡卡号
      prepaymentsBuyOil: "", //线下油款
      prepaymentsEtcCard: "0", //预付ETC
      prepaymentsBuyEtc: "", //线下路桥费
      prepaymentsBuyGas: "", //线下气款
      yetBuyEtcNotInvoice: "", //累计ETC未开票金额
      yetBuyGasNotInvoice: "", //累计加气未开票金额
      yetBuyOilNotInvoice: "", //累计购油未开票金额
      yetPrepaymentsBuyEtc: "", //线下路桥费
      yetPrepaymentsBuyGas: "", //线下气款
      yetPrepaymentsBuyOil: "", //线下油款
      //   demo1Checkbox: [0], //预付回单付选中项
      loginState: "",
      value1: "",
      maxAllFreight: "", //最大运费金额
      existsAvaibleOilStation: "", //线下油款判断
      existsAvaibleEtcStation: "",
      existsAvaibleGasStation: "",
      freightIncr: "0", //运费增补默认给0
      oilCardPayUpperCfg: "", //油卡支付上限
      oilCardPayLowerCfg: "", // 油卡支付下限
      collectTwoDriServiceCfg: "", // 司机服务费
      collectTwoDriAccPerCfg: "", // 到付金2司机账期
      oilCardCfg: "",
      etcCardCfg: "",
      goodsCost: "", //货值
      src: require("../../assets/imgs/wbs/xuanzekuagn_icon@2x.png"),
      src1: require("../../assets/imgs/wbs/xuanzeselect_icon@2x.png"),
      src2: require("../../assets/imgs/wbs/xuanzekuagn_icon@2x.png"),
      items1Value: "1",
      goodsInsuranceCfg: "", //购买保险货值配置
      orgAttr: "", //用户属性
      //   note: "", //备注
      disabled1: false,
      disabled2: false,
      //   screenHeight: document.documentElement.clientHeight,
      //   minHeight: "",
      successFlag: 1,

      taxWaybillId: this.$route.query.taxWaybillId, //从再建一单进来的标志
      belongActSys: "", //所属账户体系
      wbBusinessType: "",
      goodsId: "",
      insFee: "0.00", //保价费
      priceInsuranceCfg: "", //保价运输险配置 8开9关
      priceInsuranceRate: "", //保价费率
      show1: false,
      menus1: {
        menu1: "好运宝收款",
        menu2: "银行卡收款",
      },
      value2: "请选择收款方式",
      zyCapitalCfg: "", // 回款宝配置
      hybWalletCfg: "", //好运宝钱包配置
      zblState: "", //自保理状态
      isEleOil: "", //是否是电子油卡 0：是 1：否
      isSelfGathering: "",

      shoukuanType: false, //默认可以修改收款方式
      report003Cfg: "",
      deposit: "", //定金
      promotionFee: "", //推广费
      receivablePayback: "", //应收回款
      depositCfg: "", //定金配置
      promotionFeeCfg: "", //推广费配置
      receivablePaybackCfg: "", //应收回款配置
      driverFinanceCfg: "", // 司机金融配置
      driverFinanceProportionCfg: "", // 司机金融最高配比
      collectTwoCfg: "", // 到付金2配置
      waybillRangeCfg: "", // 到付金2-运单范围
      supplyChainState: "", // 供应链金融权限
      collectTwoPreCashCfg: "",
      collectTwoRecDepositCfg: "",
      isSfOrg: "0", // 是否是盛丰企业 1：是 0 否
      collectTwoType: "",
      collectionFlagCfg: "", // 到付金收款方式
      orgCfg718: "", //德邦外协配置
      carMasterName: "", // 车队长名字
      isCarMaster: "", // 是否是车队长
      masterNull: 1, // 车队长查不出数据的标志

      mobileNo1: "",
      payeeName1: "",
      driverName1: "",
      cartBadgeNo1: "",

      orgCfg726: "", // 回单押金最高配比
      orgCfg710: "", // 到付金2支付运费结构
    };
  },
  components: {
    ReciveComponent,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
  },
  beforeRouteLeave(to, from, next) {
    let obj = {
      allFreight: this.allFreight, // 运费金额
      backFee: this.backFee, // 回单押金
      prepayments: this.prepayments, // 预付现金
      prepaymentsOilCard: this.prepaymentsOilCard, // 预付油卡
      prepaymentsBuyOil: this.prepaymentsBuyOil, // 线下油款
      prepaymentsBuyGas: this.prepaymentsBuyGas, // 线下气款
      prepaymentsBuyEtc: this.prepaymentsBuyEtc, // 线下路桥费
      // prepaymentsEtcCard: this.prepaymentsEtcCard, // 预付ETC
      goodsCost: this.goodsCost, // 货值
      //   demo1Checkbox: this.demo1Checkbox, //预付、回单付选中项
      items1Value: this.items1Value, // 保险选中项
      zyCapitalCfg: this.zyCapitalCfg, // 回款宝配置
      hybWalletCfg: this.hybWalletCfg,
      //   arrivePay: this.arrivePay
    };
    let updateOpions = {
      type: "weyBillThird",
      updatMsg: obj,
    };
    this.$store.commit("updateWayBillStatus", updateOpions);
    next();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.items1Value = vm.weyBillFirst.items1Value;
      if (from.name == "chooseOilCard" || from.name == "addOilCard") {
        if (window.localStorage.getItem("oilCardNo") != null) {
          if (vm.modelRadio === "2") {
            vm.oilCardNo_2 = window.localStorage.getItem("oilCardNo");
          }
          //点击使用后，返回带回油卡号
          vm.oilCardNo = window.localStorage.getItem("oilCardNo");
          window.localStorage.removeItem("oilCardNo");
        }
        vm.isEleOil = vm.chooseOilCardItem.oilBigType == "4" ? "0" : "1";
      } else if (from.name == "wbsCarTeam") {
        let cartBadgeNoChange = localStorage.getItem("cartBadgeNoChange");
        if (cartBadgeNoChange == 1 && vm.isEleOil != 0) {
          vm.oilCardNo = "";
        }
        window.localStorage.removeItem("cartBadgeNoChange");

        let mobileNoChange = localStorage.getItem("mobileNoChange");
        if (mobileNoChange == 1 && vm.isEleOil == 0) {
          vm.oilCardNo = "";
        }
        window.localStorage.removeItem("mobileNoChange");

        let driverNameNoChange = localStorage.getItem("driverNameNoChange");
        window.localStorage.removeItem("driverNameNoChange");

        if (vm.modelRadio === "2") {
          vm.modelRadioInit();
        }
        if (
          !vm.firstLoad &&
          (cartBadgeNoChange == "1" ||
            mobileNoChange == "1" ||
            driverNameNoChange == "1")
        ) {
          vm.$refs.reciver_0.changeReciver();
        }
      }
      vm.$store.commit("updateLoadingStatus", { isLoading: false });
    });
  },
  watch: {
    modelRadio(val) {
      // 垫付单
      if (val === "2") {
        this.modelRadioInit();
      }
    },
  },
  created() {
    this.firstLoad = false;
    this._getCompanyConfig()
      .then((res) => {
        this._queryWaybill();
      })
      .catch((e) => {});
  },
  computed: {
    chooseOilCardItem() {
      return this.$store.state.oilCard.chooseOilCardItem;
    },
    weyBillFirst() {
      return this.$store.state.wayBill.weyBillFirst;
    },
    weyBillSecond() {
      return this.$store.state.wayBill.weyBillSecond;
    },
    weyBillThird() {
      return this.$store.state.wayBill.weyBillThird;
    },
    reciveMsgPay() {
      return this.$store.state.wayBill.reciveMsgPay;
    },
    reciveMsgPay1() {
      return this.$store.state.wayBill.reciveMsgPay1;
    },
    deliveryGoodsWaybillInfo() {
      return this.$store.state.deliveryGoods.deliveryGoodsWaybillInfo;
    },
    ...mapState("carTeamMasterInfo/", {
      carTeamInfo: (state) => state.carTeamInfo,
    }),
  },
  activated() {
    this.mobileNo1 = this.weyBillSecond.mobileNo;
    this.payeeName1 = this.weyBillSecond.driverName;
    this.driverName1 = this.weyBillSecond.driverName;
    this.cartBadgeNo1 = this.weyBillSecond.cartBadgeNo;
  },
  methods: {
    seeSettlementActivity() {
      this.$router.push({
        path: "/settlementActivity",
        query: {
          collectTwoDriAccPerCfg: this.collectTwoDriAccPerCfg,
          collectTwoRecDepositCfg: this.collectTwoRecDepositCfg,
          orgCfg726: this.orgCfg726,
          orgCfg710: this.orgCfg710,
        },
      });
    },
    modelRadioInit() {
      this._getOilCardNo()
        .then((res) => {
          this.$refs.reciver_1.init();
        })
        .catch((err) => {});
    },
    checkChooseModel(event) {
      if (
        this.collectTwoCfg === "8" &&
        this.modelRadio === "" &&
        this.waybillRangeCfg == 39
      ) {
        // 开通到付金2配置且没有选择付款方式
        this.$vux1.confirm.show({
          title: "提示",
          content: `请先选择运费付款方式`,
          confirmText: "确认",
          showCancelButton: false,
          onConfirm: () => {},
        });
        event.stopPropagation();
      }
    },
    _queryWaybill() {
      //初始化配置信息
      queryWaybill()
        .then((res) => {
          if (res.data.reCode == 0) {
            let data = res.data.result;
            this.belongActSys = data.belongActSys; //所属账户体系
            this.oilCardCfg = data.oilCardCfg; //油卡权限配置
            this.etcCardCfg = data.etcCardCfg;
            this.maxAllFreight = data.maxAllFreight; //最大运费配置
            this.existsAvaibleOilStation = data.existsAvaibleOilStation; //线下油款配置
            this.existsAvaibleEtcStation = data.existsAvaibleEtcStation; //线下ETC配置
            this.existsAvaibleGasStation = data.existsAvaibleGasStation; //线下气款配置
            this.goodsInsuranceCfg = data.goodsInsuranceCfg; //购买保险配置
            this.orgAttr = data.orgAttr; //用户属性
            this.yetBuyEtcNotInvoice = data.yetBuyEtcNotInvoice; //累计ETC未开票金额
            this.yetBuyGasNotInvoice = data.yetBuyGasNotInvoice; //累计加气未开票金额
            this.yetBuyOilNotInvoice = data.yetBuyOilNotInvoice; //累计购油未开票金额
            this.yetPrepaymentsBuyEtc = data.yetPrepaymentsBuyEtc; //线下路桥费
            this.yetPrepaymentsBuyGas = data.yetPrepaymentsBuyGas; //线下气款
            this.yetPrepaymentsBuyOil = data.yetPrepaymentsBuyOil; //线下油款
            this.oilCardPayUpperCfg = data.oilCardPayUpperCfg; //油卡支付上限

            this.loginState = data.loginState; //状态
            this.report003Cfg = data.report003Cfg; //经营会计报表配置
            this.depositCfg = data.depositCfg;
            this.promotionFeeCfg = data.promotionFeeCfg;
            this.receivablePaybackCfg = data.receivablePaybackCfg;
            this.priceInsuranceCfg = data.priceInsuranceCfg; //保价运输险配置
            this.priceInsuranceRate = data.priceInsuranceRate; //保价费率
            this.zyCapitalCfg = data.zyCapitalCfg; // 回款宝配置
            this.hybWalletCfg = data.hybWalletCfg; // 好运宝钱包配置
            this.driverFinanceCfg = data.driverFinanceCfg;
            this.driverFinanceProportionCfg = data.driverFinanceProportionCfg;

            this.isSfOrg = data.isSfOrg;

            if (this.taxWaybillId !== undefined) {
              let json = {
                taxWaybillId: this.taxWaybillId,
              };
              buildWaybillAgain(json)
                .then((res) => {
                  //3048
                  if (res.data.reCode === "0") {
                    let result = res.data.result;
                    this.allFreight = result.userFreight; //运费金额
                    this.prepayments = result.prepayments; //预付现金
                    this.backFee = result.backFee; //回单押金
                  }
                })
                .catch((err) => {
                  this.$vux.toast.text(err.message, "middle");
                  this.$store.commit("updateLoadingStatus", {
                    isLoading: false,
                  });
                });
            } else {
              this.wbBusinessType = this.deliveryGoodsWaybillInfo.wbBusinessType;
              this.goodsId = this.deliveryGoodsWaybillInfo.goodsId;
              this.isSelfGathering = this.deliveryGoodsWaybillInfo.isSelfGathering;
              let expectFreight = this.deliveryGoodsWaybillInfo.expectFreight;
              if (this.wbBusinessType == 2) {
                if (this.isSelfGathering == 1 && this.collectTwoType !== "42") {
                  // 如果是本人
                  this.modelRadio = "2";
                  this.disabled1 = true;
                  this.allFreight_2 = expectFreight;
                } else {
                  // 如果是非本人
                  this.modelRadio = "1";
                  this.disabled2 = true;
                  this.allFreight = expectFreight;
                }
              } else {
                this.allFreight = this.weyBillThird.allFreight;
              }

              this.prepayments = this.weyBillThird.prepayments;
              this.backFee = this.weyBillThird.backFee;
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch((err) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });

      // this.allFreight = this.weyBillThird.allFreight;
      // this.backFee = this.weyBillThird.backFee;
      this.goodsCost = this.weyBillThird.goodsCost;
      // this.prepayments = this.weyBillThird.prepayments;
      this.prepaymentsBuyOil = this.weyBillThird.prepaymentsBuyOil;
      this.prepaymentsOilCard = this.weyBillThird.prepaymentsOilCard;
      this.prepaymentsBuyGas = this.weyBillThird.prepaymentsBuyGas; // 线下气款
      this.prepaymentsBuyEtc = this.weyBillThird.prepaymentsBuyEtc; // 线下路桥费
      // this.arrivePay = this.weyBillThird.arrivePay; //到付
      // this.demo1Checkbox = this.weyBillThird.demo1Checkbox.slice(); //为了在mutation之外处理数组赋值后问题，不然会报错
      // this.checkbox(this.demo1Checkbox);
      this.changeType(this.items1Value);
    },
    _getOilCardNo() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        let json = {
          driverMobileNo: this.weyBillSecond.mobileNo,
        };
        getOilCardNo(json)
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              this.oilCardNo_2 = res.data.result.oilCardNo;
              resolve();
            } else {
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
    _getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let result = res.data.result;
              this.collectTwoCfg = result.collectTwoCfg; // 到付金2配置 8：开通9：关闭
              this.waybillRangeCfg = result.waybillRangeCfg; //39 自由运单 40 路有运单
              this.supplyChainState = result.supplyChainState; // 供应链金融权限 8：开通9：关闭
              this.oilCardPayLowerCfg = result.oilCardPayLowerCfg; //油卡支付下限
              this.collectTwoDriServiceCfg = result.collectTwoDriServiceCfg; //司机服务费
              this.collectTwoDriAccPerCfg = result.collectTwoDriAccPerCfg; //到付金2司机账期
              this.collectTwoType = result.collectTwoType; //41供应链金融到付金 42商信金到付金
              this.collectTwoPreCashCfg = result.collectTwoPreCashCfg; //到付金2-预付现金
              this.collectTwoRecDepositCfg = result.collectTwoRecDepositCfg; // 到付金2-回单押金
              this.collectionFlagCfg = result.collectionFlagCfg; // 到付金收款方式
              this.orgCfg718 = result.orgCfg718; // 49：德邦外协
              this.orgCfg726 = result.orgCfg726; // 回单押金最高配比
              this.orgCfg710 = result.orgCfg710; // 到付金2支付运费结构
              if (this.collectTwoType === "42") {
                this.modelRadio = "1";
              }
              if (
                this.collectTwoType !== "42" &&
                ((this.collectTwoCfg === "8" && this.waybillRangeCfg == 39) ||
                  this.wbBusinessType == 2)
              ) {
                this.modelRadio = "2";
              }
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
    // 检查预付油卡金额
    checkPrepaymentsOilCard() {
      let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
      if (!this.isEmptyStr(this.prepaymentsOilCard_2)) {
        if (!regExp.test(this.prepaymentsOilCard_2)) {
          this.$vux.alert.show({
            title: "提示",
            content: "无效的预付油卡金额！",
          });
          return false;
        }
      } else {
        if (Number(this.oilCardPayLowerCfg) > 0) {
          this.$vux.alert.show({
            title: "提示",
            content: "预付油卡金额必填！",
          });
          return false;
        }
      }
      // 建单阻止继续提交
      if (!this.validateBackFee_2()) {
        return false;
      }

      // let temp = (Number(this.allFreight_2) * 3) / 10;
      let temp = (
        Number(this.allFreight_2) * Number(this.oilCardPayLowerCfg)
      ).toFixed(2);
      if (Number(this.prepaymentsOilCard_2) < Number(temp)) {
        this.prepaymentsOilCard_2 = 0;
        this.arrivePay_2 = (
          Number(this.allFreight_2) -
          Number(this.prepaymentsOilCard_2) -
          Number(this.prepayments_2) -
          Number(this.backFee_2)
        ).toFixed(2);
        this.$vux1.confirm.show({
          title: "提示",
          content: `您输入的预付油卡金额不可小于${Number(temp)}元`,
          confirmText: "确认",
          showCancelButton: false,
          onConfirm: () => {
            this.$refs.prepayOilcard.focus();
          },
          onCancel: () => {
            this.$refs.prepayOilcard.focus();
          },
          onClose: () => {
            this.$refs.prepayOilcard.focus();
          },
        });
        return false;
      } else if (
        Number(this.prepaymentsOilCard_2) > Number(this.allFreight_2)
      ) {
        this.prepaymentsOilCard_2 = 0;
        this.arrivePay_2 = (
          Number(this.allFreight_2) -
          Number(this.prepaymentsOilCard_2) -
          Number(this.prepayments_2) -
          Number(this.backFee_2)
        ).toFixed(2);
        this.$vux1.confirm.show({
          title: "提示",
          content: `您输入的预付油卡金额不可大于运费金额！`,
          confirmText: "确认",
          showCancelButton: false,
          onConfirm: () => {
            this.$refs.prepayOilcard.focus();
          },
          onCancel: () => {
            this.$refs.prepayOilcard.focus();
          },
          onClose: () => {
            this.$refs.prepayOilcard.focus();
          },
        });
        return false;
      } else {
        this.arrivePay_2 = (
          Number(this.allFreight_2) -
          Number(this.prepaymentsOilCard_2) -
          Number(this.prepayments_2) -
          Number(this.backFee_2)
        ).toFixed(2);
      }
      return true;
    },
    //鼠标离开自动计算到付金额
    arriveBlur(typeInput) {
      if (this.modelRadio === "2") {
        if (typeInput === 1) {
          let temp = Number(this.allFreight_2) * this.oilCardPayLowerCfg;
          let shangxian = Number(this.allFreight_2) * this.oilCardPayUpperCfg;
          let oilCard = Number(Math.ceil(temp / 100) * 100).toFixed(2);
          if (Number(temp) > 100) {
            // 如果拆分的预付油卡 大于 油卡支付上限
            if (Number(oilCard) > shangxian) {
              this.prepaymentsOilCard_2 = Number(shangxian).toFixed(2);
            } else {
              this.prepaymentsOilCard_2 = Number(oilCard).toFixed(2);
            }
          } else {
            this.prepaymentsOilCard_2 = Number(temp).toFixed(2);
          }
          this.arrivePay_2 = (
            Number(this.allFreight_2) -
            Number(this.prepaymentsOilCard_2) -
            Number(this.prepayments_2) -
            Number(this.backFee_2)
          ).toFixed(2);
          // 等于0 非必填
          this.validateBackFee_2();
        } else {
          this.checkPrepaymentsOilCard();
        }
      } else {
        this.arrivePay = (
          Number(this.allFreight) -
          Number(this.prepayments) -
          Number(this.prepaymentsOilCard) -
          Number(this.backFee) +
          Number(this.freightIncr)
        ).toFixed(2);
      }
      //如果输入非法的值计算，则结果不能为NaN，替换为0.00
      if (this.arrivePay == "NaN") {
        this.arrivePay = "0.00";
      }
    },
    // 检查回单押金
    validateBackFee_2() {
      let type = true;
      if (
        this.collectTwoCfg == "8" &&
        this.collectTwoRecDepositCfg == "8" &&
        this.orgCfg710 == "44" &&
        this.orgCfg726 !== ""
      ) {
        // 若企业开通了到付金2且配置的回单押金为允许，回单押金最高比例，且配置的支付范围：回单+到付款，
        // 则建单时回单押金填写金额根据企业配置的回单押金最高比例做限制，超出时提示：回单押金不可超过运费金额的xx%
        let temp = Number(
          (
            (Number(this.orgCfg726) * 100 * Number(this.allFreight_2)) /
            100
          ).toFixed(2)
        );
        if (Number(this.backFee_2) > 200 && Number(this.backFee_2) > temp) {
          this.$vux1.confirm.show({
            title: "提示",
            content: `回单押金不可超过运费金额的${
              Number(this.orgCfg726) * 100
            }%`,
            confirmText: "确认",
            showCancelButton: false,
            onConfirm: () => {},
            onCancel: () => {},
            onClose: () => {},
          });
          // this.backFee_2 = 0;
          type = false;
        }
      }
      return type;
    },
    //点击跳转到油卡选择页面
    gotoSelectOilCard(item) {
      try {
        MtaH5.clickStat("settlement_oilcard");
      } catch (error) {
        JSON.stringify(error);
      }
      this.$router.push({
        path: "/chooseOilCard",
        query: {
          belongActSys: this.belongActSys,
          prepaymentsOilCard: item,
        },
      });
    },
    inputBlur() {
      let reg = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
      if (this.priceInsuranceCfg == "8") {
        if (!reg.test(this.goodsCost)) {
          this.insFee = "0.00";
        } else {
          this.insFee = Number(
            this.goodsCost * this.priceInsuranceRate
          ).toFixed(2);
        }
      }
      if (this.goodsCost == "") {
        this.insFee = "0.00";
      }
    },
    //理赔规则跳转方法
    claimRules() {
      this.$router.push("/claimRules");
    },
    //点击购买保险
    changeType(val) {
      try {
        MtaH5.clickStat("settlement_goodsinsurance");
      } catch (error) {
        JSON.stringify(error);
      }
      if (val == 0) {
        this.items1Value = "0";
        this.src = this.src1;
      } else {
        this.items1Value = "1";
        this.src = this.src2;
      }
    },
    //建单按钮判断
    buildWaybill() {
      try {
        MtaH5.clickStat("settlement_jiandan");
      } catch (error) {
        JSON.stringify(error);
      }
      if (
        this.collectTwoCfg === "8" &&
        this.modelRadio === "" &&
        this.waybillRangeCfg == 39
      ) {
        // 开通到付金2配置且没有选择付款方式
        this.$vux1.confirm.show({
          title: "提示",
          content: `请先选择运费付款方式`,
          confirmText: "确认",
          showCancelButton: false,
          onConfirm: () => {},
        });
        return;
      }
      if (this.modelRadio === "2") {
        // 预付油卡验证
        if (!this.checkPrepaymentsOilCard()) {
          return false;
        }
        if (!this.isEmptyStr(this.allFreight_2)) {
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.allFreight_2)) {
            this.$vux.alert.show({
              title: "提示",
              content: "运费金额不合法！",
            });
            return false;
          }
          if (Number(this.allFreight_2) > Number(this.maxAllFreight)) {
            this.$vux.alert.show({
              title: "提示",
              content: "运费金额不能超过最大金额！",
            });
            return false;
          }
        } else {
          this.$vux.alert.show({ title: "提示", content: "运费金额必填！" });
          return false;
        }
        //预付现金判断
        if (!this.isEmptyStr(this.prepayments_2)) {
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.prepayments_2)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的预付现金金额！",
            });
            return false;
          }
          if (!this.isEmptyStr(this.allFreight_2)) {
            if (Number(this.prepayments_2) > Number(this.allFreight_2)) {
              this.$vux.alert.show({
                title: "提示",
                content: "预付现金不能大于运费金额！",
              });
              return false;
            }
          }
          if (Number(this.prepayments_2) > Number(this.maxAllFreight)) {
            this.$vux.alert.show({
              title: "提示",
              content: "预付现金不能超过最大运费金额！",
            });
            return false;
          }
        }
        //
        if (
          this.isEmptyStr(this.oilCardNo_2) &&
          Number(this.oilCardPayLowerCfg) > 0
        ) {
          this.$vux.alert.show({ title: "提示", content: "油卡卡号必填！" });
          return false;
        }
        //
        if (
          this.isEmptyStr(this.prepaymentsOilCard_2) &&
          Number(this.oilCardPayLowerCfg) > 0
        ) {
          this.$vux.alert.show({ title: "提示", content: "预付油卡必填！" });
          return false;
        }
        //回单押金判断
        if (!this.isEmptyStr(this.backFee_2)) {
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.backFee_2)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的回单押金金额！",
            });
            return false;
          }
          if (!this.isEmptyStr(this.allFreight_2)) {
            if (Number(this.backFee_2) > Number(this.allFreight_2)) {
              this.$vux.alert.show({
                title: "提示",
                content: "回单押金不能大于运费金额！",
              });
              return false;
            }
          }
          if (Number(this.backFee_2) > Number(this.maxAllFreight)) {
            this.$vux.alert.show({
              title: "提示",
              content: "回单押金不能超过最大运费金额！",
            });
            return false;
          }
        }
        //货值判断(保价费)
        if (this.priceInsuranceCfg == 8) {
          let regexp = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
          this.goodsCost = this.trim(this.goodsCost);
          if (!this.isEmptyStr(this.goodsCost)) {
            if (!regexp.test(this.goodsCost)) {
              this.$vux.toast.text("货值输入不合法！", "middle");
              return false;
            }
          } else {
            this.$vux.alert.show({
              title: "提示",
              content: `企业已开通"保价运输"请输入此次运输货值！`,
            });
            return false;
          }
        }
        if (
          (this.goodsInsuranceCfg == 8 && this.items1Value == 0) ||
          this.orgAttr == 2
        ) {
          let regexp = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
          this.goodsCost = this.trim(this.goodsCost);
          if (!this.isEmptyStr(this.goodsCost)) {
            if (!regexp.test(this.goodsCost)) {
              //（货值最小一万, 最大五百万）
              this.$vux.toast.text("货值输入不合法！", "middle");
              return false;
            }
          } else {
            this.$vux.toast.text("货值必填！", "middle");
            return false;
          }
        }
        this.success();
      } else {
        //是否购买保险来判断货值,以用户属性判断 orgAttr 是否显示货值
        if (!this.isEmptyStr(this.allFreight)) {
          this.allFreight = this.trim(this.allFreight);
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.allFreight)) {
            this.$vux.alert.show({
              title: "提示",
              content: "运费金额不合法！",
            });
            return false;
          }
          if (Number(this.allFreight) > Number(this.maxAllFreight)) {
            this.$vux.alert.show({
              title: "提示",
              content: "运费金额不能超过最大金额！",
            });
            //this.$vux.toast.text("预付款不能超过最大金额！", "middle");
            return false;
          }
        } else {
          this.$vux.alert.show({ title: "提示", content: "运费金额必填！" });
          return false;
        }

        //预付和回单付的值判断
        if (!this.isEmptyStr(this.prepayments)) {
          this.prepayments = this.trim(this.prepayments);
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.prepayments)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的预付现金！",
            });
            //this.$vux.toast.text("无效的预付款金额！", "middle");
            return false;
          }
          if (!this.isEmptyStr(this.allFreight)) {
            if (Number(this.prepayments) > Number(this.allFreight)) {
              this.$vux.alert.show({
                title: "提示",
                content: "预付现金不能超过运费金额！",
              });
              //this.$vux.toast.text("预付款不能超过运费金额！", "middle");
              return false;
            }
          }
          if (Number(this.prepayments) > Number(this.maxAllFreight)) {
            this.$vux.alert.show({
              title: "提示",
              content: "预付现金不能超过最大金额！",
            });
            //this.$vux.toast.text("预付款不能超过最大金额！", "middle");
            return false;
          }
        }
        if (this.oilCardCfg == 8 && !this.isEmptyStr(this.prepaymentsOilCard)) {
          this.prepaymentsOilCard = this.trim(this.prepaymentsOilCard);
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.prepaymentsOilCard)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的预付油卡金额！",
            });
            //this.$vux.toast.text("无效的预付油卡金额！", "middle");
            return false;
          } else {
            if (Number(this.prepaymentsOilCard) > Number(this.maxAllFreight)) {
              this.$vux.alert.show({
                title: "提示",
                content: "预付油卡金额不能超过最大金额！",
              });
              return false;
            }
            if (this.oilCardNo == "") {
              this.$vux1.confirm.show({
                title: `提示`,
                content: `<p style='color:#454545;'>当前运单存在预付油卡</p><p style='color:#454545;'>请选择油卡!</p>`,
                confirmText: "选择油卡",
                cancelText: "确认建单",
                onConfirm: () => {
                  // console.log("选择油卡")
                  // this.$router.push("/chooseOilCard")
                  try {
                    MtaH5.clickStat("settlement_alertchoosecard");
                  } catch (error) {
                    JSON.stringify(error);
                  }
                  this.$router.push({
                    path: "/chooseOilCard",
                    query: {
                      belongActSys: this.belongActSys,
                      prepaymentsOilCard: this.prepaymentsOilCard,
                    },
                  });
                },
                onCancel: () => {
                  // console.log("确认建单")
                  try {
                    MtaH5.clickStat("settlement_alertbuildensure");
                  } catch (error) {
                    JSON.stringify(error);
                  }
                  if (this.driverFinanceJudge() == false) {
                    return false;
                  }
                  this.success();
                },
              });
              return false;
            }
          }
        }

        //货值判断(保价费)
        if (this.priceInsuranceCfg == 8) {
          let regexp = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
          this.goodsCost = this.trim(this.goodsCost);
          if (!this.isEmptyStr(this.goodsCost)) {
            if (!regexp.test(this.goodsCost)) {
              this.$vux.toast.text("货值输入不合法！", "middle");
              return false;
            }
          } else {
            this.$vux.alert.show({
              title: "提示",
              content: `企业已开通"保价运输"请输入此次运输货值！`,
            });
            return false;
          }
        }

        if (
          this.existsAvaibleOilStation == 1 &&
          !this.isEmptyStr(this.prepaymentsBuyOil)
        ) {
          this.prepaymentsBuyOil = this.trim(this.prepaymentsBuyOil);
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.prepaymentsBuyOil)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的线下油款金额！",
            });
            //this.$vux.toast.text("无效的线下油款金额！", "middle");
            return false;
          } else {
            if (Number(this.prepaymentsBuyOil) > Number(this.maxAllFreight)) {
              this.$vux.alert.show({
                title: "提示",
                content: "线下油款不能超过最大金额！",
              });
              //this.$vux.toast.text("线下油款不能超过最大金额！", "middle");
              return false;
            }
          }
        }

        //线下路桥费配置existsAvaibleEtcStation
        if (
          this.existsAvaibleEtcStation == 1 &&
          !this.isEmptyStr(this.prepaymentsBuyEtc)
        ) {
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          this.prepaymentsBuyEtc = this.trim(this.prepaymentsBuyEtc);
          if (!regExp.test(this.prepaymentsBuyEtc)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的线下路桥费金额！",
            });
            //this.$vux.toast.text("无效的线下路桥费金额！", "middle");
            return false;
          }
        }

        //线下气款配置existsAvaibleGasStation
        if (
          this.existsAvaibleGasStation == 1 &&
          !this.isEmptyStr(this.prepaymentsBuyGas)
        ) {
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          this.prepaymentsBuyGas = this.trim(this.prepaymentsBuyGas);
          if (!regExp.test(this.prepaymentsBuyGas)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的线下气款金额！",
            });
            //this.$vux.toast.text("无效的线下气款金额！", "middle");
            return false;
          }
        }
        //预付油卡、预付ETC、判断
        if (this.oilCardCfg == "8") {
          if (
            this.existsAvaibleOilStation == 0 &&
            subtract(
              this.prepaymentsOilCard,
              multiply(
                this.d(this.f(this.allFreight, 0), this.freightIncr),
                this.oilCardPayUpperCfg
              )
            ) > 0
          ) {
            this.$vux.alert.show({
              title: "提示",
              content: "请确认，预付油卡金额不能大于设置的上限。",
            });

            return false;
          }
          // 预付油卡金额加上线下油款金额不能大于运费金额*油卡支付上限
          if (
            subtract(
              add(this.prepaymentsOilCard, this.prepaymentsBuyOil),
              multiply(
                this.d(
                  this.d(this.f(this.allFreight, 0), this.freightIncr),
                  this.prepaymentsBuyOil
                ),
                this.oilCardPayUpperCfg
              )
            ) > 0
          ) {
            this.$vux.alert.show({
              title: "提示",
              content:
                "请确认，预付油卡金额加上线下油款金额不能大于设置的上限。",
            });
            return false;
          }
        }
        // 企业累计线下油款不能大于累计购油未开票余额
        if (
          subtract(
            add(this.prepaymentsBuyOil, this.yetPrepaymentsBuyOil),
            this.yetBuyOilNotInvoice
          ) > 0
        ) {
          this.$vux.alert.show({
            title: "提示",
            content: "请确认，企业累计线下油款不能大于累计购油未开票余额。",
          });
          return false;
        }

        if (
          subtract(
            add(this.prepaymentsBuyEtc, this.yetPrepaymentsBuyEtc),
            this.yetBuyEtcNotInvoice
          ) > 0
        ) {
          this.$vux.alert.show({
            title: "提示",
            content: "请确认，企业累计线下路桥费不能大于累计路桥费未开票余额。",
          });
          return false;
        }

        if (
          subtract(
            add(this.prepaymentsBuyGas, this.yetPrepaymentsBuyGas),
            this.yetBuyGasNotInvoice
          ) > 0
        ) {
          this.$vux.alert.show({
            title: "提示",
            content: "请确认，企业累计线下气款不能大于累计气款未开票余额。",
          });
          return false;
        }
        //预付、回单付 都点击的情况
        if (!this.isEmptyStr(this.backFee)) {
          this.backFee = this.trim(this.backFee);
          this.allFreight = this.trim(this.allFreight);
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.backFee)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的回单押金金额！",
            });
            return false;
          }
          if (!this.isEmptyStr(this.allFreight)) {
            if (Number(this.backFee) > Number(this.allFreight)) {
              this.$vux.alert.show({
                title: "提示",
                content: "回单押金不能大于运费金额！",
              });
              return false;
            }
          }
          if (Number(this.backFee) > Number(this.maxAllFreight)) {
            this.$vux.alert.show({
              title: "提示",
              content: "回单押金不能超过最大运费金额！",
            });
            return false;
          }
        }

        if (
          (this.goodsInsuranceCfg == 8 && this.items1Value == 0) ||
          this.orgAttr == 2
        ) {
          let regexp = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
          this.goodsCost = this.trim(this.goodsCost);
          if (!this.isEmptyStr(this.goodsCost)) {
            if (!regexp.test(this.goodsCost)) {
              //（货值最小一万, 最大五百万）
              this.$vux.toast.text("货值输入不合法！", "middle");
              return false;
            }
          } else {
            this.$vux.toast.text("货值必填！", "middle");
            return false;
          }
        }
        if (
          this.d(
            this.prepaymentsEtcCard,
            this.d(
              this.prepaymentsOilCard,
              this.d(this.prepayments, this.backFee)
            )
          ) > this.d(this.f(this.allFreight, 0), this.freightIncr)
        ) {
          if (this.oilCardCfg == "8" && this.etcCardCfg == "8") {
            this.$vux.alert.show({
              title: "提示",
              content:
                "请确认，预付油卡加上预付现金加上回单押金必须要小于等于运费金额。",
            });
          } else if (this.oilCardCfg == "8" && this.etcCardCfg == "9") {
            this.$vux.alert.show({
              title: "提示",
              content:
                "请确认，预付油卡加上预付现金加上回单押金必须要小于等于运费金额。",
            });
          } else if (this.oilCardCfg == "9" && this.etcCardCfg == "8") {
            this.$vux.alert.show({
              title: "提示",
              content: "请确认，预付现金加上回单押金必须要小于等于运费金额。",
            });
          } else {
            this.$vux.alert.show({
              title: "提示",
              content: "请确认，预付现金加上回单押金必须要小于等于运费金额。",
            });
          }
          return false;
        }
        //点击了回单付
        //只有回单押金
        if (!this.isEmptyStr(this.backFee)) {
          this.backFee = this.trim(this.backFee);
          this.allFreight = this.trim(this.allFreight);
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.backFee)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的回单押金金额！",
            });
            return false;
          }
          if (!this.isEmptyStr(this.allFreight)) {
            if (Number(this.backFee) > Number(this.allFreight)) {
              this.$vux.alert.show({
                title: "提示",
                content: "回单押金不能大于运费金额！",
              });
              return false;
            }
          }
          if (Number(this.backFee) > Number(this.maxAllFreight)) {
            this.$vux.alert.show({
              title: "提示",
              content: "回单押金不能超过最大运费金额！",
            });
            return false;
          }
        }

        //定金、推广费、应收回款 deposit promotionFee receivablePayback
        if (!this.isEmptyStr(this.deposit)) {
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.deposit)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的定金！",
            });
            return false;
          }
        }
        if (!this.isEmptyStr(this.promotionFee)) {
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.promotionFee)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的推广费！",
            });
            return false;
          }
        }
        if (!this.isEmptyStr(this.receivablePayback)) {
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.receivablePayback)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的应收回款！",
            });
            return false;
          }
        }

        if (this.driverFinanceJudge() == false) {
          return false;
        }

        if (
          !this.isEmptyStr(this.weyBillFirst.startProvinceCode) &&
          !this.isEmptyStr(this.weyBillFirst.endProvinceCode) &&
          !this.isEmptyStr(this.weyBillFirst.startCityCode) &&
          !this.isEmptyStr(this.weyBillFirst.endCityCode) &&
          !this.isEmptyStr(this.allFreight)
        ) {
          //建单运费判断
          if (!this.successFlag) return false;
          this.success();
        }
      }
    },
    success() {
      var _this = this;
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      this.successFlag = 0;
      var json = {
        fromProvId: this.weyBillFirst.startProvinceCode, //起运省份ID
        toProvId: this.weyBillFirst.endProvinceCode, //目的省份ID
        fromCityId: this.weyBillFirst.startCityCode, //起运城市ID
        toCityId: this.weyBillFirst.endCityCode, //目的城市ID
        allFreight: this.allFreight, //运输总价
      };
      if (this.modelRadio === "2") {
        json.allFreight = this.allFreight_2;
      }
      checkFee(json)
        .then((res) => {
          if (res.data.reCode == "0") {
            if (_this.modelRadio === "2") {
              _this.gotoBuild();
            } else {
              if (
                this.reciveMsgPay.acctType == "5" ||
                this.reciveMsgPay.acctType == "6" ||
                this.reciveMsgPay.reciveBank == ""
              ) {
                _this.oilCardCheck();
              } else {
                _this.informationEntry();
              }
            }
          } else {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.successFlag = 1;
            if (res.data.reCode == "1") {
              //走confirm
              this.$vux1.confirm.show({
                title: "提示",
                content: res.data.reInfo,
                confirmText: "确认",
                cancelText: "取消",
                onConfirm: () => {
                  if (_this.modelRadio === "2") {
                    _this.gotoBuild();
                  } else {
                    //点击确定去建单
                    if (
                      this.reciveMsgPay.acctType == "5" ||
                      this.reciveMsgPay.acctType == "6" ||
                      this.reciveMsgPay.reciveBank == ""
                    ) {
                      _this.oilCardCheck();
                    } else {
                      _this.informationEntry();
                    }
                  }
                },
              });
            } else {
              this.$vux.toast.text(
                "抱歉,您录入的数据不合法,请核实后重试！",
                "middle"
              );
            }
          }
        })
        .catch((err) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
    },
    informationEntry() {
      let json = {
        mobileNo: this.weyBillSecond.mobileNo,
        payeeBankNo: this.reciveMsgPay.recivePersonBankNum, //收款人银行卡号
        payeeName: this.reciveMsgPay.recivePersonName, //收款人姓名
        payeeBankName: this.reciveMsgPay.reciveBank, //收款人银行名称
        payeeProvinceId: this.reciveMsgPay.provinceId, //开户行省份id
        payeeCityId: this.reciveMsgPay.cityId, //开户行城市id
        payeeIdCard: this.reciveMsgPay.recivePersonCardNum, //收款人身份证
        payeeMobileNo: this.reciveMsgPay.recivePersonphoneNum, //收款人手机号
        alipayNo: this.reciveMsgPay.alipayNo, //收款人支付宝
      };
      if (
        json.mobileNo != "" &&
        json.payeeBankNo != "" &&
        json.payeeName != "" &&
        json.payeeBankName != "" &&
        json.payeeProvinceId != "" &&
        json.payeeCityId != "" &&
        json.payeeIdCard != "" &&
        json.payeeMobileNo != ""
      ) {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        infoEntry(json)
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.oilCardCheck();
          })
          .catch((err) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
          });
      } else {
        this.oilCardCheck();
      }
    },
    //油卡验证接口
    oilCardCheck() {
      //油卡配置开通了要去验证油卡
      if (this.oilCardCfg == "8") {
        let _that = this;
        let json = {
          prepaymentsOilCard: this.prepaymentsOilCard,
          cartBadgeNo: this.weyBillSecond.cartBadgeNo,
          belongActSys: this.belongActSys,
          oilCardNo: this.oilCardNo,
        };
        oilCardCheck(json)
          .then((res) => {
            if (res.data.reCode == "0") {
              _that.gotoBuild();
            } else {
              this.successFlag = 1;
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.alert.show({
                title: "提示",
                buttonText: "知道了",
                content: res.data.reInfo,
              });
            }
          })
          .catch((err) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
          });
      } else {
        this.gotoBuild();
      }
    },
    // 建单之前的验证
    validation() {
      this.$store.commit("updateLoadingStatus", { isLoading: false });
      let telReg = /^1\d{10}$/;
      if (!telReg.test(this.weyBillSecond.mobileNo)) {
        this.$vux.toast.text("司机手机号码输入错误！", "middle");
        return false;
      }
      if (!this.weyBillSecond.driverName) {
        this.$vux.toast.text("司机姓名不能为空！", "middle");
        return false;
      }
      if (
        this.loginState == "0" &&
        this.orgCfg718 !== "49" &&
        Array.isArray(this.weyBillFirst.drawee)
      ) {
        this.$vux.toast.text("请重新选择受票方！", "middle");
        return false;
      }
      if (
        this.isEmptyStr(this.weyBillFirst.startProvinceCode) ||
        this.isEmptyStr(this.weyBillFirst.endProvinceCode) ||
        this.isEmptyStr(this.weyBillFirst.startCityCode) ||
        this.isEmptyStr(this.weyBillFirst.endCityCode)
      ) {
        this.$vux.toast.text("城市数据不正确！请重新选择", "middle");
        return false;
      }
      return true;
    },
    //建单接口
    gotoBuild() {
      // 方式前面页面信息丢失，再加已有的验证
      if (!this.validation()) {
        return;
      }
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let transTrip, startTime;
      if (this.weyBillFirst.billCycleMode != 8) {
        transTrip = "";
      } else {
        transTrip = this.weyBillFirst.transTrip;
      }
      if (this.weyBillFirst.startTime.length == 0) {
        startTime = "";
      } else {
        startTime = this.weyBillFirst.startTime.replace(/\//g, "-");
      }
      let json = {
        taxDraweePartyId:
          this.loginState != 0 ? "" : this.weyBillFirst.taxDraweePartyId, //受票方ID
        note: this.weyBillSecond.note, //备注
        taxWaybillNo: this.weyBillFirst.taxWaybillNo, //运单号
        cartLength: parseFloat(this.weyBillSecond.carLength) + "", //车长
        goodsAmount: this.weyBillFirst.goodsAmount, //货物数量
        prepaymentsOilCard: this.prepaymentsOilCard, //预付油卡
        cityId:
          this.zyCapitalCfg === "8" && reciveType == "好运宝收款"
            ? ""
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBank == "好运宝钱包"
              ? "701"
              : this.reciveMsgPay.reciveBankAdress[1]
            : "", //开户行城市
        allFreight: this.allFreight, //运费
        endProvinceId: this.weyBillFirst.endProvinceCode,
        backFee: this.backFee, //回单押金
        payType: "", //正常的收款人类型
        alipayNo:
          this.zyCapitalCfg === "8" && reciveType == "好运宝收款"
            ? window.sessionStorage.isChooseType === "2"
              ? window.localStorage.getItem("alipayNo")
              : this.$route.query.alipayNo
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.alipayNo
            : "", //收款人支付宝账号
        payIdCard:
          this.zyCapitalCfg === "8" && reciveType == "好运宝收款"
            ? this.weyBillSecond.idCard
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonCardNum
            : "", //收款人身份证
        hkbPayeeType: "", //回款宝收款人类型
        isBuyInsurance: this.items1Value, //是否购买保险
        prepaymentsBuyGas: this.prepaymentsBuyGas, //线下气款
        cartType: this.weyBillSecond.carType, //车型
        cartTonnage: parseFloat(this.weyBillSecond.carTonNumber) + "", //吨位
        startTime: this.weyBillFirst.startTime, //起运时间
        transTrip: transTrip, //运输趟次
        goodsCost:
          (this.goodsInsuranceCfg == "8" && this.items1Value == 0) ||
          this.orgAttr == "2"
            ? this.goodsCost
            : this.priceInsuranceCfg == "8"
            ? this.goodsCost
            : "", //货值 上传条件修改
        payBankNo:
          this.zyCapitalCfg === "8" && reciveType == "好运宝收款"
            ? window.sessionStorage.isChooseType === "2"
              ? window.localStorage.getItem("bankNum")
              : this.weyBillSecond.payBankNo
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonBankNum
            : "", //收款人银行卡号
        cartBadgeNo: this.weyBillSecond.cartBadgeNo, //司机车牌号
        goodsName: this.weyBillFirst.goodsName, //货物名称
        payName:
          this.zyCapitalCfg === "8" && reciveType == "好运宝收款"
            ? window.sessionStorage.isChooseType === "2"
              ? window.localStorage.getItem("driverName")
              : this.weyBillSecond.payName
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonName
            : "", //收款人姓名
        startCountyId: this.weyBillFirst.startCountyCode,
        unitPrice: this.weyBillFirst.unitPrice, //单价
        endCityId: this.weyBillFirst.endCityCode,
        prepaymentsBuyEtc: this.prepaymentsBuyEtc, //线下路桥费
        prepaymentsBuyOil: this.prepaymentsBuyOil, //线下油款
        wbItem: this.weyBillFirst.wbItem, //业务项目
        startProvinceId: this.weyBillFirst.startProvinceCode,
        oilCardNo: this.oilCardNo,
        mobileNo: this.weyBillSecond.mobileNo, //司机手机号
        payBankName:
          this.zyCapitalCfg === "8" && reciveType == "好运宝收款"
            ? window.sessionStorage.isChooseType === "2"
              ? window.localStorage.getItem("bankName")
              : this.weyBillSecond.payBankName
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBank == "好运宝钱包"
              ? "浙江网商银行"
              : this.reciveMsgPay.reciveBank
            : "", //收款银行名称
        provinceId:
          this.zyCapitalCfg === "8" && reciveType == "好运宝收款"
            ? ""
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBank == "好运宝钱包"
              ? "7"
              : this.reciveMsgPay.reciveBankAdress[0]
            : "", //开户行省份
        goodsAmountType: this.weyBillFirst.goodsAmountType.key, //货物数量类型
        endCountyId: this.weyBillFirst.endCountyCode,
        startCityId: this.weyBillFirst.startCityCode,
        payMobileNo:
          this.zyCapitalCfg === "8" && reciveType == "好运宝收款"
            ? this.weyBillSecond.mobileNo
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonphoneNum
            : "", //收款人手机号
        tranRequire: this.weyBillFirst.requirement, //运输要求
        driverName: this.weyBillSecond.driverName, //司机姓名
        prepayments: this.prepayments, //预付现金
        drawee: this.loginState != 0 ? "" : this.weyBillFirst.drawee, //受票方名称
        carrierProject:
          this.report003Cfg == "3" ? this.weyBillFirst.carrierProject[0] : "", //承运项目
        deposit: this.depositCfg == "8" ? this.deposit : "", //定金
        promotionFee: this.promotionFeeCfg == "8" ? this.promotionFee : "", //推广费
        receivablePayback:
          this.receivablePaybackCfg == "8" ? this.receivablePayback : "", //应收回款
        wbBusinessType: this.wbBusinessType || "",
        goodsId: this.goodsId,
        supplierOrgName: this.weyBillFirst.fahuoName, // 发货方名称
        supplierOrgId: this.weyBillFirst.fahuoId, // 发货方ID
        extassistType: this.orgCfg718 === "49" ? "2" : "", // 2代表德邦外协
        wbMode: this.orgCfg718 === "49" ? "1" : "",
        updwOrgid: this.weyBillFirst.fahuoId,
        updwFreight:
          this.orgCfg718 === "49"
            ? parseFloat(this.weyBillFirst.recvFreight).toFixed(2) || "1.00"
            : "",
        relatedShipper: this.weyBillFirst.relatedShipper, // 关联货主
      };
      // 收款方式
      let advancePayState = this.modelRadio === "2" ? "1" : "0";
      let reciveType;
      if (advancePayState === "0") {
        reciveType = this.$refs.reciver_0.getReciveType();
      } else {
        reciveType = this.$refs.reciver_1.getReciveType();
      }
      // 收款人信息
      let reciveJson = {};
      if (this.modelRadio === "2") {
        json.allFreight = this.allFreight_2;
        json.prepaymentsOilCard = this.prepaymentsOilCard_2;
        json.oilCardNo = this.oilCardNo_2;
        json.arrivePay = this.arrivePay_2;
        json.payType = "1";

        json.payIdCard = this.carTeamInfo.payeeIdCard;
        json.payBankName = this.carTeamInfo.payeeBankName;
        json.payBankNo = this.carTeamInfo.payeeBankNo;
        json.payMobileNo = this.carTeamInfo.mobileNo;
        json.provinceId = this.carTeamInfo.payeeProvinceId;
        json.cityId = this.carTeamInfo.payeeCityId;
        json.payName = this.carTeamInfo.payeeName;
        json.alipayNo = this.carTeamInfo.alipayNo;
        json.prepayments = this.prepayments_2;
        json.backFee = this.backFee_2;
        json.deposit = "";
        json.promotionFee = "";
        json.receivablePayback = "";
      } else if (this.zyCapitalCfg === "8" && reciveType == "好运宝收款") {
        // 好运宝收款
        reciveJson = {
          payName: this.weyBillSecond.payName,
          payIdCard: this.weyBillSecond.idCard,
          payBankName: this.weyBillSecond.payBankName,
          payBankNo: this.weyBillSecond.payBankNo,
          payMobileNo: this.weyBillSecond.mobileNo,
          provinceId: "",
          cityId: "",
          alipayNo: this.weyBillSecond.alipayNo,
        };
      } else {
        // 正常收款
        reciveJson = {
          payName: this.reciveMsgPay.recivePersonName,
          payIdCard: this.reciveMsgPay.recivePersonCardNum,
          payBankName: this.reciveMsgPay.reciveBank,
          payBankNo: this.reciveMsgPay.recivePersonBankNum,
          payMobileNo: this.reciveMsgPay.recivePersonphoneNum,
          provinceId: this.reciveMsgPay.provinceId || "",
          cityId: this.reciveMsgPay.cityId || "",
          alipayNo: this.reciveMsgPay.alipayNo,
        };
        // 为了兼容默认store
        if (this.reciveMsgPay.reciveBank instanceof Array) {
          reciveJson.payBankName = "";
        }
        if (this.reciveMsgPay.reciveBankAdress instanceof Array) {
          reciveJson.reciveBankAdress = "";
        }

        if (this.reciveMsgPay.reciveBank == "好运宝钱包") {
          // 特殊处理改为浙江网商银行
          reciveJson.payBankName = "浙江网商银行";
          reciveJson.provinceId = "7";
          reciveJson.cityId = "701";
        }
      }
      Object.assign(json, reciveJson);
      // payType、hkbPayeeType
      let configJson = {
        reciveType: reciveType,
        recivePersonName: json.payName,
        driverName: json.driverName,
        advancePayState: advancePayState,
        zyCapitalCfg: this.zyCapitalCfg,
      };
      let { payType, hkbPayeeType } = getPayTypeAndHkbPayeeType(configJson);
      json.payType = payType;
      json.hkbPayeeType = hkbPayeeType;

      json.advancePayState = this.modelRadio === "2" ? "1" : "0";
      json.wbBusinessType = this.wbBusinessType || "";
      json.goodsId = this.goodsId;
      console.log(json);

      // 德邦外协走派单接口
      if (this.orgCfg718 === "49") {
        waixieDeliverWaybill(json)
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.successFlag = 1;
            if (res.data.reCode == 0) {
              try {
                MtaH5.clickStat("xinjianyundanlo", { waybillstep3: "true" });
              } catch (error) {
                JSON.stringify(error);
              }
              window.localStorage.clear();
              this.$router.push({
                path: "/wayBillSuccess",
                query: {
                  taxWaybillId: res.data.result.taxWaybillId,
                  mobileNo: this.weyBillSecond.mobileNo,
                  driverName: this.weyBillSecond.driverName,
                  cartBadgeNo: this.weyBillSecond.cartBadgeNo,
                  wbBusinessType: this.wbBusinessType,
                },
              });
            } else {
              this.$vux.alert.show({
                title: "提示",
                buttonText: "知道了",
                content: res.data.reInfo,
              });
            }
          })
          .catch((err) => {
            this.successFlag = 1;
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
          });
      } else {
        success(json)
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.successFlag = 1;
            if (res.data.reCode == 0) {
              try {
                MtaH5.clickStat("xinjianyundanlo", { waybillstep3: "true" });
              } catch (error) {
                JSON.stringify(error);
              }
              window.localStorage.clear();
              this.$router.push({
                path: "/wayBillSuccess",
                query: {
                  taxWaybillId: res.data.result.taxWaybillId,
                  mobileNo: this.weyBillSecond.mobileNo,
                  driverName: this.weyBillSecond.driverName,
                  cartBadgeNo: this.weyBillSecond.cartBadgeNo,
                  wbBusinessType: this.wbBusinessType,
                },
              });
            } else {
              this.$vux.alert.show({
                title: "提示",
                buttonText: "知道了",
                content: res.data.reInfo,
              });
            }
          })
          .catch((err) => {
            this.successFlag = 1;
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
          });
      }
    },
    //油款,气款,路桥费 等计算方法
    f(s, r) {
      var q, p, o, u;
      try {
        q = s.toString().split(".")[1].length;
      } catch (t) {
        q = 0;
      }
      try {
        p = r.toString().split(".")[1].length;
      } catch (t) {
        p = 0;
      }
      o = Math.pow(10, Math.max(q, p));
      u = q >= p ? q : p;
      return parseFloat(((s * o - r * o) / o).toFixed(u));
    },
    d(r, q) {
      var p, o, n;
      try {
        p = r.toString().split(".")[1].length;
      } catch (s) {
        p = 0;
      }
      try {
        o = q.toString().split(".")[1].length;
      } catch (s) {
        o = 0;
      }
      n = Math.pow(10, Math.max(p, o));
      return parseFloat(((r * n + q * n) / n).toFixed(Math.max(p, o)));
    },
    //自定义去前后空格的方法
    trim: function (i) {
      //   return i.toString().replace(/(^\s*)|(\s*$)/g, "");
      return i.toString().replace(/\s/g, "");
    },
    //非空验证通用方法
    isEmptyStr: function (str) {
      var pat = /^[\s]*$/;
      if (undefined == str || "" == str || null == str || pat.test(str)) {
        return true;
      }
      return false;
    },
    /**
     * 司机金融1.1新加逻辑
     */
    driverFinanceJudge() {
      if (this.driverFinanceCfg == "8") {
        let allFreightRate = parseFloat(
          this.driverFinanceProportionCfg * this.allFreight
        ).toFixed(2);
        let prepaymentsOilCardRate = parseFloat(
          this.oilCardPayUpperCfg * this.allFreight
        ).toFixed(2);
        /**
         * toPercent(a) 小数转换成百分比
         */
        if (Number(this.prepaymentsOilCard) > prepaymentsOilCardRate) {
          this.$vux.alert.show({
            title: "提示",
            content: `您输入的预付油卡金额超过运费的${this.toPercent(
              this.oilCardPayUpperCfg
            )}，请重新输入！`,
          });
          return false;
        }
        if (Number(this.driverFinanceProportionCfg) != 1) {
          if (this.isEmptyStr(this.backFee) || Number(this.backFee) <= "0") {
            this.$vux.alert.show({
              title: "提示",
              content: "请输入回单押金！",
            });
            return false;
          }
          if (Number(this.arrivePay) > allFreightRate) {
            this.$vux.alert.show({
              title: "提示",
              // content: `您输入的到付款金额超过运费的${this.toPercent(this.driverFinanceProportionCfg)}，请重新输入！`
              content: "您输入的到付款&回单押金金额不合规，请重新输入！",
            });
            return false;
          }
          if (Number(this.arrivePay) <= "0") {
            this.$vux.alert.show({
              title: "提示",
              content: "到付金额必须大于0！",
            });
            return false;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    // 小数转换百分比
    toPercent: function (point) {
      var str = Number(point * 100).toFixed(2);
      str += "%";
      return str;
    },
  },
};
</script>
<style lang="less">
.settlement-info {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .group0 .weui-cells {
    margin-top: 0px !important;
  }
  .radio-container {
    background-color: #fff;
    padding-top: 10px;
    padding-left: 20px;
    font-size: 15px;
    .vertical-line {
      display: inline-block;
      width: 2px;
      height: 0.8em;
      background: #15499a;
      margin-right: 4px;
    }
    .radio-group {
      padding: 5px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 16px;
      @media screen and (max-width: 320px) {
        font-size: 12px;
      }
      .van-radio {
        margin-right: 10px;
      }
      .van-radio__label {
        margin-left: 5px;
      }
      .checked {
        .van-radio__label {
          color: #15499a;
        }
      }
      .iconwenhao {
        color: #ffba00;
      }
    }
  }
  .img1 {
    width: 8px;
    height: 8px;
  }
  .img2 {
    width: 15px;
    height: 15px;
  }
  .weui-cell {
    @media screen and (max-width: 320px) {
      font-size: 14px;
    }
  }
  //   .weui-cell__hd {
  //     color: #797979;
  //     -webkit-text-fill-color: #797979;
  //   }
  .button {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    // background: #fff;
    z-index: 10;
  }
  .weui-btn_primary {
    background-color: #15499a !important;
    margin: 10px auto;
    width: 90% !important;
  }
  #left {
    border-left: 4px solid #15499a;
    position: absolute;
    left: 0;
  }
  .demo1-item {
    border: 1px solid #ececec;
    padding: 5px 5px;
    border-radius: 19px;
    text-align: center;
    width: 25%;
  }
  .demo1-item-selected {
    color: #fff;
    background: #1581cf;
  }
  .selected {
    color: #1581cf;
  }
  .weui-cell:before {
    left: 0px;
  }
  .weui-cell:first-child:before {
    display: inline;
  }
  .weui-cell_access .weui-cell__ft {
    text-align: left;
    width: 60%;
    color: #202020;
  }
  .group1 {
    .weui-cell_access .weui-cell__ft {
      text-align: right;
      width: 100%;
      color: #757575;
    }
  }
}
</style>
