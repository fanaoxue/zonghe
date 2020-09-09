<template>
  <div class="web-recive-msg" v-show="pageShow">
    <c-header>
      <x-header :left-options="{ backText: '' }">填写收款信息</x-header>
    </c-header>
    <group label-width="6.5em" label-margin-right="0.2em" label-align="right">
      <cell
        title="收款人类型："
        value-align="left"
        @click.native="typeChange()"
        v-show="zyCapitalCfg !== '8'&&hybWalletCfg !== '8'"
        is-link
      >
        <span :class="{ 'cell-left-style': recivePersonType !== '请选择收款人类型' }">{{ recivePersonType }}</span>
      </cell>
      <x-input
        title="收款人姓名："
        :show-clear="false"
        type="text"
        v-model.trim="reciveMsgs.recivePersonName"
        :disabled="cantIptFlag === 1 ? true : false"
        placeholder="请填写收款人姓名"
        :class="cantIptFlag === 1 ? 'textColor1' : 'textColor2'"
      >
        <div slot="right" @click="historyBtnClick()">
          <!-- <img class="history-img-style" src="../../assets/imgs/wbs/history.png" alt /> -->
          <div class="usually-receive-people">常用收款人</div>
        </div>
      </x-input>
      <x-input
        title="身 份 证 号："
        :max="18"
        :disabled="cantIptFlag === 1 ? true : false"
        v-model.trim="reciveMsgs.recivePersonCardNum"
        placeholder="请输入收款人身份证号码"
        type="text"
        :class="cantIptFlag ? 'textColor1' : 'textColor2'"
      ></x-input>
      <x-input
        title="银 行 卡 号："
        :disabled="cantIptFlag === 1 ? true : false"
        type="tel"
        v-model.trim="reciveMsgs.recivePersonBankNum"
        placeholder="请输入银行卡号"
        @on-blur="checkBankName()"
        :class="cantIptFlag ? 'textColor1' : 'textColor2'"
      ></x-input>
      <popup-picker
        title="收 款 银 行："
        :disabled="cantIptFlag === 1 ? true : false"
        :data="bankList"
        v-model.trim="reciveMsgs.reciveBank"
        placeholder="请选择收款银行"
        :class="cantIptFlag ? 'textColor1' : 'textColor2'"
      ></popup-picker>
      <x-input
        title="联 系 手 机："
        ref="PhoneNumber"
        :disabled="cantIptFlag === 1 ? true : false"
        :max="11"
        is-type="china-mobile"
        type="tel"
        v-model.trim="reciveMsgs.recivePersonphoneNum"
        placeholder="请输入银行卡绑定的手机"
        :class="cantIptFlag ? 'textColor1' : 'textColor2'"
      ></x-input>
      <popup-picker
        title="开户行地址："
        :disabled="cantIptFlag === 1 ? true : false"
        :data="cityList"
        :columns="2"
        show-name
        v-model.trim="reciveMsgs.reciveBankAdress"
        @on-hide="endValue"
        @on-show="startValue"
        placeholder="请选择开户行地址"
        ref="picker"
        :class="cantIptFlag ? 'textColor1' : 'textColor2'"
      ></popup-picker>
      <!-- 此字段只对于开通了自保理的企业的快路宝账号,且此笔运单是本人收款时,显示"支付宝账号字段"(支付宝账号为必填项) -->
      <span v-show="zyCapitalCfg !== '8' && zblState == 1 && recivePersonType === '本人收款'">
        <!-- 自保理需求 -->
        <div class="vux-x-input weui-cell cell-before">
          <img
            src="../../assets/imgs/wbs/bitian_icon@2x.png"
            width="8"
            height="8"
            style="font-size:20px;vertical-align:middle;"
            class="img1"
          />
          <div
            class="title"
            style="color:#797979;width: 6.5em;text-align: right;margin-right: 0.2em;"
          >支付宝账号：</div>
          <checker v-model.trim="jiedanState" @on-change="changeType">
            <checker-item value="1" style="margin-left:1em;">
              <img
                :src="src1"
                alt
                width="15"
                height="15"
                style="vertical-align: middle;"
                class="img2"
              />
              <span style="vertical-align: middle;margin-left:0.5em;">接单手机号</span>
            </checker-item>
          </checker>
        </div>
        <x-input
          v-model.trim="reciveMsgs.alipayNo"
          @on-change="mobileChange"
          placeholder="非接单手机号，请输入支付宝账号"
        ></x-input>
      </span>
    </group>
    <div style="height:82px;"></div>
    <div class="sue-btn-cxt">
      <!--  v-show="this.yundanState != '1' "-->
      <x-button
        type="primary"
        style="width:90%;height:48px;background-color:#15499A"
        @click.native="suerBtnClick()"
      >{{ btn_text }}</x-button>
      <div class="clear-msg" @click="rightBtnClick()" v-show="cantIptFlag == 1">清空收款信息</div>
    </div>
    <!-- 收款人类型 actionsheet-->
    <actionsheet v-model="receiveTypeState" :menus="menus1" @on-click-menu="personTypeBtn"></actionsheet>
    <!-- 收款记录查询列表  popup-->
    <popup v-model="receiveState" position="bottom" max-height="80%" @on-show="reciveHistoryAjax()">
      <popup-header
        left-text
        right-text="手动输入"
        @on-click-left="receiveState = false"
        @on-click-right="rightBtnClick()"
        title="选择收款信息"
      ></popup-header>
      <div
        v-show="receiveStateWaiting === 0"
        style="width:100%;text-align:center;padding:16px 0px;"
      >
        <spinner type="ios"></spinner>
        <div style="color:#454545;height:32px;line-height:32px;">数据加载中...</div>
      </div>
      <div v-show="receiveStateWaiting === 1" class="recive-history-cxt">
        <div class="recive-title-style">
          当前共有
          <span>{{ reciveHistoryList.length }}条</span>支付记录
        </div>
        <div
          class="recive-list-cxt"
          @click="reciveHistoryFlag = index"
          v-for="(item, index, key) in reciveHistoryList"
          :key="key"
          :class="{ 'recive-list-cxt-active': reciveHistoryFlag === index }"
        >
          <div class="list-item-cxt">
            <div class="left">收款人姓名：</div>
            <div class="right">{{ item.payeeName }}</div>
            <div class="right" v-show="item.acctType == '5'">
              <img
                src="../../assets/imgs/wbs/qianbao_icon@2x.png"
                width="16px"
                alt
                style="width: 16px;margin-left: 6px;"
              />
            </div>
            <div class="carMaster" v-show="item.acctType == '6'">车队钱包</div>
          </div>
          <div class="list-item-cxt">
            <div class="left">收 款 银 行：</div>
            <div class="right">{{ item.payeeBankName }}</div>
          </div>
          <div class="list-item-cxt">
            <div class="left">开户行地址：</div>
            <div class="right">{{ item.payeeProvince }} {{ item.payeeCityName }}</div>
          </div>
          <div class="list-item-cxt">
            <div class="left">银 行 卡 号：</div>
            <div class="right">{{ item.payeeBankNo }}</div>
          </div>
          <div
            class="use-btn-style"
            v-show="reciveHistoryFlag === index"
            @click="historyBtnUse(item)"
          >使用</div>
        </div>
        <div style="height:32px;"></div>
      </div>
    </popup>
  </div>
