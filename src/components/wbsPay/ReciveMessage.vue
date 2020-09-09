<template>
  <div class="recive_message_container">
    <c-header>
      <van-nav-bar
        title="填写收款信息"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="gray"></div>
      <div class="content">
        <van-cell-group>
          <van-field
            v-model="recivePersonTypeStr"
            v-show="recivePersonTypeShow"
            label="收款人类型："
            placeholder="请选择收款人类型"
            right-icon="arrow"
            readonly
            @click="recivePersonActionsShow = true"
          />
          <van-field
            v-model.trim="reciveMsgs.recivePersonName"
            :disabled="cantIptFlag == '1'"
            label="收款人姓名："
            placeholder="请填写收款人姓名"
            right-icon="arrow"
            :maxlength="64"
            clearable
          >
            <div slot="right-icon" @click="historyBtnClick">
              <div class="common-person">常用收款人</div>
            </div>
          </van-field>
          <van-field
            v-model.trim="reciveMsgs.recivePersonCardNum"
            :disabled="cantIptFlag == '1'"
            label="身份证号："
            placeholder="请输入收款人身份证号码"
            :maxlength="18"
            clearable
          />
          <van-field
            v-model.trim="reciveMsgs.recivePersonBankNum"
            :disabled="cantIptFlag == '1'"
            label="银行卡号："
            placeholder="请输入银行卡号"
            clearable
            @blur="checkBankName"
          />
          <van-field
            v-model.trim="reciveMsgs.reciveBank"
            :disabled="cantIptFlag == '1'"
            label="收款银行："
            placeholder="请选择收款银行"
            readonly
            right-icon="arrow"
            @click="openReciveBank"
          />
          <van-field
            v-model.trim="reciveMsgs.recivePersonphoneNum"
            :disabled="cantIptFlag == '1'"
            label="联系手机："
            placeholder="请输入银行卡绑定的手机"
            clearable
            type="tel"
            :maxlength="11"
          />
          <van-field
            v-model.trim="reciveMsgs.reciveBankAdress"
            :disabled="cantIptFlag == '1'"
            label="开户行地址："
            placeholder="请选择开户行地址"
            readonly
            right-icon="arrow"
            @click="openReciveBankAdress"
          />
        </van-cell-group>
        <div class="gray"></div>
        <!-- 此字段只对于开通了自保理的企业的快路宝账号,且此笔运单是本人收款时,显示"支付宝账号字段"(支付宝账号为必填项) -->
        <van-cell-group v-show="alipayShow">
          <van-cell title="支付宝账号：" required>
            <van-checkbox
              v-model="jiedanState"
              checked-color="#15499a"
              @click="phonechange"
              >接单手机号</van-checkbox
            >
          </van-cell>
          <van-field
            v-model.trim="reciveMsgs.alipayNo"
            placeholder="非接单手机号，请输入支付宝账号"
            clearable
            type="number"
          />
        </van-cell-group>
      </div>
    </div>

    <div class="footer">
      <van-button class="btn" type="primary" size="large" @click="suerBtnClick">
        确定
      </van-button>
      <div class="clear-msg" @click="rightBtnClick()" v-show="cantIptFlag == 1">清空收款信息</div>
    </div>

    <!-- 收款人类型 actionsheet-->
    <van-action-sheet
      :round="false"
      v-model="recivePersonActionsShow"
      :actions="recivePersonActions"
      @select="onSelectReciveActions"
    />

    <!-- 收款记录查询列表  popup-->
    <van-popup v-model="recordPopupShow" position="bottom">
      <div class="record_popup">
        <div class="header">
          <div class="left">选择收款信息</div>
          <div class="right" @click="rightBtnClick">手动输入</div>
        </div>
        <div v-show="recordPopupShowWaiting" class="content">
          <van-loading type="spinner" color="#1989fa">加载中...</van-loading>
        </div>
        <div v-show="!recordPopupShowWaiting" class="content">
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
                  src="@/assets/imgs/wbs/qianbao_icon@2x.png"
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
              <div class="right">
                {{ item.payeeProvince }} {{ item.payeeCityName }}
              </div>
            </div>
            <div class="list-item-cxt">
              <div class="left">银 行 卡 号：</div>
              <div class="right">{{ item.payeeBankNo }}</div>
            </div>
            <div
              class="use-btn-style"
              v-show="reciveHistoryFlag === index"
              @click="historyBtnUse(item)"
            >
              使用
            </div>
          </div>
          <div style="height:32px;"></div>
        </div>
      </div>
    </van-popup>

    <!-- 银行选择 -->
    <van-popup v-model="bankPickerShow" position="bottom">
      <van-picker
        v-if="bankPickerShow"
        show-toolbar
        :columns="bankList"
        value-key="bankName"
        @cancel="bankPickerShow = false"
        @confirm="onConfirmBankPicker"
        :default-index="bankDefaultIndex"
      />
    </van-popup>

    <!-- 城市选择器 -->
    <van-popup v-model="selectCityPickerShow" position="bottom">
      <city-picker
        v-if="selectCityPickerShow"
        :defaultProvinceId="reciveMsgs.provinceId"
        :defaultCityId="reciveMsgs.cityId"
        @onConfirm="onConfirmCityPicker"
        @onCancel="selectCityPickerShow = false"
      ></city-picker>
    </van-popup>
  </div>
