<template>
  <div class="wbs-apply-pay">
    <c-header>
      <x-header :left-options="{ backText: '' }">申请支付</x-header>
    </c-header>
    <span v-show="showPage == true">
      <!-- 公共部分 -->
      <section
        v-if="type === '0'"
        class="apply-pay-msg"
        v-show="!(prepaymentsOilCardNotPaid != '' && prepaymentsOilCardNotPaid > 0)"
      >
        <div class="msg-title">支付信息</div>
        <div style="height:6px;"></div>
        <div class="msg-item">
          <div class="left">车牌号码：</div>
          <div class="right">{{ dataInitMsg.cartBadgeNo }}</div>
        </div>
        <div class="msg-item">
          <div class="left">司机信息：</div>
          <div class="right">{{ dataInitMsg.driverName }}，{{ dataInitMsg.mobileNo }}</div>
        </div>
        <div class="msg-item">
          <div class="left">运费金额：</div>
          <div class="right">{{ dataInitMsg.userFreight }}元</div>
        </div>
        <div class="msg-item" v-if="dataInitMsg.prepayments !== ''">
          <div class="left">预 付 款 ：</div>
          <div class="right">{{ dataInitMsg.prepayments }}元</div>
        </div>
        <div class="msg-item" v-if="dataInitMsg.backFee !== ''">
          <div class="left">回单押金：</div>
          <div class="right">{{ dataInitMsg.backFee }}元</div>
        </div>
      </section>

      <group
        label-margin-right="0.12em"
        label-align="right"
        label-width="7.0em"
        v-show="!(prepaymentsOilCardNotPaid != '' && prepaymentsOilCardNotPaid > 0)"
      >
        <cell
          title="运费类型："
          is-link
          v-model="dataInitMsg.paidType"
          @click.native="receiveTypeShow"
          :readonly="dataResult.length == 1"
          value-align="left"
        ></cell>
        <actionsheet v-model="show3" :menus="yunfeiType" @on-click-menu="yunfeiTypeCheck"></actionsheet>
        <div
          class="line"
          v-show="(dataResult.length == 1  || dataResult.length > 1) && dataInitMsg.paidType != '货损付'"
        ></div>
        <!-- 以前的部分 -->
        <span v-show="dataInitMsg.paidType != '货损付'">
          <cell value-align="left" @click.native="show1 = true">
            <span class="labe-left" slot="title">待付运费：</span>
            <span class="value-right">{{ dataInitMsg.canPayMaxFreight }}元</span>
          </cell>
          <cell value-align="left" v-show="this.insFeeState == '0'">
            <span class="labe-left" slot="title">保价费：</span>
            <span class="value-right">{{ dataInitMsg.insFee }}元</span>
          </cell>
          <div class="line"></div>
          <div class="pay-money-ipt">
            <div class="left">支付金额：</div>
            <input
              v-model="payMoney"
              placeholder="支付金额"
              type="number"
              :class="[(advancePayState == '1' && collectTwoCfg == '8') ? '' :'right']"
              :disabled="advancePayState == '1' && collectTwoCfg == '8'"
            />
          </div>
          <div class="line"></div>
          <!-- 若快路宝账号所对应的企业未开通回款宝配置且不是自保理用户,则选择本人收款时收款人姓名带入承运司机姓名不可修改,选择非本人收款时可输入收款人姓名,逻辑与之前一致 -->
          <span
            v-show="!(advancePayState == '1' && this.collectTwoCfg == '8') && (zyCapitalCfg == '8' || hybWalletCfg == '8')"
          >
            <cell
              title="收款方式："
              :is-link="!((zyCapitalCfg == '8' && changeState == 0) || (hybWalletCfg == '8' && zyCapitalCfg != '8'))"
              v-model="payType"
              @click.native="receiveType"
              value-align="left"
            >
              <div slot="title">
                <img width="8px" :src="bitian" />
                <span>收款方式：</span>
              </div>
            </cell>
            <div class="line" v-show="this.payType != '请选择收款方式'"></div>
            <actionsheet v-model="show2" :menus="menus1" @on-click-menu="menuCheck"></actionsheet>
          </span>
          <span
            v-show="!(advancePayState == '1' && this.collectTwoCfg == '8') && zyCapitalCfg == '8' && this.payType === '好运宝收款'"
          >
            <x-input type="text" v-model="name" disabled>
              <span class="labe-left" slot="label">收款人姓名：</span>
            </x-input>
            <x-input type="text" v-model="idCard" disabled>
              <span class="labe-left" slot="label">收款人身份证：</span>
            </x-input>
            <x-input type="text" v-model="phoneNumber" disabled>
              <span class="labe-left" slot="label">手机号码：</span>
            </x-input>
            <x-input type="text" v-model="aliNum" disabled>
              <span class="labe-left" slot="label">支付宝账号：</span>
            </x-input>
            <div class="weui-cell">
              <p style="color:red;">
                司机
                <span>{{ this.dataInitMsg.driverName }}</span>已开通好运宝收款,请提醒司机去收款
              </p>
            </div>
          </span>
          <span
            v-show="(advancePayState == '1' && this.collectTwoCfg == '8') || zyCapitalCfg !== '8' || this.payType === '银行卡收款'"
          >
            <x-input
              type="text"
              v-model.trim="personName"
              placeholder="请输入收款人姓名"
              @on-change="receivePersionCheck(personName)"
              :show-clear="false"
              :disabled="receiveState"
            >
              <span class="labe-left" slot="label">收款人姓名：</span>
              <div
                slot="right"
                class="common-person"
                @click="linkmanBtn()"
                v-show="!(advancePayState == '1' && collectionFlagCfg != 46)"
              >常用收款人</div>
            </x-input>
            <x-input
              :max="18"
              type="text"
              v-model.trim="cardNum"
              placeholder="请输入收款人身份证号码"
              :disabled="receiveState"
            >
              <span class="labe-left" slot="label">收款人身份证：</span>
            </x-input>
            <x-input
              :min="11"
              v-model.trim="bankNum"
              placeholder="请输入银行卡号"
              @on-blur="getBankNameAjax()"
              :disabled="receiveState"
            >
              <span class="labe-left" slot="label">银行卡号：</span>
            </x-input>
            <popup-picker
              :data="bankList"
              @on-show="bankListAjax"
              value-text-align="left"
              v-model="bankName"
              placeholder="请选择收款银行"
              :disabled="receiveState"
              :class="receiveState == true ? 'textColor1' : 'textColor2'"
            >
              <span class="labe-left" slot="title">收款银行：</span>
            </popup-picker>
            <popup-picker
              :data="cityList"
              :columns="2"
              value-text-align="left"
              show-name
              v-model="bankAdress"
              placeholder="请选择开户行地址"
              :disabled="receiveState"
              :class="receiveState == true ? 'textColor1' : 'textColor2'"
              on
            >
              <span class="labe-left" slot="title">开户行地址：</span>
            </popup-picker>
            <!-- 自保理需求 -->
            <span v-show="zyCapitalCfg !== '8' && zblState == 1 && zblshow == true">
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
                <checker v-model="jiedanState" @on-change="changeType">
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
                v-model.trim="dataInitMsg.alipayNo"
                @on-change="mobileChange(dataInitMsg.alipayNo)"
                placeholder="非接单手机号，请输入支付宝账号"
              ></x-input>
            </span>
          </span>
        </span>
        <!-- 货损付新页面 -->
        <div class="line" v-show="this.insFeeState == '0'"></div>
        <span
          v-show="(dataResult.length > '1' && dataInitMsg.paidType == '货损付') || (dataResult.length == '1' && dataInitMsg.paidType == '货损付')"
        >
          <cell value-align="left" v-show="this.insFeeState == '0'">
            <span class="labe-left" slot="title">保价费：</span>
            <span class="value-right">{{ dataInitMsg.insFee }}元</span>
          </cell>
          <cell value-align="left">
            <span class="labe-left" slot="title">支付金额：</span>
            <span class="value-right">{{ payMoney }}元</span>
          </cell>
          <cell value-align="left">
            <span class="labe-left" slot="title">收款方式：</span>
            <span class="value-right">{{ payType }}</span>
          </cell>
          <cell value-align="left">
            <span class="labe-left" slot="title">收款人姓名：</span>
            <span class="value-right">{{ lossFeePayeeName }}</span>
          </cell>
          <cell value-align="left">
            <span class="labe-left" slot="title">银行卡号：</span>
            <span class="value-right">{{ lossFeePayeeBankNo }}</span>
          </cell>
          <cell value-align="left">
            <span class="labe-left" slot="title">收款银行：</span>
            <span class="value-right">{{ lossFeePayeeBankName }}</span>
          </cell>
          <cell value-align="left">
            <span class="labe-left" slot="title">开户行地址：</span>
            <span class="value-right">{{ lossFeePayeeProvince + ' ' + lossFeePayeeCityName }}</span>
          </cell>
        </span>
      </group>

      <!-- 新增加的油卡模块 -->
      <group
        label-margin-right="0.12em"
        label-width="5em"
        label-align="left"
        class="group2"
        v-show="prepaymentsOilCardNotPaid != '' && prepaymentsOilCardNotPaid > 0"
      >
        <cell title="运费类型：" value="预付油卡" value-align="left"></cell>
        <cell title="支付金额：" v-model="payMoney" value-align="left"></cell>
        <cell title="油卡卡号：" is-link v-model="oilCardNo" @click.native="gotoSelectOilCard(payMoney)">
          <div slot="value" style="color:#757575;text-align: left;" v-show="oilCardNo == ''">未选择</div>
        </cell>
      </group>
      <div
        style="color:#B4001B;font-size:12px;padding: 10px;"
        v-show="this.drawMoneyState == '1' && (dataInitMsg.paidType == '预付款')"
      >
        <img
          src="../../assets/imgs/wbs/yiwen_icon@2x.png"
          alt
          width="14px"
          style="vertical-align: middle;"
        />
        <span>该运单司机已申请【提前收款】，请与货主确认货物运输无误后点击【确认申请】，点击后该运单信息不可进行修改。</span>
      </div>

      <div style="color:#B4001B;font-size:16px;padding: 10px;">
        <span v-show="showTips">
          <img src="../../assets/imgs/wbs/yiwen_icon@2x.png" alt width="14px" />
          供应链金融运单仅支持司机好运宝钱包收款、请司机完成证件识别。
        </span>
        <span
          v-show="(carMasterLength == '' || carMasterLength == 0) && dataInitMsg.paidType != '货损付'"
        >
          <img src="../../assets/imgs/wbs/yiwen_icon@2x.png" alt width="14px" />
          提醒收款人开通钱包绑定银行卡提现运费！
        </span>
      </div>
      <div style="height:40px;"></div>
      <div class="sure-btn-cxt" id="button">
        <x-button
          type="primary"
          @click.native="suerBtnClick()"
          :disabled="disabledSubmit || showTips"
        >
          <span>确认申请</span>
        </x-button>
      </div>
      <div
        style="text-decoration: underline;color: #15499A;text-align: center;margin-bottom: 20px;"
        @click="clearAll"
        v-show="(walletPay == '5' || walletPay == '6') && !(advancePayState == '1' && this.collectTwoCfg == '8' )"
      >清空收款信息</div>
    </span>

    <!-- 弹框一 -->
    <div v-transfer-dom class="apply-pay-alert">
      <x-dialog :show="sureAlertFlag">
        <div class="apply-alert-title">支付单信息确认</div>
        <div class="apply-pay-msg">
          <div v-show="insFeeState != '0' && lossEnsureFlag != '0'" class="normalStyle">
            <span class="list-left">支付总金额：</span>
            <span class="list-right">{{ totalMoney }}元</span>
          </div>
          <div
            v-show="insFeeState == '0' || lossEnsureFlag == '0'"
            class="normalStyle"
          >
            <span class="list-left">支付总金额：</span>
            <span class="list-right">
              {{ totalMoney1 }}元
              <span
                class="premium"
                v-if="lossEnsureFlag == '1' && Number(dataInitMsg.insFee) > 0"
              >(保价费:{{ dataInitMsg.insFee }}元)</span>
            </span>
          </div>
          <div class="baozhangStyle" v-if="lossEnsureFlag == '0' && Number(dataInitMsg.insFee) > 0">
            <p>
              <span class="list-left">司机运费：</span>
              <span class="list-right">{{ payMoney }}元</span>
            </p>
            <p>
              <span class="list-left">货损保障费：</span>
              <span class="list-right">{{this.dataInitMsg.insFee}}元</span>
            </p>
          </div>
          <div v-else>支付司机运费：{{ payMoney }}元</div>
        </div>
        <span
          v-show="this.payType === '银行卡收款' ||  (advancePayState == '1'  && this.collectTwoCfg == '8')"
        >
          <div style="height:1px;width:90%;background-color:#DFDFDF;margin-left: 5%;"></div>
          <div class="pay-person-msg">
            <div class="person-msg-list">
              <div class="list-left">收款人姓名：</div>
              <div class="list-right">{{ personName }}</div>
            </div>
            <div class="person-msg-list">
              <div class="list-left">收 款 银 行：</div>
              <div class="list-right">{{ bankName[0] }}</div>
            </div>
            <div class="person-msg-list">
              <div class="list-left">收 款 卡 号：</div>
              <div class="list-right">{{ bankNum }}</div>
            </div>
          </div>
          <div style="height:1px;background-color:#DFDFDF"></div>
        </span>
        <div class="contor-btn-cxt">
          <x-button
            class="contor-left-btn"
            @click.native="
              sureAlertFlag = false;
              disabledSubmit = false;
            "
          >取消</x-button>
          <x-button
            style="margin-top: 0;"
            class="contor-right-btn"
            @click.native="surePayBtn"
            :disabled="disabledConfirm"
          >确认申请</x-button>
        </div>
      </x-dialog>
    </div>

    <!-- 货损付弹框 -->
    <div v-transfer-dom class="apply-pay-alert">
      <x-dialog :show="huosunfuToast">
        <div class="apply-alert-title">支付单信息确认</div>
        <div class="apply-pay-msg">
          <div v-show="insFeeState != '0' && lossEnsureFlag != '0'" class="normalStyle">
            <span class="list-left">支付总金额：</span>
            <span class="list-right">{{ totalMoney2 }}元</span>
          </div>
          <div
            v-show="insFeeState == '0' || lossEnsureFlag == '0'"
            class="normalStyle"
          >
            <span class="list-left">支付总金额：</span>
            <span class="list-right">{{ totalMoney3 }}元</span>
          </div>
          <div class="baozhangStyle" v-if="lossEnsureFlag == 0">
            <p>
              <span class="list-left">货损保障费：</span>
              <span class="list-right">{{this.dataInitMsg.insFee}}元</span>
            </p>
          </div>
        </div>
        <span v-show="this.payType === '银行卡收款'">
          <div style="height:1px;width:90%;background-color:#DFDFDF;margin-left: 5%;"></div>
          <div class="pay-person-msg">
            <div class="person-msg-list">
              <div class="list-left">收款人姓名：</div>
              <div class="list-right">{{ lossFeePayeeName }}</div>
            </div>
            <div class="person-msg-list">
              <div class="list-left">收 款 银 行：</div>
              <div class="list-right">{{ lossFeePayeeBankName }}</div>
            </div>
            <div class="person-msg-list">
              <div class="list-left">收 款 卡 号：</div>
              <div class="list-right">{{ lossFeePayeeBankNo }}</div>
            </div>
          </div>
          <div style="height:1px;background-color:#DFDFDF"></div>
        </span>
        <div class="contor-btn-cxt">
          <x-button
            class="contor-left-btn"
            @click.native="
              huosunfuToast = false;
              disabledSubmit = false;
            "
          >取消</x-button>
          <x-button
            style="margin-top: 0;"
            class="contor-right-btn"
            @click.native="huosunfuSurePayBtn"
            :disabled="disabledConfirm"
          >确认申请</x-button>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  getBankList,
  gateCheckOfCardNum,
  zblState,
  phoneGetName,
  getCompanyConfig,
  getRecPayHistory,
} from "../../api/api.js";
import {
  getBankName,
  getHYBwallet,
  computedPayServerNum,
  sureApplyPay,
  sureApplyPay2,
  applyDataInit,
  getCarMasterInfo,
} from "../../api/applyPay.js";
import { cityDataToIWant } from "../../utils/cMethods";
import { AppFinish, AppRefreshData } from "../../utils/app.js";
export default {
  name: "wbsApplyPay",
  data() {
    return {
      payMoney: "",
      cardNum: "",
      personName: "",
      bankNum: "",
      bankList: [],
      bankName: [],
      getBankListFlag: 0,
      bankAdress: [],
      cityList: cityDataToIWant(city.data),
      msgSend: "",
      sureAlertFlag: false, //弹框标志一
      huosunfuToast: false, //弹框标志二
      totalMoney: "",
      oilCardNo: "", //油卡卡号
      belongActSys: "", //所属账户体系
      isOilPay: "", //0：已支付 1：未支付（油卡付）
      prepaymentsOilCardNotPaid: "",
      prepaymentsOilCard: "", //预付油卡
      showPage: false, //默认页面不展示
      totalMoney1: "", //支付总金额保价费显示的情况下出现
      totalMoney2: "", // 货损付的总金额
      totalMoney3: "", // 开通保价费的货损付总金额
      dataInitMsg: {
        cartBadgeNo: "",
        driverName: "",
        mobileNo: "",
        canPayMaxFreight: "",
        userFreight: "",
        prepayments: "",
        xid: "",
        paidType: "",
        backFee: "",
        insFee: "", //保价运输费
        alipayNo: "", //支付宝账号
      },
      type: this.$route.query.type, // 入口类型 预付现金 和 付款类型
      dataFlag: 0, // 页面初始化数据前后标记用于控制watch方法已经页面就生效的问题
      backFlag: 0, // 区分是否从常用收款人页面返回
      carMasterFlag: 0, // 区分是否是从车队长收款人页面返回
      insFeeState: "", //保价运输费状态

      zblState: "", //自保理状态
      jiedanState: "", //接单手机还选中状态
      bitian: require("../../assets/imgs/wbs/bitian_icon@2x.png"),
      src1: require("../../assets/imgs/wbs/xuanze_icon@2x.png"),
      src3: require("../../assets/imgs/wbs/xuanze_icon@2x.png"),
      src4: require("../../assets/imgs/wbs/xuanzeselect_icon@2x.png"),
      reg: /[\u4e00-\u9fa5]/, //中文正则,
      zblshow: false,
      show2: false,
      show3: false,
      menus1: {
        menu1: "好运宝收款",
        menu2: "银行卡收款",
      },
      yunfeiType: {}, // 运费类型
      payType: "请选择收款方式", //收款人类型
      zyCapitalCfg: "", //回款宝配置
      hybWalletCfg: "", //好运宝钱包配置
      drawMoneyState: "", // 提款状态
      haoyunbaoBank: "好运宝钱包",
      receiveState: false, // 默认收款人信息都可以修改
      wsMerchantId: "", // 网商商户号
      walletPay: "", // 是否是钱包收款
      buttonflag: 1,
      disabledSubmit: false, //防止多次提交
      disabledConfirm: false, //防止多次提交,confirm
      // value1:"未填写",
      alipayNo: "",
      payBankName: "",
      payBankNo: "",
      payName: "",
      isModifyElements: "", //0：可修改 1：不可修改

      changeState: 1, //默认收款方式栏位可以修改

      //查出来的收款人信息
      name: "",
      idCard: "",
      phoneNumber: "",
      aliNum: "",

      dataResult: "", // 返回的数据条数
      payMoneyStorehuosun: "", // 用来存储初始值
      payMoneyStoreother: "", // 用来存储其他初始值
      lossFeePayeeName: "", // 货损收款人姓名
      lossFeePayeeBankName: "", // 货损收款银行
      lossFeePayeeProvince: "", // 货损开户行省份
      lossFeePayeeCityName: "", // 货损开户行城市
      lossFeePayeeBankNo: "", // 货损收款人银行卡号

      // payeeListLength: "", // 收款人列表记录是否有数据
      driverWalletFalg: "", // 通过8003结果判断是否带钱包
      clearData: "0", // 点击清除按钮标志
      autoShowWalletCfg: "", //自动带钱包的配置
      advancePayState: "", // 付款方式
      collectTwoCfg: "", //到付金2配置
      collectionFlagCfg: "",
      showTips: false, // 司机没有开通好运宝，则显示提示语
      carMasterLength: 1, // 是否显示车队长提示语的标志
      lossEnsureFlag: "", // 货损保障状态
      autoWalletFlag: "", //自动获取钱包标识
      receivedHYBWalletFlag: false, // 是否已经自动带过钱包
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === "webUsuallyPay") {
        vm.receivedHYBWalletFlag = vm.applyPayMsg.receivedHYBWalletFlag;
        if (
          vm.applyPayMsg.bankName == "好运宝钱包" ||
          vm.applyPayMsg.bankName == "车队钱包" ||
          vm.applyPayMsg.bankName == "浙江网商银行"
        ) {
          vm.receiveState = true;
        }
        vm.backFlag = 1;
      }
      if (from.name === "carMasterReceiveMsg") {
        vm.receivedHYBWalletFlag = vm.applyPayMsg.receivedHYBWalletFlag;
        vm.carMasterFlag = 1;
      }
      //点击使用后，返回带回油卡号
      if (from.name == "chooseOilCard" || from.name == "addOilCard") {
        if (window.localStorage.getItem("oilCardNo")) {
          vm.oilCardNo = window.localStorage.getItem("oilCardNo");
          window.localStorage.removeItem("oilCardNo");
        }
        vm.oilCardNo = vm.chooseOilCardItem.oilCardNo;
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name != "chooseOilCard") {
      // 离开结算信息时清空选择油卡购物车
      let updateOpions = {
        type: "chooseOilCardItem",
      };
      this.$store.commit("cleanOildCardStatus", updateOpions);
    }
    let updateOpions = {
      payMoney: this.payMoney,
      cardNum: this.cardNum,
      personName: this.personName,
      bankNum: this.bankNum,
      bankName: this.bankName,
      bankAdress: this.bankAdress,
      payType: this.payType, //收款方式
      paidType: this.dataInitMsg.paidType, // 运费类型
      changeState: this.changeState, //是否可以点击修改
      clearData: this.clearData,
      walletPay: this.walletPay,
      receivedHYBWalletFlag: this.receivedHYBWalletFlag,
    };
    // 改变普通收款人数据
    this.$store.commit("updateApplyPayMsg", updateOpions);
    // 改变车队长收款人数据
    this.$store.commit("carTeamMasterInfo/setCarTeamInfo",{paidType: this.dataInitMsg.paidType,payMoney: this.payMoney});

    next();
  },
  computed: {
    chooseOilCardItem() {
      return this.$store.state.oilCard.chooseOilCardItem;
    },
    applyPayMsg() {
      return this.$store.state.applyPayMsg.applyPayMsg;
    },
    carTeamInfo() {
      return this.$store.state.carTeamMasterInfo.carTeamInfo;
    },
    btnState() {
      if (this.zyCapitalCfg == "8") {
        if (this.payType == "好运宝收款") {
          // 本人
          return 1;
        } else {
          if (
            this.personName !== "" &&
            this.cardNum.length === 18 &&
            this.bankNum !== "" &&
            this.bankAdress.length > 0 &&
            this.bankName.length > 0
          ) {
            return 1;
          } else {
            return 0;
          }
        }
      } else {
        if (
          this.personName !== "" &&
          this.cardNum.length === 18 &&
          this.bankNum !== "" &&
          this.bankAdress.length > 0 &&
          this.bankName.length > 0
        ) {
          return 1;
        } else {
          return 0;
        }
      }
    },
  },
  watch: {
    payMoney(newVal, oldVal) {
      if (!this.dataFlag) return false;
      if (this.dataInitMsg.paidType == "货损付") return false;
      if (
        newVal > Number(this.dataInitMsg.canPayMaxFreight) &&
        Number(this.dataInitMsg.canPayMaxFreight) > 0
      ) {
        this.payMoney = this.dataInitMsg.canPayMaxFreight;
        this.$vux.toast.text(
          `支付金额需小于等于总运费（${this.dataInitMsg.canPayMaxFreight}元）`
        );
        return false;
      }
      if (newVal < 0) {
        this.payMoney = "0.00";
        return false;
      }
      if (
        newVal.indexOf(".") > -1 &&
        newVal.substr(newVal.indexOf(".") + 1, newVal.length).length > 2
      ) {
        this.payMoney = Number(newVal).toFixed(2) + "";
        return false;
      }
    },
  },
  mounted() {
    this.$_getCompanyConfig().then((res) => {
      this.$_dataInit().then((res) => {
        this.$_zblStateMethod().then((res) => {
          // 从车队长收款人列表页面返回
          console.log(this.carMasterFlag)
          if (this.carMasterFlag) {
            this.personName = this.carTeamInfo.payeeName;
            this.cardNum = this.carTeamInfo.payeeIdCard;
            this.bankNum = this.carTeamInfo.payeeBankNo;
            this.bankName = this.carTeamInfo.payeeBankName
              ? [this.carTeamInfo.payeeBankName]
              : [];
            this.bankAdress = this.carTeamInfo.payeeProvinceId
              ? [this.carTeamInfo.payeeProvinceId, this.carTeamInfo.payeeCityId]
              : [];
            this.wsMerchantId = this.carTeamInfo.wsMerchantId;
            this.walletPay = this.carTeamInfo.acctType;
            this.dataInitMsg.paidType = this.carTeamInfo.paidType;
            this.payMoney = this.carTeamInfo.payMoney;
            this.receiveState = true;
          }
          // 从普通收款人列表返回
          if (this.backFlag) {
            this.cardNum = this.applyPayMsg.cardNum;
            this.personName = this.applyPayMsg.personName;
            this.bankNum = this.applyPayMsg.bankNum;
            this.bankName = this.applyPayMsg.bankName;
            this.bankAdress = this.applyPayMsg.bankAdress;
            this.payMoney = this.applyPayMsg.payMoney;
            this.changeState = this.applyPayMsg.changeState;
            this.wsMerchantId = this.applyPayMsg.wsMerchantId;
            this.walletPay = this.applyPayMsg.walletPay;
            this.clearData = this.applyPayMsg.clearData;
            this.payType = this.applyPayMsg.payType
              ? this.applyPayMsg.payType
              : "请选择收款方式";
            this.dataInitMsg.paidType = this.applyPayMsg.paidType
          }
          // 先判断是不是油卡
          if (
            !(
              this.prepaymentsOilCardNotPaid != "" &&
              Number(this.prepaymentsOilCardNotPaid) > 0
            )
          ) {
            //新的自动带钱包方式
            this.getHybWalletMethod();
          }
          //选择常用收款人后，带回收款人的姓名进行比较
          if (this.dataInitMsg.driverName == this.personName) {
            this.zblshow = true;
          } else {
            this.zblshow = false;
          }
        });
        this.dataFlag = 1;
        this.showPage = true;
      });
    });
  },
  methods: {
    $_getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let result = res.data.result;
              this.autoShowWalletCfg = result.autoShowWalletCfg;
              this.collectTwoCfg = result.collectTwoCfg;
              this.collectionFlagCfg = result.collectionFlagCfg;
              if (result.applePayCfg === "9") {
                this.$vux.confirm.show({
                  title: "提示",
                  confirmText: "确认",
                  cancelText: "取消",
                  content: "当前企业已关闭申请支付权限！",
                  showCancelButton: false,
                  onConfirm: () => {
                    AppFinish(-1);
                  },
                });
                reject();
              } else {
                resolve();
              }
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
    //收款人类型点击选择的值
    async menuCheck(key, val) {
      if (val == "好运宝收款") {
        if ((await this.fourElementMethods()) === 1) {
          if (this.changeState === 1) {
            this.payType = val;
          }
        }
      } else {
        this.payType = val;
      }
    },
    // 四要素公共接口
    fourElementMethods() {
      return new Promise((resolve, reject) => {
        if (this.zyCapitalCfg === "8") {
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          phoneGetName({ mobileNo: this.dataInitMsg.mobileNo })
            .then((res) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              if (Object.keys(res.data.result).length != "0") {
                let result = res.data.result;
                if (
                  result.driverName !== "" &&
                  result.alipayNo !== "" &&
                  result.mobileNo !== ""
                ) {
                  //四要素 已认证
                  this.changeState = 1;
                  this.name = result.driverName;
                  this.idCard = result.idCard;
                  this.phoneNumber = result.mobileNo;
                  this.aliNum = result.alipayNo;
                } else {
                  this.changeState = 0;
                  this.payType = "银行卡收款";
                }
              } else {
                this.changeState = 0;
                this.payType = "银行卡收款";
              }
              resolve(1);
            })
            .catch((err) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text(err.message, "middle");
              reject();
            });
        } else {
          resolve(2);
        }
      });
    },
    // 多重运费类型时 ，切换赋值
    yunfeiTypeCheck(key, val) {
      this.dataFlag = 1;
      if (val == "货损付") {
        this.walletPay = "";
        this.payMoney = this.payMoneyStorehuosun;
      } else {
        this.payMoney = this.payMoneyStoreother;
      }
      this.dataInitMsg.paidType = val;
    },
    receiveType() {
      //如果开通了回款保且四要素未认证的司机，则只能是银行卡收款
      if (
        (this.zyCapitalCfg == "8" && this.changeState == 0) ||
        (this.hybWalletCfg == "8" && this.zyCapitalCfg != "8")
      ) {
        return;
      }
      this.show2 = true;
    },
    receiveTypeShow() {
      if (this.dataResult.length == "1") {
        return;
      }
      this.show3 = true;
    },
    //点击跳转到油卡选择页面
    gotoSelectOilCard(item) {
      try {
        MtaH5.clickStat("alipay_oilcard");
      } catch (error) {
        JSON.stringify(error);
      }
      this.$router.push({
        path: "/chooseOilCard",
        query: {
          belongActSys: this.belongActSys,
          cartBadgeNo: this.dataInitMsg.cartBadgeNo,
          driverName: this.dataInitMsg.driverName,
          mobileNo: this.dataInitMsg.mobileNo,
          prepaymentsOilCard: item,
        },
      });
    },
    //若未从常用收款人信息里选择,手动输入收款人信息,则判断输入的收款人姓名与运单司机是否一致,一致时,显示支付宝账号字段,不一致时,则不显示
    receivePersionCheck(val) {
      if (this.dataInitMsg.driverName == val) {
        this.zblshow = true;
        // 没缓存。修复
        if (this.backFlag || this.carMasterFlag) {
          // 用过了，可以更改
          this.backFlag = 0;
          this.carMasterFlag = 0;
          return
        }
        // 2020/09/07
        if (this.receivedHYBWalletFlag || this.clearData == "1" ) {
          return;
        }
        if (
          this.hybWalletCfg == "8" &&this.driverWalletFalg == "1") {
          setTimeout(() => {
            let jsonData = {
              taxWaybillId: this.$route.query.taxWaybillId,
              mobileNo: this.dataInitMsg.mobileNo,
              payeeName: val,
              advancePayState: this.advancePayState,
            };
            this.$_getHYBwallet(jsonData);
          }, 50);
        }
      } else {
        this.zblshow = false;
      }
    },
    // 8007 获取好运宝钱包
    $_getHYBwallet(jsonData) {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      getHYBwallet(jsonData)
        .then((res) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode == "0") {
            let result = res.data.result;
            if (JSON.stringify(result) != "{}") {
              this.cardNum = result.payeeIdCard;
              this.bankNum = result.payeeBankNo;
              this.bankName = [result.payeeBankName];
              this.bankAdress = [result.payeeProvinceId, result.payeeCityId];
              this.wsMerchantId = result.wsMerchantId;
              this.walletPay = result.acctType;
              this.receiveState = true;
              this.payType = "银行卡收款";
              this.receivedHYBWalletFlag = true;
            } else {
              // 查询的时候，司机未开通好运宝钱包，则显示提示语，且禁用
              if (this.advancePayState == "1" && this.collectTwoCfg == "8") {
                this.showTips = true;
                this.receiveState = true;
              }
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch((err) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
    },
    //支付宝账号输入变化
    mobileChange(val) {
      //若收款人的支付宝账号和接单手机号一致时,可选中{接单手机号},即自动带出运单司机手机号
      if (val == this.dataInitMsg.mobileNo) {
        this.src1 = this.src4;
        this.jiedanState = "1";
      } else {
        this.src1 = this.src3;
        this.jiedanState = "";
      }
    },
    $_dataInit() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        applyDataInit(this.$route.query.taxWaybillId)
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.dataResult = res.data.result;
            // 区分是否有货损付
            if (this.dataResult.length > 1) {
              let result = this.dataResult[0];
              let arr = [];
              for (var i in this.dataResult) {
                arr.push(this.dataResult[i].paidType);
              }
              this.yunfeiType = Object.assign({}, arr);
              let peizhi = this.dataResult[1];
              this.advancePayState =
                peizhi.advancePayState || result.advancePayState;
              this.payMoneyStorehuosun = result.paidMoney;
              this.payMoneyStoreother = peizhi.paidMoney;
              Object.assign(this.dataInitMsg, peizhi);
              console.log(this.dataInitMsg);
              this.payType = "银行卡收款";
              this.payMoney = result.paidMoney;
              this.dataInitMsg.paidType = result.paidType;
              this.lossFeePayeeName = result.lossFeePayeeName; // 货损收款人姓名
              this.lossFeePayeeBankName = result.lossFeePayeeBankName; // 货损收款银行
              this.lossFeePayeeProvince = result.lossFeePayeeProvince; // 货损开户行省份
              this.lossFeePayeeCityName = result.lossFeePayeeCityName; // 货损开户行城市
              this.lossFeePayeeBankNo = result.lossFeePayeeBankNo; // 货损收款人银行卡号
              this.zyCapitalCfg = peizhi.zyCapitalCfg;
              this.hybWalletCfg = peizhi.hybWalletCfg;
              this.drawMoneyState = peizhi.drawMoneyState;
              this.insFeeState = peizhi.insFeeState;
              this.lossEnsureFlag = peizhi.lossEnsureFlag;
              this.autoWalletFlag = result.autoWalletFlag;
            } else {
              let result = this.dataResult[0];
              this.dataInitMsg.paidType = result.paidType;
              if (this.dataInitMsg.paidType == "货损付") {
                this.payType = "银行卡收款";
                this.dataInitMsg.xid = result.xid;
                this.lossFeePayeeName = result.lossFeePayeeName; // 货损收款人姓名
                this.lossFeePayeeBankName = result.lossFeePayeeBankName; // 货损收款银行
                this.lossFeePayeeProvince = result.lossFeePayeeProvince; // 货损开户行省份
                this.lossFeePayeeCityName = result.lossFeePayeeCityName; // 货损开户行城市
                this.lossFeePayeeBankNo = result.lossFeePayeeBankNo; // 货损收款人银行卡号
                this.lossEnsureFlag = result.lossEnsureFlag; // 货损保障状态
                this.insFeeState = result.insFeeState; //保价运输费状态
                this.dataInitMsg.insFee = result.insFee; //保价运输费
              } else {
                Object.assign(this.dataInitMsg, result);
                this.isModifyElements = result.isModifyElements;
                this.advancePayState = result.advancePayState;
                this.prepaymentsOilCardNotPaid =
                  result.prepaymentsOilCardNotPaid;
                this.lossEnsureFlag = result.lossEnsureFlag;
                if (this.oilCardNo == "") {
                  this.oilCardNo = result.oilCardNo;
                }
                if (this.zyCapitalCfg != "8") {
                  this.payType = "银行卡收款";
                } else {
                  if (result.payType == "1") {
                    this.payType = "好运宝收款";
                  } else if (result.payType == "0") {
                    this.payType = "银行卡收款";
                  } else {
                    this.payType = "请选择收款方式";
                  }
                }
                if (
                  this.prepaymentsOilCardNotPaid != "" &&
                  this.prepaymentsOilCardNotPaid > 0 &&
                  window.localStorage.getItem("oilCardNo") != null
                ) {
                  //点击使用后，返回带回油卡号
                  this.oilCardNo = window.localStorage.getItem("oilCardNo");
                  window.localStorage.removeItem("oilCardNo");
                }
                this.prepaymentsOilCard = result.prepaymentsOilCard;
                this.belongActSys = result.belongActSys;
                this.insFeeState = result.insFeeState;
                this.zyCapitalCfg = result.zyCapitalCfg;
                this.hybWalletCfg = result.hybWalletCfg;
                this.drawMoneyState = result.drawMoneyState;
                this.autoWalletFlag = result.autoWalletFlag;
                this.payName = result.payName;
                this.alipayNo = result.aliPayNo;
                this.payBankName = result.payBankName;
                this.payBankNo = result.payBankNo;
              }
              this.payMoney = result.paidMoney;
            }
            resolve();
          })
          .catch((err) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            reject();
          });
      });
    },
    // 获取自保理状态接口
    $_zblStateMethod() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        zblState()
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              this.zblState = res.data.result.zblState; //自保理状态
              this.dataInitMsg.alipayNo =
                this.zblState === "1" ? this.applyPayMsg.alipayNo : "";
              resolve();
            } else {
              reject();
            }
          })
          .catch((err) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            reject();
          });
      });
    },
    // 新的自动带钱包方式
    async getHybWalletMethod() {
      // 假设第一次进来没有值则走接口，有值则不走接口请求
      if ((this.backFlag || this.carMasterFlag) && this.personName) {
        return;
      }
      let result = await this.fourElementMethods();
      if (result === 1 && this.changeState === 1) {
        if (this.dataInitMsg.paidType == "货损付") {
          this.payType = "银行卡收款";
        } else {
          if (this.backFlag) {
            this.payType = "银行卡收款";
          } else {
            this.payType = "请选择收款方式";
          }
        }
      }
      if (this.autoWalletFlag === "1") {
        let json = {
          taxWaybillId: this.$route.query.taxWaybillId,
          mobileNo: this.dataInitMsg.mobileNo,
          payeeName: this.dataInitMsg.driverName,
          advancePayState: this.advancePayState,
        };
        this.$_getHYBwallet(json);
        this.personName = this.dataInitMsg.driverName;
      } else {
        if (this.dataInitMsg.paidType != "货损付") {
          // 查询收款人记录
          if (this.autoShowWalletCfg === "50" && this.advancePayState !== 1) {
            let json = {
              entType: 1,
              mobileNo: this.dataInitMsg.mobileNo,
              payeeName: this.dataInitMsg.driverName,
              hybWalletCfg: this.hybWalletCfg,
              taxWaybillId: this.$route.query.taxWaybillId,
              autoShowWalletCfg: this.autoShowWalletCfg,
              advancePayState: this.advancePayState,
              cartBadgeNo: this.dataInitMsg.cartBadgeNo,
              driverName: this.dataInitMsg.driverName,
            };
            this.$store.commit("updateLoadingStatus", { isLoading: true });
            getRecPayHistory(json).then((res) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              if (res.data.reCode === "0") {
                this.driverWalletFalg = res.data.result.driverWalletFalg; // 通过结果判断是否带钱包
              } else {
                this.$vux.toast.text(res.data.reInfo, "middle");
              }
            });
          }
          // 车队长信息查询不分垫付非垫付
          if (this.collectionFlagCfg === "46" && this.advancePayState === "1") {
            let json = {
              mobileNo: this.dataInitMsg.mobileNo,
              driverName: this.dataInitMsg.driverName,
              payeeName: this.dataInitMsg.driverName,
              advancePayState: this.advancePayState,
              cartBadgeNo: this.dataInitMsg.cartBadgeNo,
            };
            this.$_getCarMasterInfo(json);
          }
        }
        if (result !== 1) {
          this.payType = "银行卡收款";
        }
      }
    },
    // 8033 查询车队长
    $_getCarMasterInfo(json) {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCarMasterInfo(json)
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (
              res.data.reCode === "0" &&
              JSON.stringify(res.data.result) != "{}"
            ) {
              // 显示提示语的标志
              this.carMasterLength = res.data.result.payeeList.length;
              this.receiveState = true;
              resolve();
            }
            if (res.data.reCode !== "0") {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch((err) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            reject();
          });
      });
    },
    linkmanBtn() {
      if (this.collectionFlagCfg == "46" && this.advancePayState == "1") {
        this.$router.push({
          path: "/carMasterReceiveMsg",
          query: {
            advancePayState: this.advancePayState,
            mobileNo: this.dataInitMsg.mobileNo,
            payeeName: this.dataInitMsg.driverName,
            driverName: this.dataInitMsg.driverName,
            cartBadgeNo: this.dataInitMsg.cartBadgeNo,
          },
        });
      } else {
        this.$router.push({
          path: "/webUsuallyPay",
          query: {
            mobileNo: this.dataInitMsg.mobileNo,
            payeeName: this.dataInitMsg.driverName,
            driverName: this.dataInitMsg.driverName,
            cartBadgeNo: this.dataInitMsg.cartBadgeNo,
            hybWalletCfg: this.hybWalletCfg,
            taxWaybillId: this.$route.query.taxWaybillId,
            autoShowWalletCfg: this.autoShowWalletCfg,
          },
        });
      }
    },
    getBankNameAjax() {
      // 用户输入银行卡号失去焦点是查询开户行名称
      if (this.bankNum.length < 11) return false;
      getBankName(this.bankNum)
        .then((res) => {
          if (res.data.reCode === "0") {
            // this.$set(this.bankName,0,res.data.result)
            this.bankName = [];
            this.bankName.push(res.data.result);
          }
        })
        .catch((err) => {
          this.$vux.toast.text(err.message, "middle");
        });
    },
    bankListAjax() {
      // 获取所有开户行名称
      if (this.getBankListFlag) return false;
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      getBankList()
        .then((res) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.getBankListFlag = 1;
            let bankList1 = res.data.result.data.map((item) => {
              return item.bankName;
            });
            // 银行列表添加好运宝钱包
            if (this.hybWalletCfg == "8") {
              bankList1.push(this.haoyunbaoBank);
            }
            this.bankList.push(bankList1);
          } else {
            this.getBankListFlag = 0;
          }
        })
        .catch((err) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
          this.getBankListFlag = 0;
        });
    },
    suerBtnClick() {
      // if(!this.buttonflag){
      //   return false
      // }
      this.disabledSubmit = true;
      if (
        this.prepaymentsOilCardNotPaid != "" &&
        this.prepaymentsOilCardNotPaid > 0 &&
        this.payMoney != ""
      ) {
        if (this.oilCardNo == "") {
          this.$vux1.confirm.show({
            title: "提示",
            content: `<p style='color:#454545;'>不能申请支付</p><p style='color:#454545;'>请选择油卡！</p>`,
            confirmText: "选择油卡",
            showCancelButton: false,
            onConfirm: () => {
              this.$router.push({
                path: "/chooseOilCard",
                query: {
                  belongActSys: this.belongActSys,
                  cartBadgeNo: this.dataInitMsg.cartBadgeNo,
                  driverName: this.dataInitMsg.driverName,
                  mobileNo: this.dataInitMsg.mobileNo,
                  prepaymentsOilCard: this.prepaymentsOilCard,
                },
              });
            },
            OnCancel: () => {
              this.disabledSubmit = false;
            },
            onClose: () => {
              this.disabledSubmit = false;
            },
          });
          return false;
        } else {
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          let payType = "2"; //油卡付必须传 2
          let oilCardNo = this.oilCardNo;
          let xid = this.dataInitMsg.xid;
          let payeeAmount = this.payMoney;
          this.buttonflag = 0;
          sureApplyPay2(payType, oilCardNo, xid, payeeAmount)
            .then((res) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              if (res.data.reCode === "0") {
                if (this.type == 1) {
                  this.$vux.toast.text("申请支付成功！", "middle");
                } else {
                  this.$vux.toast.text(
                    "申请支付成功,可在运输中查看！",
                    "middle"
                  );
                }
                AppRefreshData({ type: "1" });
                setTimeout(() => {
                  // this.buttonflag = 1;
                  // this.disabledSubmit=false;
                  AppFinish(-1);
                }, 1000);
              } else {
                this.$vux.toast.text(res.data.reInfo, "middle");
                this.buttonflag = 1;
                this.disabledSubmit = false;
              }
            })
            .catch((error) => {
              this.buttonflag = 1;
              this.disabledSubmit = false;
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text("保存异常，请稍后再试~~~", "middle");
            });
        }
      } else {
        // 货损付
        if (this.dataInitMsg.paidType == "货损付") {
          //获取服务费
          let json = [
            {
              taxWaybillId: this.$route.query.taxWaybillId,
              paymentType: "0",
              payeeAmount: this.payMoney,
            },
          ];
          computedPayServerNum(json).then((res) => {
            // 8002
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              try {
                MtaH5.clickStat("websapplypay_btn");
              } catch (error) {
                JSON.stringify(error);
              }
              this.totalMoney2 = res.data.result.totalMoney;
              if (this.insFeeState == "0" || this.lossEnsureFlag == "0") {
                this.totalMoney3 = this.jia(
                  this.totalMoney2,
                  this.dataInitMsg.insFee
                );
              }
              this.huosunfuToast = true;
            }
          });
        } else {
          // rules
          if (this.payMoney === "" || Number(this.payMoney) === 0) {
            this.$vux.toast.text("收款人金额须大于0", "middle");
            this.disabledSubmit = false;
            return false;
          }
          if (!this.btnState) {
            let cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if (
              this.cardNum.length < 18 &&
              this.cardNum.length > 0 &&
              !cP.test(this.cardNum)
            ) {
              this.$vux.toast.text("收款人身份证号码输入错误~~~", "middle");
              this.disabledSubmit = false;
              return false;
            }
            this.$vux.toast.text("请输入完整的收款人信息~~~", "middle");
            this.disabledSubmit = false;
            return false;
          }
          if (
            this.zyCapitalCfg !== "8" &&
            this.zblState == 1 &&
            this.zblshow == true &&
            this.dataInitMsg.alipayNo == ""
          ) {
            this.$vux.toast.text("支付宝账号不能为空", "middle");
            this.disabledSubmit = false;
            return false;
          }
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          if (this.zyCapitalCfg == "8") {
            if (this.payType == "好运宝收款") {
              this.payMoneyServerNum(); // 不用验证身份证网关
            } else {
              this.gateCheckOfCardNumAjax(); // 验证身份证网关
            }
          } else {
            this.gateCheckOfCardNumAjax(); // 验证身份证网关
          }
        }
      }
      // this.disabledSubmit=false;
    },
    gateCheckOfCardNumAjax() {
      gateCheckOfCardNum(this.personName, this.cardNum)
        .then((res) => {
          if (res.data.reCode === "0") {
            this.payMoneyServerNum();
          } else {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(res.data.reInfo, "middle");
            this.disabledSubmit = false;
          }
        })
        .catch((error) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text("网关异常，请稍后再试~~~", "middle");
          this.disabledSubmit = false;
        });
    },
    payMoneyServerNum() {
      //获取服务费
      let eapfList = [
        {
          taxWaybillId: this.$route.query.taxWaybillId,
          paymentType: "0",
          payeeAmount: this.payMoney,
        },
      ];
      computedPayServerNum(eapfList)
        .then((res) => {
          // 8002
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            try {
              MtaH5.clickStat("websapplypay_btn");
            } catch (error) {
              JSON.stringify(error);
            }
            this.totalMoney = res.data.result.totalMoney;
            //条件满足的情况下，调用接口后，计算两个返回的值，显示的数值精确到小数点后两位
            if (this.insFeeState == "0" || this.lossEnsureFlag == "0") {
              this.totalMoney1 = this.jia(
                this.totalMoney,
                this.dataInitMsg.insFee
              );
            }
            this.$nextTick(() => {
              this.sureAlertFlag = true;
            });
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
            this.disabledSubmit = false;
          }
        })
        .catch((error) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.disabledSubmit = false;
          this.$vux.toast.text("支付服务费获取异常，请稍后再试~~~", "middle");
        });
    },
    surePayBtn() {
      // 申请支付按钮确认
      this.disabledConfirm = true;
      this.sureAlertFlag = false;
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let alipayNo, payeeName, payeeBankName, payeeBankNo;
      if (
        this.zyCapitalCfg == "8" &&
        this.payType == "好运宝收款" &&
        window.sessionStorage.isChooseType == "2"
      ) {
        alipayNo = window.localStorage.getItem("alipayNo");
        payeeName = window.localStorage.getItem("driverName");
        payeeBankName = window.localStorage.getItem("bankName")[0];
        payeeBankNo = window.localStorage.getItem("bankNum");
      } else {
        alipayNo = this.dataInitMsg.alipayNo;
        payeeName = this.trim(this.personName);
        payeeBankName = this.bankName[0];
        payeeBankNo = this.trim(this.bankNum);
      }
      let options = {
        payType: "0",
        xid: this.dataInitMsg.xid,
        payeeName: payeeName,
        payeeProvinceId:
          this.collectionFlagCfg == "46" && this.advancePayState == "1"
            ? this.carTeamInfo.payeeProvinceId
            : this.zyCapitalCfg == "8" && this.payType == "好运宝收款"
            ? ""
            : payeeBankName == "好运宝钱包"
            ? "7"
            : this.bankAdress[0],
        payeeCityId:
          this.collectionFlagCfg == "46" && this.advancePayState == "1"
            ? this.carTeamInfo.payeeCityId
            : this.zyCapitalCfg == "8" && this.payType == "好运宝收款"
            ? ""
            : payeeBankName == "好运宝钱包"
            ? "701"
            : this.bankAdress[1],
        payeeBankNo: this.payType == "好运宝收款" ? "" : payeeBankNo,
        payeeBankName:
          this.advancePayState == "1" && this.collectionFlagCfg == "46"
            ? ""
            : this.payType == "好运宝收款"
            ? ""
            : payeeBankName == "好运宝钱包"
            ? "浙江网商银行"
            : payeeBankName,
        payeeIdCard: this.cardNum,
        payeeAmount: this.payMoney,
        mobileNo:
          this.zblshow == true && this.zblState == "1"
            ? this.dataInitMsg.mobileNo
            : "", //非本人不传手机号和支付宝
        alipayNo: alipayNo, //支付宝账号
        hkbPayType: this.payType == "好运宝收款" ? "1" : "0", //收款人类型 0：非本人 1：本人
        wsMerchantId:
          this.payType == "好运宝收款"
            ? ""
            : payeeBankName == "好运宝钱包"
            ? this.wsMerchantId
            : "", // 网商商户号  钱包收款必填
        walletPay:
          this.carTeamInfo.acctType == "6" || this.walletPay == "6"
            ? "2"
            : this.payType == "好运宝收款"
            ? "0"
            : this.walletPay == "5" || this.carTeamInfo.acctType == "5"
            ? "1"
            : "0", // 是否是钱包收款 0：否 1：是
      };
      console.log(this.carTeamInfo.acctType);
      console.log(options);
      this.buttonflag = 0;
      sureApplyPay(options)
        .then((res) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            if (this.type == 1) {
              this.$vux.toast.text("申请支付成功！", "middle");
            } else {
              this.$vux.toast.text("申请支付成功,可在运输中查看！", "middle");
            }
            AppRefreshData({ type: "1" });
            setTimeout(() => {
              AppFinish(-1);
            }, 1000);
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
            this.buttonflag = 1;
            this.disabledSubmit = false;
            this.disabledConfirm = false;
          }
        })
        .catch((error) => {
          this.disabledSubmit = false;
          this.disabledConfirm = false;
          this.buttonflag = 1;
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text("保存异常，请稍后再试~~~", "middle");
        });
    },
    // 货损付的确认申请
    huosunfuSurePayBtn() {
      this.disabledConfirm = true;
      this.huosunfuToast = false;
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let options = {
        payType: "1", // 货损付
        xid: this.dataInitMsg.xid,
        payeeName: this.lossFeePayeeName,
        payeeProvince: this.lossFeePayeeProvince,
        payeeCity: this.lossFeePayeeCityName,
        payeeProvinceId: "",
        payeeCityId: "",
        payeeBankNo: this.lossFeePayeeBankNo,
        payeeBankName: this.lossFeePayeeBankName,
        payeeIdCard: "",
        payeeAmount: this.payMoney,
        mobileNo: "", //非本人不传手机号和支付宝
        alipayNo: "", //支付宝账号
        hkbPayType: "", //收款人类型 0：非本人 1：本人
        wsMerchantId: "", // 网商商户号  钱包收款必填
        walletPay: "", // 是否是钱包收款 0：否 1：是
      };
      console.log(options);
      this.buttonflag = 0;
      sureApplyPay(options)
        .then((res) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            if (this.type == 1) {
              this.$vux.toast.text("申请支付成功！", "middle");
            } else {
              this.$vux.toast.text("申请支付成功,可在运输中查看！", "middle");
            }
            AppRefreshData({ type: "1" });
            setTimeout(() => {
              AppFinish(-1);
            }, 1000);
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
            this.buttonflag = 1;
            this.disabledSubmit = false;
            this.disabledConfirm = false;
          }
        })
        .catch((error) => {
          this.disabledSubmit = false;
          this.disabledConfirm = false;
          this.buttonflag = 1;
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text("保存异常，请稍后再试~~~", "middle");
        });
    },
    //自定义去前后空格的方法
    trim: function (i) {
      //   return i.toString().replace(/(^\s*)|(\s*$)/g, "");
      return i.toString().replace(/\s/g, "");
    },
    //支付总金额计算计算方法
    jia: function (s, r) {
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
      return parseFloat(((s * o + r * o) / o).toFixed(u));
    },
    //切换接单手机号选中状态
    changeType(item) {
      if (item == "") {
        this.src1 = this.src3;
        this.dataInitMsg.alipayNo = "";
      } else {
        //选中的状态
        this.src1 = this.src4;
        this.dataInitMsg.alipayNo = this.dataInitMsg.mobileNo;
      }
      this.jiedanState = item;
    },
    // 清空收款人信息
    clearAll() {
      this.cityList = "";
      this.cityList = cityDataToIWant(city.data);
      this.personName = "";
      this.cardNum = "";
      this.bankNum = "";
      this.bankName = [];
      this.bankAdress = [];
      this.receiveState = false;
      // 存储状态
      if (this.walletPay != "6") {
        // 清除车队钱包不算真的清除
        this.clearData = "1";
      }
      this.walletPay = "";
    },
  },
};
</script>
<style lang="less" >
.wbs-apply-pay {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .vux-cell-bd {
    .vux-label {
      color: #797979 !important;
    }
  }
  .group2 {
    .vux-cell-primary {
      color: #797979;
    }
    .weui-cell__ft {
      text-align: left !important;
      width: 60% !important;
      color: #202020 !important;
    }
  }
  .img1 {
    width: 8px;
    height: 8px;
  }
  .vux-cell-box,
  .weui-cell {
    font-size: 16px;
  }

  .weui-cell__ft {
    color: #202020;
  }
  .cell-before {
    border-top: 1px solid #d9d9d9;
  }
  .line {
    content: " ";
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
  .pay-money-ipt {
    height: 42px;
    display: flex;
    align-items: center;
    .left {
      font-size: 16px;
      color: #797979;
      padding-left: 38px;
      width: 85px;
    }
    input[disabled] {
      background: #fff;
      border: none;
      font-size: inherit;
      color: inherit;
      -webkit-opacity: 1;
      opacity: 1;
      -webkit-text-fill-color: inherit;
    }
    .right {
      width: 50%;
      color: #202020;
      font-size: 16px;
      color: #202020;
      height: 24px;
      padding: 6px 0px;
      outline: none;
      border: none;
      text-indent: 12px;
      background-color: #dfdfdf;
      border-radius: 10px;
      margin-left: 12px;
      input::-webkit-input-placeholder {
        font-size: 16px;
        color: #9f9f9f;
      }
      .cell-before {
        border-top: 1px solid #d9d9d9;
      }
      .line {
        content: " ";
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
    }
  }
  .apply-pay-msg {
    min-height: 46px;
    height: auto;
    background-color: #fff;
    margin-top: 10px;
    .msg-title {
      padding: 0 12px;
      height: 48px;
      line-height: 48px;
      border-bottom: 1px solid #cfcfcf;
      font-weight: bold;
    }
    .msg-item {
      padding: 0 12px;
      display: flex;
      min-height: 36px;
      height: auto;
      align-items: center;
      font-size: 15px;
      .left {
        color: #797979;
      }
      .right {
        flex: 1;
        word-break: break-word;
        color: #202020;
      }
    }
  }
  .common-person {
    font-size: 13px;
    padding: 6px 4px;
    color: #fff;
    background-color: #ffba00;
    border-radius: 10px;
  }
  .labe-left {
    font-size: 16px;
    color: #797979;
    text-align: right;
    width: 7em;
    display: block;
  }
  .value-right {
    color: #202020;
    font-size: 16px;
  }
  input::-webkit-input-placeholder {
    font-size: 16px;
    color: #9f9f9f;
  }
  .weui-input,
  .cell-left-style {
    color: #202020;
    font-size: 16px;
  }
  .pay-ipt-style {
    .weui-input {
      background-color: #dfdfdf;
      height: 34px;
      border-radius: 5px;
      width: 50%;
      padding-left: 16px;
    }
  }
  .msg-send-cxt {
    position: relative;
    .weui-label {
      color: #797979;
    }
    .weui-cell__bd {
      flex: 0;
    }
    .weui-switch:before,
    .weui-switch-cp__box:before {
      background-color: #9f9f9f;
    }
    .weui-switch:checked,
    .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
      border-color: #1581cf;
      background-color: #1581cf;
    }
    .vux-label-desc {
      position: absolute;
      top: 17px;
      font-size: 16px;
      left: 170px;
    }
  }
  .weui-cell:before,
  .vux-cell-box:not(:first-child):before {
    left: 0px;
  }
  .sure-btn-cxt {
    // position: fixed;
    height: 60px;
    width: 100%;
    // background-color: #ffff;
    display: flex;
    align-items: center;
    bottom: 0px;
    margin-bottom: 20px;
    .weui-btn_disabled {
      background: #9e9e9e;
    }
    button {
      width: 90%;
      height: 48px;
      background-color: #15499a;
    }
  }
  .vux-cell-placeholder {
    font-size: 16px;
    color: #9f9f9f;
  }
  .textColor1 {
    .vux-cell-value {
      font-size: 16px;
      -webkit-text-fill-color: #999 !important;
    }
  }
  .textColor2 {
    .vux-cell-value {
      font-size: 16px;
    }
  }
}
.apply-pay-alert {
  .apply-alert-title {
    height: 46px;
    line-height: 46px;
    color: #fff;
    background-color: #15499a;
    font-size: 18px;
  }
  .apply-pay-msg {
    // background-color: #fff;
    padding: 20px 0px;
    line-height: 24px;
    font-size: 16px;
    .baozhangStyle {
      font-size: 14px;
      // background-color: #f7f7f7;
      width: 200px;
      margin-top: 5px;
      display: inline-block;
      text-align: left;
      background: url("../../assets/imgs/goodsDamage/bg_img@2x.png") no-repeat
        center center;
      background-size: 100% 100%;
      padding: 12px 0px 6px;
      .list-left {
        width: 100px;
        text-align: right;
        color: #818181;
        display: inline-block;
      }
      .list-right {
        text-align: left;
        color: #202020;
      }
    }
    .normalStyle {
      color: #ffba00;
      // width: 240px;
      margin-top: 5px;
      word-break: break-all;
      text-align: center;
      display: inline-block;
      .list-left {
        // width: 100px;
        text-align: right;
        display: inline-block;
      }
      .list-right {
        text-align: left;
        .premium {
          font-size: 14px;
        }
      }
    }
  }
  .pay-person-msg {
    padding: 15px;
    text-align: start;
    .person-msg-list {
      display: flex;
      font-size: 15px;
    }
    .list-left {
      color: #797979;
    }
    .list-right {
      color: #202020;
      flex: 1;
      word-break: break-word;
    }
  }
  .contor-btn-cxt {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px 0px;
    .contor-left-btn {
      width: 110px;
      height: 40px;
      text-align: center;
      line-height: 42px;
      color: #15499a;
      border: 1px solid #15499a;
      border-radius: 7px;
    }
    .contor-right-btn {
      width: 110px;
      height: 42px;
      text-align: center;
      line-height: 42px;
      color: #ffffff;
      background-color: #15499a;
      border-radius: 7px;
    }
  }
}
</style>