</template>

<script>
import {
  getRecPayHistory,
  getBankList,
  gateCheckOfCardNum,
  zblState,
  buildWaybillAgain,
  getCompanyConfig
} from "../../api/api.js";
import { getIdCard, getBankName, infoEntry } from "../../api/applyPay.js";
import { getCookie } from "../../utils/getCookie.js";
import { cityDataToIWant } from "../../utils/cMethods";
import { dazongModifyWayBill } from "../../api/dazongapi.js";
import { AppFinish, receivePersonBack } from "../../utils/app.js";
export default {
  name: "webReciveMsg",
  data() {
    return {
      pageShow: false,
      initFlag: 0,
      receiveTypeState: false, // 收款人类型弹框状态
      receiveState: false, // 收款记录弹框展示状态
      receiveStateWaiting: 0,
      cityList: cityDataToIWant(city.data),
      recivePersonType: "请选择收款人类型",
      // reciveHistory: '选择收款信息',
      menus1: {
        menu1: "本人收款",
        menu2: "非本人收款"
      },
      reciveMsgs: {
        reciveType: "-1",
        recivePersonName: "", //收款人姓名
        recivePersonCardNum: "", //收款人身份证号
        recivePersonBankNum: "", //收款人银行卡号
        recivePersonphoneNum: "", //收款人手机号
        reciveBank: [], //收款人银行名称
        reciveBankAdress: [], //收款人银行地址
        alipayNo: "", //支付宝账号
        acctType: ""
      },
      reciveHistoryFlag: -1,
      reciveHistoryList: [],
      cantIptFlag: 0,
      bankList: [],
      getBankListFlag: 0,
      oldrecivePersonName: "",
      oldReciveType: "",
      oldPersonNum: "",
      isSureBtnClick: 0, // 用于用户绑定是否在填写信息操作了确认按钮，以记录用户是否完成了收款信息填写 0 默认未填写
      zblState: "", //自保理状态   0-未授信  1-已授信
      jiedanState: "", //接单手机还选中状态
      jiedanMobile: "", //司机接单手机号
      src1: require("../../assets/imgs/wbs/xuanze_icon@2x.png"),
      src3: require("../../assets/imgs/wbs/xuanze_icon@2x.png"),
      src4: require("../../assets/imgs/wbs/xuanzeselect_icon@2x.png"),
      zyCapitalCfg: "9", // 回款宝配置
      hybWalletCfg: "9", // 好运宝钱包配置
      collectionFlagCfg: "", //到付金收款方式
      autoShowWalletCfg: "",
      //大综0.5
      btn_text: "确定",
      classify: getCookie("classify"), //类别分类 0：大宗自有运单(不扫码建单) 1：大宗外协运单
      // classify: this.$route.query.classify,
      taxWaybillId: this.$route.query.taxWaybillId,
      driverMobileNo: this.$route.query.mobileNo,
      // yundanState:'0', //填写还是查看 0-填写 1-查看
      driverName: this.$route.query.driverName,
      cartBadgeNo: "",
      mobileNo: "",
      xid: ""
    };
  },
  beforeRouteLeave(to, from, next) {
    if (
      (this.hybWalletCfg == "8" && this.reciveMsgs.acctType == "5") ||
      window.sessionStorage.isChooseType === "1"
    ) {
      let updateOpions = {
        type: "reciveMsgPay",
        updatMsg: this.reciveMsgs
      };
      this.$store.commit("updateWayBillStatus", updateOpions);
    }
    next();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm._getCompanyConfig().then(() => {
        vm.getZblState();
      });
    });
  },
  computed: {
    reciveMsgPay() {
      return this.$store.state.wayBill.reciveMsgPay;
    },
    weyBillSecond() {
      return this.$store.state.wayBill.weyBillSecond;
    },
    //携带过来的回款宝配置
    weyBillThird() {
      return this.$store.state.wayBill.weyBillThird;
    },
    btnState() {
      this.reciveMsgs.recivePersonBankNum = this.trim(
        this.reciveMsgs.recivePersonBankNum
      );
      if (this.zyCapitalCfg == "8") {
        if (
          this.reciveMsgs.recivePersonName !== "" &&
          this.reciveMsgs.recivePersonCardNum.length === 18 &&
          this.reciveMsgs.recivePersonBankNum !== "" &&
          this.reciveMsgs.reciveBankAdress.length > 0 &&
          this.reciveMsgs.reciveBank.length > 0 &&
          this.reciveMsgs.recivePersonphoneNum.length === 11
        ) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (this.hybWalletCfg == "8") {
          if (
            this.reciveMsgs.recivePersonName != "" &&
            this.reciveMsgs.recivePersonCardNum.length == 18 &&
            this.reciveMsgs.recivePersonBankNum != "" &&
            this.reciveMsgs.reciveBankAdress.length > 0 &&
            this.reciveMsgs.reciveBank.length > 0 &&
            this.reciveMsgs.recivePersonphoneNum.length == 11
          ) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (
            this.reciveMsgs.reciveType != "-1" &&
            this.reciveMsgs.recivePersonName != "" &&
            this.reciveMsgs.recivePersonCardNum.length == 18 &&
            this.reciveMsgs.recivePersonBankNum != "" &&
            this.reciveMsgs.reciveBankAdress.length > 0 &&
            this.reciveMsgs.reciveBank.length > 0 &&
            this.reciveMsgs.recivePersonphoneNum.length == 11
          ) {
            return 1;
          } else {
            return 0;
          }
        }
      }
    }
  },
  created() {
    this.recivePersonType =
      this.reciveMsgPay.reciveType === "-1"
        ? "请选择收款人类型"
        : this.reciveMsgPay.reciveType === "1"
        ? "本人收款"
        : "非本人收款";
    this.reciveMsgs.reciveType = this.reciveMsgPay.reciveType;
    this.reciveMsgs.recivePersonName = this.reciveMsgPay.recivePersonName;
    this.reciveMsgs.recivePersonCardNum = this.reciveMsgPay.recivePersonCardNum;
    this.reciveMsgs.recivePersonBankNum = this.reciveMsgPay.recivePersonBankNum;
    this.reciveMsgs.recivePersonphoneNum = this.reciveMsgPay.recivePersonphoneNum;
    this.reciveMsgs.reciveBank = this.reciveMsgPay.reciveBank;
    this.reciveMsgs.reciveBankAdress = this.reciveMsgPay.reciveBankAdress;
    if (this.reciveMsgs.reciveBank[0] == "浙江网商银行") {
      this.reciveMsgs.reciveBank[0] = "好运宝钱包";
    }
    if (
      this.reciveMsgPay.reciveBank == "好运宝钱包" ||
      this.reciveMsgPay.reciveBank == "车队钱包" ||
      this.reciveMsgPay.reciveBank == "浙江网商银行"
    ) {
      this.cantIptFlag = 1;
    }
    if (this.classify == "0") {
      this.btn_text = "保存";
    }
  },
  mounted() {
    this.jiedanMobile =
      this.classify != 0 ? this.weyBillSecond.mobileNo : this.driverMobileNo;
  },
  methods: {
    // 3004自保理状态查询接口
    getZblState() {
      zblState()
        .then(resp => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (resp.data.reCode == "0") {
            this.zblState = resp.data.result.zblState; //自保理状态
            if (this.reciveMsgPay.reciveType == "1" && this.zblState == "1") {
              this.reciveMsgs.alipayNo = this.reciveMsgPay.alipayNo; //支付宝账号
            } else {
              this.reciveMsgs.alipayNo = "";
            }
            // 获取银行列表
            this.bankListAjax();
          } else {
            this.$vux.toast.text(resp.data.reInfo, "middle");
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    _getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let result = res.data.result;
              this.zyCapitalCfg = result.zyCapitalCfg;
              this.hybWalletCfg = result.hybWalletCfg;
              this.autoShowWalletCfg = result.autoShowWalletCfg;
              this.collectionFlagCfg = result.collectionFlagCfg; // 司机钱包&车队长钱包
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
    //输入银行卡号查询银行名称
    checkBankName() {
      //开通大综配置
      if (this.reciveMsgs.recivePersonBankNum.length > 12) {
        let bankNum = this.reciveMsgs.recivePersonBankNum;
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getBankName(bankNum)
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              this.reciveMsgs.reciveBank = [res.data.result];
            }
          })
          .catch(err => {
            this.reciveMsgs.reciveBank = [];
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
          });
      }
    },
    //支付宝账号输入变化
    mobileChange(val) {
      if (val == this.jiedanMobile) {
        //若收款人的支付宝账号和接单手机号一致时,可选中{接单手机号},即自动带出运单司机手机号
        this.src1 = this.src4;
        this.jiedanState = "1";
      } else {
        this.src1 = this.src3;
        this.jiedanState = "";
      }
    },
    startValue() {
      if (this.initFlag) {
        if (this.reciveMsgs.reciveBankAdress.length === 0) {
          this.reciveMsgs.reciveBankAdress = ["", ""];
        }
      }
    },
    endValue() {
      if (this.initFlag) {
        if (this.reciveMsgs.reciveBankAdress[0] === "") {
          this.reciveMsgs.reciveBankAdress = [];
        }
      }
    },
    personTypeBtn(key, items) {
      this.recivePersonType = items;
      this.clearMsg();
      this.cantIptFlag = 0;
      if (items === "本人收款") {
        if (this.classify != 0) {
          this.reciveMsgs.recivePersonName = this.weyBillSecond.driverName;
        } else {
          this.reciveMsgs.recivePersonName = this.driverName;
        }
        this.reciveMsgs.reciveType = "1";
        //如果选择了本人收款，则去带出身份证号码
        if (this.zblState != "1") {
          this.reciveMsgs.alipayNo = "";
        }
        this.chooseOneself();
      } else {
        this.reciveMsgs.recivePersonName = "";
        this.reciveMsgs.reciveType = "0";
        this.reciveMsgs.alipayNo = "";
      }
      this.initFlag = 1;
    },
    reciveHistoryAjax() {
      //通过比较前后两个变量是否相同，若相同则不请求收款记录
      if (
        this.trim(this.reciveMsgs.recivePersonName) != "" &&
        localStorage.getItem("oldrecivePersonName") ==
          this.reciveMsgs.recivePersonName &&
        localStorage.getItem("reciveType") == this.reciveMsgs.reciveType
      )
        return false;
      // let phoneNum = this.reciveMsgs.reciveType === '1' ? this.$store.state.wayBill.weyBillSecond.mobileNo : '';
      let phoneNum = this.weyBillSecond.mobileNo;
      localStorage.setItem("oldPersonNum", phoneNum);
      let json = {
        entType: "",
        mobileNo: this.mobileNo || phoneNum,
        payeeName: this.reciveMsgs.recivePersonName,
        hybWalletCfg: this.hybWalletCfg,
        taxWaybillId: this.taxWaybillId || "",
        autoShowWalletCfg: this.autoShowWalletCfg,
        advancePayState: "",
        cartBadgeNo: this.cartBadgeNo || this.weyBillSecond.cartBadgeNo,
        driverName:
          this.classify == "0"
            ? this.driverName || this.weyBillSecond.driverName
            : this.weyBillSecond.driverName
      };
      getRecPayHistory(json)
        .then(res => {
          localStorage.setItem(
            "oldrecivePersonName",
            this.reciveMsgs.recivePersonName
          );
          localStorage.setItem("oldReciveType", this.reciveMsgs.reciveType);
          if (res.data.reCode === "0") {
            try {
              MtaH5.clickStat("recive_pay_msg");
            } catch (error) {
              JSON.stringify(error);
            }
            this.receiveStateWaiting = 1;
            this.reciveHistoryList = res.data.result.payeeList;
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(error => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(error.message, "middle");
        });
    },
    historyBtnClick() {
      if (this.zyCapitalCfg == "8") {
        if (this.reciveMsgs.recivePersonName === "") {
          this.$vux.toast.text("请输入收款人姓名查询", "middle");
          return false;
        }
      } else {
        if (this.reciveMsgs.recivePersonName === "") {
          this.$vux.toast.text("请选择收款类型和输入姓名查询", "middle");
          return false;
        }
      }
      this.receiveState = true;
    },
    clearMsg() {
      if (this.hybWalletCfg == "8") {
        this.reciveMsgs.recivePersonName = "";
      }
      this.cityList = "";
      this.cityList = cityDataToIWant(city.data);
      this.reciveMsgs.recivePersonCardNum = "";
      this.reciveMsgs.recivePersonphoneNum = "";
      this.reciveMsgs.reciveBank = [];
      this.reciveMsgs.recivePersonBankNum = "";
      this.reciveMsgs.reciveBankAdress = [];
    },
    rightBtnClick() {
      this.clearMsg();
      this.cantIptFlag = 0;
      this.receiveState = false;
    },
    historyBtnUse(item) {
      this.receiveState = false;
      if (item.acctType == "5") {
        this.reciveMsgs.acctType = "5";
        this.cantIptFlag = 1;
      } else if (item.acctType == "6") {
        this.reciveMsgs.acctType = "6";
        this.cantIptFlag = 1;
      } else {
        this.cantIptFlag = 0;
        this.reciveMsgs.acctType = "";
      }
      this.reciveMsgs.recivePersonName = item.payeeName;
      this.reciveMsgs.recivePersonCardNum = item.payeeIdCard;
      this.reciveMsgs.recivePersonphoneNum = item.mobileNo ? item.mobileNo : "";
      this.reciveMsgs.reciveBank = [item.payeeBankName];
      this.reciveMsgs.recivePersonBankNum = item.payeeBankNo;
      this.reciveMsgs.reciveBankAdress = [
        item.payeeProvinceId,
        item.payeeCityId
      ];
      this.reciveMsgs.alipayNo = item.alipayNo; //点击图标写到支付宝账号
    },
    //查询所有银行
    bankListAjax() {
      if (this.getBankListFlag) return false;
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      getBankList()
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.getBankListFlag = 1;
            let bankList1 = res.data.result.data.map(item => {
              return item.bankName;
            });
            this.bankList.push(bankList1);
          } else {
            this.getBankListFlag = 0;
          }
          //大综0.5查询上一次填写的所有收款人信息
          if (
            this.classify == "0" &&
            this.taxWaybillId != "" &&
            this.taxWaybillId != undefined
          ) {
            this.queryReceiveInfo();
          }
          this.$nextTick(() => {
            this.pageShow = true;
          });
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
          this.getBankListFlag = 0;
        });
    },
    //收款人类型转换
    typeChange() {
      // if(this.yundanState != '0'){
      //     return
      // }
      this.receiveTypeState = true;
    },
    queryReceiveInfo() {
      let json = {
        taxWaybillId: this.taxWaybillId
      };
      buildWaybillAgain(json)
        .then(res => {
          //3048
          if (res.data.reCode === "0") {
            let result = res.data.result;
            this.reciveMsgs.reciveType = result.payType;
            if (result.payBankNo == "") {
              this.recivePersonType = "请选择收款人类型";
            } else {
              if (result.payType == "0") {
                this.recivePersonType = "非本人收款";
              } else {
                this.recivePersonType = "本人收款";
              }
            }
            this.reciveMsgs.recivePersonName = result.payName; //收款人姓名
            this.reciveMsgs.recivePersonCardNum = result.payIdCard; //收款人身份证号码
            this.reciveMsgs.recivePersonBankNum = result.payBankNo; //收款人银行卡号
            if (result.payBankName != "" && result.payBankName) {
              this.reciveMsgs.reciveBank = [result.payBankName]; //收款银行名称
              if (result.payBankName == "车队钱包") {
                this.cantIptFlag = 1;
              }
            } else {
              // 车队长需求 ：如果收款人信息为空，默认带司机姓名
              this.reciveMsgs.recivePersonName = result.driverName;
            }
            this.reciveMsgs.recivePersonphoneNum = result.payMobileNo; //收款人联系手机
            if (result.provinceId != "") {
              this.reciveMsgs.reciveBankAdress = [
                result.provinceId,
                result.cityId
              ]; //收款人开户行
            }
            this.xid = result.xid;
            this.driverName = result.driverName;
            this.cartBadgeNo = result.cartBadgeNo;
            this.mobileNo = result.mobileNo;
            if (result.alipayNo != "") {
              this.jiedanState = "1";
            }
            this.reciveMsgs.alipayNo = result.alipayNo;
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    suerBtnClick() {
      if (!this.btnState) {
        let cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (this.$refs.PhoneNumber.showWarn === true) {
          this.$vux.toast.text("收款人手机号码输入错误~~~", "middle");
          return false;
        }
        if (
          this.reciveMsgs.recivePersonCardNum.length < 18 &&
          this.reciveMsgs.recivePersonCardNum.length > 0 &&
          !cP.test(this.reciveMsgs.recivePersonCardNum)
        ) {
          this.$vux.toast.text("收款人身份证号码输入错误~~~", "middle");
          return false;
        }

        this.$vux.toast.text("请输入完整的收款人信息~~~", "middle");
        return false;
      }
      //收款人手机号验证
      let re = /^1\d{10}$/;
      if (!re.test(this.reciveMsgs.recivePersonphoneNum)) {
        this.$vux.toast.text("收款人手机号码输入错误", "middle");
        return false;
      }
      if (
        this.zyCapitalCfg !== "8" &&
        this.zblState == 1 &&
        this.recivePersonType === "本人收款" &&
        this.reciveMsgs.alipayNo == ""
      ) {
        this.$vux.toast.text("支付宝账号必填", "middle");
        return false;
      }
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      if (this.classify == "0") {
        if (this.taxWaybillId == undefined) {
          this.gateCheckOfCardNumAjax();
        } else {
          //大综0.5走这个录入信息
          if (this.reciveMsgs.reciveBank[0] == "好运宝钱包") {
            this.dazongModifyWayBill();
          } else {
            this.informationEntry();
          }
        }
      } else {
        this.gateCheckOfCardNumAjax();
      }
    },
    gateCheckOfCardNumAjax() {
      gateCheckOfCardNum(
        this.reciveMsgs.recivePersonName,
        this.reciveMsgs.recivePersonCardNum
      )
        .then(res => {
          //5015
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            try {
              MtaH5.clickStat("recive_pay_msg_sure");
            } catch (error) {
              JSON.stringify(error);
            }
            window.sessionStorage.isChooseType = "1";
            this.$router.go(-1);
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(error => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text("保存异常，请稍后再试~~~", "middle");
        });
    },
    //录入信息的方法
    informationEntry() {
      let jsons = {
        mobileNo: this.driverMobileNo,
        payeeBankNo: this.reciveMsgs.recivePersonBankNum,
        payeeName: this.reciveMsgs.recivePersonName,
        payeeBankName: this.reciveMsgs.reciveBank[0],
        payeeProvinceId: this.reciveMsgs.reciveBankAdress[0],
        payeeCityId: this.reciveMsgs.reciveBankAdress[1],
        payeeIdCard: this.reciveMsgs.recivePersonCardNum,
        payeeMobileNo: this.reciveMsgs.recivePersonphoneNum,
        alipayNo: this.reciveMsgs.alipayNo
      };
      if (
        jsons.mobileNo != "" &&
        jsons.payeeBankNo != "" &&
        jsons.payeeName != "" &&
        jsons.payeeBankName != "" &&
        jsons.payeeProvinceId != "" &&
        jsons.payeeCityId != "" &&
        jsons.payeeIdCard != "" &&
        jsons.payeeMobileNo != ""
      ) {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        infoEntry(jsons)
          .then(res => {
            //8005
            // this.$store.commit('updateLoadingStatus', {isLoading: false})
            //收款信息保存后再修改运单
            this.dazongModifyWayBill();
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
          });
      }
    },
    //大综修改运单
    dazongModifyWayBill() {
      let json = {
        xid: this.xid, //通用ID
        taxWaybillId: this.taxWaybillId, //运单ID
        loadingTonnage: "",
        unloadingTonnage: "",
        loadingAddressName: "",
        unloadingAddressName: "",
        startProvinceId: "",
        startCityId: "",
        startCountyId: "",
        endProvinceId: "",
        endCityId: "",
        endCountyId: "",
        driverName: "",
        cartBadgeNo: this.cartBadgeNo,
        transTrip: "",
        goodsName: "",
        unitPrice: "",
        userFreight: "",
        wbItem: "",
        prepayments: "",
        freightChangeReason: "",
        klbState: "",
        mobileNo: "",
        stateCfg: "",
        payType: this.reciveMsgs.reciveType, //正常的收款人类型
        payName: this.reciveMsgs.recivePersonName, //收款人姓名
        payIdCard: this.reciveMsgs.recivePersonCardNum, //收款人身份证
        payBankName: this.reciveMsgs.reciveBank[0], //收款人银行名称
        payBankNo: this.reciveMsgs.recivePersonBankNum, //收款人银行卡号
        payMobileNo: this.reciveMsgs.recivePersonphoneNum, //收款人手机号
        provinceId: this.reciveMsgs.reciveBankAdress[0], //开户行省份id
        cityId: this.reciveMsgs.reciveBankAdress[1], //开户行城市id
        alipayNo: this.reciveMsgs.alipayNo // 收款人支付宝账号
      };
      console.log(json);
      dazongModifyWayBill(json)
        .then(res => {
          //3068
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.$vux.toast.text("保存成功!", "middle");
            //通知客户端的方法
            setTimeout(() => {
              let item = {
                type: "1",
                content: {
                  taxWaybillId: this.taxWaybillId,
                  payInfoState: "1"
                }
              };
              receivePersonBack(item);
              // AppFinish(-1);
            }, 1500);
          } else {
            this.$vux.alert.show({
              title: "提示",
              buttonText: "知道了",
              content: res.data.reInfo
            });
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    //如果选择了本人收款，则去带出身份证号码
    chooseOneself() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        driverMobileNo:
          this.classify != 0
            ? this.weyBillSecond.mobileNo
            : this.driverMobileNo,
        driverName:
          this.classify != 0 ? this.weyBillSecond.driverName : this.driverName
      };
      getIdCard(json)
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            //对象不为空时，传值
            let result = JSON.stringify(res.data.result) != "{}";
            if (result == true) {
              this.reciveMsgs.recivePersonCardNum = res.data.result.idCard;
            } else {
              //置空接单手机号
              this.reciveMsgs.alipayNo = "";
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    //切换接单手机号选中状态
    changeType(item) {
      if (item == "") {
        this.src1 = this.src3;
        this.reciveMsgs.alipayNo = "";
      } else {
        //选中的状态
        this.src1 = this.src4;
        if (this.classify == "0") {
          this.reciveMsgs.alipayNo = this.driverMobileNo;
          return;
        } else {
          this.reciveMsgs.alipayNo = this.weyBillSecond.mobileNo;
        }
      }
      this.jiedanState = item;
    },
    //自定义去前后空格的方法
    trim: function(i) {
      //   return i.toString().replace(/(^\s*)|(\s*$)/g, "");
      return i.toString().replace(/\s/g, "");
    }
  }
};
</script>

<style lang="less">
.web-recive-msg {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .img1 {
    width: 8px;
    height: 8px;
  }
  .weui-cell,
  .vux-cell-box {
    font-size: 16px;
  }
  .vux-popup-picker-select {
    text-align: left !important;
    .vux-popup-picker-placeholder {
      color: #9f9f9f;
    }
  }
  .vux-label {
    color: #797979;
  }
  .weui-label {
    color: #797979;
  }
  .textColor1 {
    .weui-input {
      text-fill-color: #999 !important;
      -webkit-text-fill-color: #999 !important;
    }
    .vux-cell-value {
      -webkit-text-fill-color: #999 !important;
    }
  }
  .textColor2 {
    .weui-input {
    }
  }
  input::-webkit-input-placeholder,
  .vux-cell-align-left {
    color: #9f9f9f;
  }
  .weui-cell:before {
    left: 0px;
  }
  .cell-before {
    border-top: 1px solid #d9d9d9;
  }
  .vux-x-input.disabled .weui-input {
    -webkit-text-fill-color: #202020;
  }
  .sue-btn-cxt {
    width: 100%;
    height: auto;
    align-items: center;
    position: fixed;
    bottom: 0px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .weui-btn {
      margin: 10px auto;
    }
    .clear-msg {
      color: blue;
      text-decoration: underline;
      padding: 10px;
    }
  }
  .cell-left-style {
    color: #202020;
  }
  .vux-popup-header-right {
    color: #1581cf;
  }
  .recive-history-cxt {
    padding: 12px;
    padding: 12px;
    max-height: 300px;
    overflow: auto;
    .recive-title-style {
      color: #202020;
      span {
        color: #1581cf;
      }
    }
    .recive-list-cxt {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      justify-content: spaspace-around;
      position: relative;
      padding: 13px;
      min-height: 48px;
      height: auto;
      background-color: #f6f6f6;
      border: 1px solid #dfdfdf;
      font-size: 15px;
      .use-btn-style {
        position: absolute;
        width: 60px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        background-color: #2196f3;
        color: #fff;
        border-radius: 5px;
        right: 20px;
        top: 40px;
      }
      .list-item-cxt {
        display: flex;
        justify-content: flex-start;
        .left {
          color: #454545;
        }
        .right {
          color: #202020;
        }
        .carMaster {
          margin-left: 5px;
          color: #ffba00;
          font-size: 14px;
          padding: 2px 4px;
          border: 1px solid rgba(255, 186, 0, 1);
          border-radius: 10px;
        }
      }
    }
    .recive-list-cxt-active {
      background-color: #e0effb;
      border: 1px solid #3699ff;
    }
  }
  .history-img-style {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
  .usually-receive-people {
    font-size: 13px;
    padding: 6px 4px;
    color: #ffffff;
    background-color: #ffba00;
    border-radius: 10px;
  }
}
</style>