</template>

<script>
import {
  NavBar,
  Field,
  Cell,
  CellGroup,
  Picker,
  Popup,
  Checkbox,
  Button,
  ActionSheet,
  Toast,
  Loading,
} from "vant";
import cityPicker from "@/components/common/cityPicker";
import {
  getBankList,
  gateCheckOfCardNum,
  zblState,
  buildWaybillAgain,
  getCompanyConfig
} from "@/api/api.js";
import { getRecPayHistory } from "@/api/apiPay";
import { getIdCard, getBankName, infoEntry } from "@/api/applyPay.js";
import { getCookie } from "@/utils/getCookie.js";
import { cityDataToIWant } from "@/utils/cMethods";
import { dazongModifyWayBill } from "@/api/dazongapi.js";
import { AppFinish, receivePersonBack } from "@/utils/app.js";
export default {
  name: "ReciveMessage",
  components: {
    cityPicker,
    vanNavBar: NavBar,
    vanField: Field,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanPicker: Picker,
    vanPopup: Popup,
    vanCheckbox: Checkbox,
    vanButton: Button,
    vanActionSheet: ActionSheet,
    vanLoading: Loading,
  },
  data() {
    return {
      // taxWaybillId: this.$route.query.taxWaybillId,
      // driverMobileNo: this.$route.query.mobileNo,
      // driverName: this.$route.query.driverName,
      // driverAlipayNo: this.$route.query.alipayNo,
      jiedanState: false, // 自保理手机号选择
      // jiedanMobile: "",
      zblState: "", // 自保理配置

      zyCapitalCfg: "9", // 回款宝配置
      hybWalletCfg: "9", // 好运宝钱包配置
      bankPickerShow: false,
      selectCityPickerShow: false,
      recordPopupShow: false,
      recivePersonActionsShow: false,
      recordPopupShowWaiting: false,
      bankList: [],
      bankDefaultIndex: 0,
      reciveHistoryList: [],
      reciveHistoryFlag: -1,
      recivePersonActions: [
        { name: "本人收款", value: "1" },
        { name: "非本人收款", value: "0" }
      ],
      cantIptFlag: '0', // 是否可输入
      reciveMsgs: {
        reciveType: "",
        recivePersonName: "", //收款人姓名
        recivePersonCardNum: "", //收款人身份证号
        recivePersonBankNum: "", //收款人银行卡号
        recivePersonphoneNum: "", //收款人手机号
        reciveBank: "", //收款人银行名称
        reciveBankAdress: "", //收款人银行地址
        provinceId: "",
        cityId: "",
        alipayNo: "", //支付宝账号
        acctType: ""
      }
    };
  },
  computed: {
    // 格式化收款人类型
    recivePersonTypeStr() {
      if (this.reciveMsgs.reciveType == '1') {
        return '本人收款'
      } else if (this.reciveMsgs.reciveType == '0') {
        return '非本人收款'
      } else {
        return ''
      }
    }, 
    // 是否展示收款人类型
    recivePersonTypeShow() {
      return this.zyCapitalCfg !== "8" && this.hybWalletCfg !== "8";
    },
    // // 是否禁用收款人姓名
    // recivePersonNameDisabled() {
    //   return this.reciveMsgs.reciveType == "1" && this.cantIptFlag == '1';
    // },
    // 是否显示支付宝账号
    alipayShow() {
      return (
        this.zyCapitalCfg !== "8" &&
        this.zblState == 1 &&
        this.reciveMsgs.reciveType === "1"
      );
    },
    // 收款信息 vuex存的
    reciveMsgPay() {
      return this.$store.state.wayBill.reciveMsgPay;
    },
    weyBillSecond() {
      return this.$store.state.wayBill.weyBillSecond;
    },
    jiedanMobile() {
      return this.$store.state.wayBill.weyBillSecond.mobileNo;
    },
    //携带过来的回款宝配置
    weyBillThird() {
      return this.$store.state.wayBill.weyBillThird;
    },
    btnState() {
      if (this.zyCapitalCfg == "8") {
        if (
          this.reciveMsgs.recivePersonName !== "" &&
          this.reciveMsgs.recivePersonCardNum.length === 18 &&
          this.reciveMsgs.recivePersonBankNum !== "" &&
          this.reciveMsgs.reciveBankAdress != "" &&
          this.reciveMsgs.reciveBank != "" &&
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
            this.reciveMsgs.reciveBankAdress != "" &&
            this.reciveMsgs.reciveBank != "" &&
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
            this.reciveMsgs.reciveBankAdress != "" &&
            this.reciveMsgs.reciveBank != "" &&
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
  watch: {
    'reciveMsgs.alipayNo': {
      handler(val) {
        if (val == this.jiedanMobile) {
          //若收款人的支付宝账号和接单手机号一致时,可选中{接单手机号},即自动带出运单司机手机号
          this.jiedanState = true;
        } else {
          this.jiedanState = false;
        }
      },
      immediate: false
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    this.initDataFromStore()
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    initDataFromStore() {
      if (this.reciveMsgPay.reciveBank instanceof Array) {
        this.reciveMsgs.reciveBank = '';
      } else {
        this.reciveMsgs.reciveBank = this.reciveMsgPay.reciveBank|| '';
      }
      if (this.reciveMsgPay.reciveBankAdress instanceof Array) {
        this.reciveMsgs.reciveBankAdress = '';
      } else {
        this.reciveMsgs.reciveBankAdress = this.reciveMsgPay.reciveBankAdress|| '';
      }
      this.reciveMsgs.reciveType = this.reciveMsgPay.reciveType|| '';
      this.reciveMsgs.recivePersonName = this.reciveMsgPay.recivePersonName|| '';
      this.reciveMsgs.recivePersonCardNum = this.reciveMsgPay.recivePersonCardNum|| '';
      this.reciveMsgs.recivePersonBankNum = this.reciveMsgPay.recivePersonBankNum|| '';
      this.reciveMsgs.recivePersonphoneNum = this.reciveMsgPay.recivePersonphoneNum|| '';
      
      this.reciveMsgs.provinceId = this.reciveMsgPay.provinceId|| '';
      this.reciveMsgs.cityId = this.reciveMsgPay.cityId|| '';
      if (this.reciveMsgs.reciveBank == "浙江网商银行") {
        this.reciveMsgs.reciveBank = "好运宝钱包";
      }
      if (this.reciveMsgPay.reciveBank == "好运宝钱包" || this.reciveMsgPay.reciveBank == "浙江网商银行" || this.reciveMsgPay.reciveBank == "车队钱包") {
        this.cantIptFlag = '1';
      } else {
        this.cantIptFlag = '0';
      }
    },
    init() {
      this._getCompanyConfig()
        .then(res => {
          console.log('===============================')
          // this.jiedanMobile = this.weyBillSecond.mobileNo;
          this._zblState();
        })
        .then(res => {
          return this._getBankList();
        }).catch(err => {
          console.log(err)
        })
    },
    _getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let result = res.data.result;
              this.hybWalletCfg = result.hybWalletCfg; // 好运宝钱包配置
              this.zyCapitalCfg = result.zyCapitalCfg; // 回款宝配置
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
    _zblState() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        zblState()
          .then(res => {
            // 3004自保理状态查询接口
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode == "0") {
              this.zblState = res.data.result.zblState; //自保理状态
              if (this.reciveMsgPay.reciveType == "1" && this.zblState == "1") {
                this.reciveMsgs.alipayNo = this.reciveMsgPay.alipayNo; //支付宝账号
              } else {
                this.reciveMsgs.alipayNo = "";
              }
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
            reject();
          });
      });
    },
    //查询所有银行
    _getBankList() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getBankList()
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              this.bankList = res.data.result.data;
         
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
          });
      });
    },
    //切换接单手机号选中状态
    phonechange() {
      // this.jiedanState = checked;
      this.jiedanState = !this.jiedanState;
      if (!this.jiedanState) {
        this.reciveMsgs.alipayNo = "";
      } else {
        //选中的状态
        this.reciveMsgs.alipayNo = this.weyBillSecond.mobileNo;
      }
    },
    //支付宝账号输入变化
    // mobileChange(val) {
    //   if (val == this.jiedanMobile) {
    //     //若收款人的支付宝账号和接单手机号一致时,可选中{接单手机号},即自动带出运单司机手机号
    //     this.jiedanState = true;
    //   } else {
    //     this.jiedanState = false;
    //   }
    // },
    // 返回
    onClickLeft() {
      this.$router.go(-1);
    },
    // 选择银行
    onConfirmBankPicker(item) {
      this.reciveMsgs.reciveBank = item.bankName;
      this.bankPickerShow = false;
    },
    // 选择城市
    onConfirmCityPicker({ text, code }) {
      this.selectCityPickerShow = false;
      this.reciveMsgs.reciveBankAdress = text;
      this.reciveMsgs.provinceId = code[0];
      this.reciveMsgs.cityId = code[1];
      console.log(code);
    },
    //输入银行卡号查询银行名称
    checkBankName() {
      //条件时开通大综配置
      if (this.reciveMsgs.recivePersonBankNum.length > 12) {
        //查询银行名称
        let bankNum = this.reciveMsgs.recivePersonBankNum;
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getBankName(bankNum)
          .then(res => {
            //9000
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              this.reciveMsgs.reciveBank = res.data.result;
            }
          })
          .catch(err => {
            // this.reciveMsgs.reciveBank = [];
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
          });
      }
    },
    // 选择收款人类型
    onSelectReciveActions(item) {
      const { name, value } = item;
      this.reciveMsgs.reciveType = value;
      this.clearMsg();
      if (value == "1") {
        // 本人收款
        this.reciveMsgs.recivePersonName = this.weyBillSecond.driverName;
        // if (this.zblState != "1") {
        //   // 如果选择了本人收款，则去带出身份证号码，自保理
        //   this.jiedanState = false;
        //   this.reciveMsgs.alipayNo = "";
        // }
        //如果选择了本人收款，则去带出身份证号码
        this._chooseOneself().then(res => {
          this.recivePersonActionsShow  = false;
        });
      } else {
        this.reciveMsgs.recivePersonName = "";
        this.reciveMsgs.alipayNo = "";
        this.recivePersonActionsShow  = false;
      }
    },
    // 搜索历史
    historyBtnClick() {
      if (this.recivePersonTypeShow) {
        if (!this.reciveMsgs.recivePersonName) {
          this.$vux.toast.text("请选择收款类型和输入姓名查询", "middle");
          return false;
        }
      } else {
        if (!this.reciveMsgs.recivePersonName) {
          this.$vux.toast.text("请输入收款人姓名查询", "middle");
          return false;
        }
      }
      this.reciveHistoryAjax();
    },
    reciveHistoryAjax() {
      this.recordPopupShow = true;
      this.recordPopupShowWaiting = true;
      //通过比较前后两个变量是否相同，若相同则不请求收款记录
      // if (
      //   this.reciveMsgs.recivePersonName != "" &&
      //   localStorage.getItem("oldrecivePersonName") ==
      //     this.reciveMsgs.recivePersonName &&
      //   localStorage.getItem("oldReciveType") == this.reciveMsgs.reciveType
      // ) {
      //   this.recordPopupShow = true;
      //   return false;
      // }
      let phoneNum = this.weyBillSecond.mobileNo;
      // localStorage.setItem("oldPersonNum", phoneNum);

      let json = {
        taxWaybillId: "",
        mobileNo: phoneNum,
        payeeName: this.reciveMsgs.recivePersonName,
        entType: "0",
        hybWalletCfg: this.hybWalletCfg,
        autoShowWalletCfg: "",
        cartBadgeNo: this.weyBillSecond.cartBadgeNo,
        driverName: this.weyBillSecond.driverName
      };
      getRecPayHistory(json)
        .then(res => {
          this.oldrecivePersonName = this.reciveMsgs.recivePersonName;
          this.oldReciveType = this.reciveMsgs.reciveType;
          if (res.data.reCode === "0") {
            try {
              MtaH5.clickStat("recive_pay_msg");
            } catch (error) {
              JSON.stringify(error);
            }
            this.reciveHistoryList = res.data.result.payeeList;
            
            this.recordPopupShowWaiting = false;
          }
        })
        .catch(error => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(error.message, "middle");
        });
    },
    historyBtnUse(item) {
      this.recordPopupShow = false;
      if (item.acctType == "5") {
        this.reciveMsgs.acctType = "5";
        this.cantIptFlag = '1';
      } else if (item.acctType == "6") {
        this.reciveMsgs.acctType = "6";
        this.cantIptFlag = '1';
      } else if (item.acctType == "1") {
        this.reciveMsgs.acctType = "1";
        this.cantIptFlag = '0';
      } else {
        this.cantIptFlag = '0';
        this.reciveMsgs.acctType = "";
      }
      this.reciveMsgs.recivePersonName = item.payeeName;
      this.reciveMsgs.recivePersonCardNum = item.payeeIdCard;
      this.reciveMsgs.recivePersonphoneNum = item.mobileNo ? item.mobileNo : "";
      this.reciveMsgs.reciveBank = item.payeeBankName;
  
      this.reciveMsgs.recivePersonBankNum = item.payeeBankNo;
      this.reciveMsgs.reciveBankAdress =
        item.payeeProvince + " " + item.payeeCityName;
     
      this.reciveMsgs.provinceId = item.payeeProvinceId;
      this.reciveMsgs.cityId = item.payeeCityId;
      this.reciveMsgs.alipayNo = item.alipayNo; //点击图标写到支付宝账号
    },
    // 手动输入
    rightBtnClick() {
      this.clearMsg();
      this.recordPopupShow = false;
    },
    // 清空
    clearMsg() {
      if (this.hybWalletCfg == "8") {
        this.reciveMsgs.recivePersonName = "";
      }
      this.reciveMsgs.recivePersonCardNum = "";
      this.reciveMsgs.recivePersonBankNum = "";
      this.reciveMsgs.reciveBank = "";
      this.reciveMsgs.recivePersonphoneNum = "";
      this.reciveMsgs.reciveBankAdress = "";
      this.reciveMsgs.payeeCityId = "";
      this.reciveMsgs.payeeProvinceId = "";
      this.reciveMsgs.acctType = "";
      this.reciveMsgs.provinceId = "";
      this.reciveMsgs.cityId = "";
      this.reciveMsgs.alipayNo = "";
      this.cantIptFlag = '0';
    },
    // 确认按钮
    suerBtnClick() {
      if (!this.btnState) {
        let cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
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
        this.reciveMsgs.reciveType === "1" &&
        this.reciveMsgs.alipayNo == ""
      ) {
        this.$vux.toast.text("支付宝账号必填", "middle");
        return false;
      }
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      this.gateCheckOfCardNumAjax();
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
            let updateOpions = {
              type: "reciveMsgPay",
              updatMsg: this.reciveMsgs
            };
            this.$store.commit("updateWayBillStatus", updateOpions);
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
    //如果选择了本人收款，则去带出身份证号码
    _chooseOneself() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        let json = {
          driverMobileNo: this.weyBillSecond.mobileNo,
          driverName: this.weyBillSecond.driverName
        };
        getIdCard(json)
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              //对象不为空时，传值
              let b = JSON.stringify(res.data.result) != "{}";
              if (b) {
                this.reciveMsgs.recivePersonCardNum = res.data.result.idCard;
              } else {
                //置空接单手机号
                this.reciveMsgs.alipayNo = "";
              }
              resolve()
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject()
            }
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
            reject()
          });
      });
    },
    openReciveBank() {
      if (this.cantIptFlag =='1') {
        return
      }
      this.bankDefaultIndex = this.bankList.findIndex((item) => {
        return item.bankName == this.reciveMsgs.reciveBank
      })
      this.bankPickerShow = true 
    },
    openReciveBankAdress() {
      if (this.cantIptFlag =='1') {
        return
      }
      this.selectCityPickerShow = true 
    }
  }
};
</script>

<style lang="less" scoped>
.recive_message_container {
  background-color: #efefef;
  /deep/.van-cell {
    font-size: 16px;
    color: #000;
  }
  /deep/.van-field{
    color: #000;
    font-size: 16px;
    .van-field__label {
      width: 100px;
    }
  }
  .common-person {
    font-size: 13px;
    padding: 0px 4px;
    color: #fff;
    background-color: #ffba00;
    border-radius: 10px;
  }
  .sub_page_base {
    width: 100%;
    padding-top: 20px;
    min-height: 100vh;
    height: auto;
    box-sizing: border-box;
  }
  .footer {
    width: 90%;
    padding: 15px 5%;
    height: 100px;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // justify-content: center;
    text-align: center;
    position: fixed;
    bottom: 0px;
    background-color: #fff;
    /deep/.van-button {
      background: #15499a;
      border-color: #15499a;
      border-radius: 5px;
    }
    .clear-msg {
      color: blue;
      text-decoration: underline;
      padding: 10px;
    }
  }

  .record_popup {
    .header {
      display: flex;
      align-items: center;
      padding: 0 15px;
      height: 44px;
      .left {
        flex: 1;
        text-align: center;
        color: #222;
      }
      .right {
        color: #1581cf;
      }
    }
    .content {
      background: #eee;
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
  }
  .history-img-style {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
}
</style>
