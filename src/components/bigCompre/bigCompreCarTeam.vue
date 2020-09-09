<template>
  <div class="big-compre-car-team" v-show="pageShow">
    <c-header>
      <x-header :left-options="{ backText: '' }">承运信息</x-header>
    </c-header>
    <div style="height:10px;background-color:#EFEFEF"></div>
    <div class="car-msg-cxt">
      <div class="car-title-cxt">
        <span>请手动填写承运信息或从</span>
        <div class="car-choose-btn" @click="chooseBtnClick()">我的车队选择</div>
      </div>
    </div>
    <div class="car-ipt-cxt">
      <group>
        <x-input
          :rows="1"
          autosize
          :show-counter="false"
          placeholder="请输入司机姓名"
          :max="64"
          v-model.trim="driverName"
        >
          <div slot="label">
            <img class="star-icon-style1" :src="bitian" alt style="vertical-align:middle;" />
            <span style="vertical-align:middle;">司机姓名：</span>
          </div>
        </x-input>
        <x-input
          type="tel"
          ref="PhoneNumber"
          v-model.trim="mobileNo"
          is-type="china-mobile"
          :max="11"
          placeholder="请输入司机手机"
        >
          <div slot="label">
            <img class="star-icon-style1" :src="bitian" alt style="vertical-align:middle;" />
            <span style="vertical-align:middle;">司机手机：</span>
          </div>
        </x-input>
        <cell title="车牌号码：" value-align="left" @click.native="carNumIpt" is-link>
          <span
            slot="value"
            :class="{ 'cell-left-style': cartBadgeNo !== '请输入车牌号码' }"
          >{{ cartBadgeNo }}</span>
          <div slot="icon">
            <img
              class="star-icon-style1"
              :src="bitian"
              alt
              style="padding-right: 4px;vertical-align:middle;"
            />
          </div>
        </cell>
        <div class="tips">
          <img :src="warnning" alt width="15px" />
          请保证车牌号码与磅单中的车牌号码一致
        </div>
        <cell title="收款人信息：" is-link value-align="left" @click.native="receiveBill">
          <span :class="{ 'cell-left-style': receiveName !== '未填写' }">{{ receiveName }}</span>
        </cell>
      </group>
    </div>
    <div style="height:60px;"></div>
    <div id="button">
      <x-button
        type="primary"
        :style="{ backgroundColor: btnState === 1 ? '#15499A' : '#9e9e9e' }"
        @click.native="nextBtnClick()"
        v-show="style !== 1"
      >下一步</x-button>
      <x-button
        type="primary"
        :style="{ backgroundColor: btnState === 1 ? '#15499A' : '#9e9e9e' }"
        @click.native="buildWayBill()"
        v-show="style === 1"
      >建单</x-button>
    </div>
  </div>
</template>
<script>
import {
  queryWaybill,
  driverNext,
  buildWaybillAgain,
  getCompanyConfig
} from "../../api/api.js";
import { dazongBuildWaybill } from "../../api/dazongapi.js";
import { AppFinish } from "../../utils/app.js";
export default {
  name: "bigCompreCarTeam",
  data() {
    return {
      bitian: require("../../assets/imgs/wbs/bitian_icon@2x.png"),
      warnning: require("../../assets/imgs/wbs/zhuyi_icon_red@2x.png"),
      receiveName: "未填写", //收款人信息
      driverName: "", //司机姓名
      mobileNo: "", //司机手机
      cartBadgeNo: "请输入车牌号码", //车牌号码
      cartBadgeNoStore: "",
      pageShow: false, //默认不展示页面
      style: "", //大综类型 1 企业
      transportUnitPriceType: this.$route.query.transportUnitPriceType || "0",
      hybWalletCfg: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "bigCompreWayBillInfo") {
      next(vm => {
        vm.style = 1;
      });
    }
    next(vm => {
      vm.$store.commit("updateLoadingStatus", { isLoading: false });
      vm.driverName = vm.weyBillSecond.driverName;
      vm.mobileNo = vm.weyBillSecond.mobileNo;
      vm.cartBadgeNo = vm.weyBillSecond.cartBadgeNo;
      vm.receiveName =
        window.sessionStorage.isChooseType === "1"
          ? vm.reciveMsgPay.recivePersonName
          : "未填写"; //携带过来收款人姓名
    });
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.pageShow = true;
    });
  },
  computed: {
    weyBillSecond() {
      return this.$store.state.wayBill.weyBillSecond;
    },
    reciveMsgPay() {
      return this.$store.state.wayBill.reciveMsgPay;
    },
    dazongFirstqiye() {
      return this.$store.state.dazong.dazongFirstqiye;
    },
    btnState() {
      if (
        this.mobileNo.length === 11 &&
        this.driverName.length > 0 &&
        this.cartBadgeNo.length > 6 &&
        this.cartBadgeNo != "请输入车牌号码"
      ) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  methods: {
    _getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              this.hybWalletCfg = res.data.result.hybWalletCfg;
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
    //点击收款人信息,跳转页面
    receiveBill() {
      let updateOpions = {
        type: "weyBillSecond",
        updatMsg: {
          driverName: this.driverName,
          mobileNo: this.mobileNo,
          cartBadgeNo: this.cartBadgeNo
        }
      };
      this.$store.commit("updateWayBillStatus", updateOpions);
      this.$router.push({
        path: "/webReciveMsg",
        query: {
          mobileNo: this.mobileNo,
          driverName: this.driverName,
          cartBadgeNo: this.cartBadgeNo
        }
      });
    },
    queryWaybill() {
      this.cartBadgeNo = this.cartBadgeNo;
      this.driverName = this.driverName;
      this.mobileNo = this.mobileNo;
      this.carType = this.carType;
      this.carLength = this.carLength;
      this.carTonNumber = this.carTonNumber;
      queryWaybill().then(res => {
        //3013
        if (this.taxWaybillId !== undefined) {
        } else {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        }
      });
    },
    chooseBtnClick() {
      try {
        MtaH5.clickStat("my_car_team_btn");
      } catch (error) {
        JSON.stringify(error);
      }
      this.$router.push({
        path: "/wbsTeamChoose"
      });
    },
    checkNextClick() {
      let cartBadgeCheck = /^([\u4E00-\u9FA5](([0-9A-Z]{6,7})|([0-9A-Z]{5,6}[\u4E00-\u9FA5]{1})))$/;
      if (
        this.driverName === "先生" ||
        this.driverName === "微信注册车辆" ||
        this.driverName === "M信用开通司机"
      ) {
        this.$vux.toast.text(
          "司机姓名输入名称不可为：" + this.driverName,
          "middle"
        );
        return false;
      }
      //司机姓名64位规则验证
      if (this.driverName.length > 64) {
        this.$vux.toast.text("司机姓名长度最大不可超过64位", "middle");
        return false;
      }
      //司机手机号验证
      let re = /^1\d{10}$/;
      if (!re.test(this.mobileNo)) {
        this.$vux.toast.text("司机手机号码输入错误", "middle");
        return false;
      }
      return true;
    },
    nextBtnClick() {
      if (!this.btnState) return false;
      if (!this.checkNextClick()) {
        return;
      }
      this.driverNextBtn();
    },
    carNumIpt() {
      let _this = this;
      this.$carIpt({
        dpCartNum:
          this.cartBadgeNo !== "" && this.cartBadgeNo !== "请输入车牌号码"
            ? this.cartBadgeNo
            : "",
        fn: function(res) {
          _this.cartBadgeNo = res === "" ? "请输入车牌号码" : res;
        }
      });
    },
    //点击下一步的时候必须走这个方法
    driverNextBtn() {
      if (this.mobileNo != "" && this.cartBadgeNo != "") {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        driverNext(
          this.mobileNo,
          this.cartBadgeNo,
          this.driverName,
          "0",
          "0",
          "0"
        )
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$router.push({
              path: "/bigCompreSettlementInfo", //上传磅单页面
              query: {
                pageType: 0
              }
            });
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$router.push({
              path: "/bigCompreSettlementInfo", //上传磅单页面
              query: {
                pageType: 0
              }
            });
          });
      } else {
        this.$router.push({
          path: "/bigCompreSettlementInfo", //上传磅单页面
          query: {
            pageType: 0
          }
        });
      }
    },
    //建单按钮
    buildWayBill() {
      if (!this.btnState) return false;
      if (!this.checkNextClick()) {
        return;
      }
      if (this.mobileNo != "" && this.cartBadgeNo != "") {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        driverNext(
          this.mobileNo,
          this.cartBadgeNo,
          this.driverName,
          "0",
          "0",
          "0"
        ).then(res => {
          this.buildWaybill();
        });
      }
    },
    //去建单
    buildWaybill() {
      let shoukuanrenleixing = "";
      if (
        window.sessionStorage.isChooseType === "1" &&
        this.reciveMsgPay.recivePersonName == this.driverName
      ) {
        shoukuanrenleixing = "1";
      } else {
        shoukuanrenleixing = "0";
      }

      let json = {
        transportLineId: this.dazongFirstqiye.transportLineId,
        taxWaybillNo: this.dazongFirstqiye.taxWaybillNo, //运单号
        endProvinceId: this.dazongFirstqiye.endProvinceCode,
        endCityId: this.dazongFirstqiye.endCityCode,
        endCountyId: this.dazongFirstqiye.endCountyCode,
        startProvinceId: this.dazongFirstqiye.startProvinceCode,
        startCityId: this.dazongFirstqiye.startCityCode,
        startCountyId: this.dazongFirstqiye.startCountyCode,
        payType: shoukuanrenleixing, //正常的收款人类型
        hkbPayeeType: "0", //回款宝收款人类型
        payName:
          window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonName
            : "", //收款人姓名
        payIdCard:
          window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonCardNum
            : "", //收款人身份证
        alipayNo:
          window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.alipayNo
            : "", //收款人支付宝账号
        payBankNo:
          window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonBankNum
            : "", //收款人银行卡号
        payBankName:
          window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBank[0]
            : "", //收款银行名称
        provinceId:
          window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBankAdress[0]
            : "", //开户行省份
        cityId:
          window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBankAdress[1]
            : "", //开户行城市
        payMobileNo:
          window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonphoneNum
            : "", //收款人手机号
        startTime: this.dazongFirstqiye.startTime, //发车时间
        driverName: this.driverName, //司机姓名
        mobileNo: this.mobileNo, //司机手机号
        cartBadgeNo: this.cartBadgeNo, //司机车牌号
        goodsName: this.dazongFirstqiye.goodsName, //货物名称
        goodsAmountType: this.transportUnitPriceType,
        unitPrice: this.dazongFirstqiye.unitPrice, //单价
        tranRequire: this.dazongFirstqiye.requirement, //运输要求
        drawee: this.dazongFirstqiye.drawee, //受票方名称
        taxDraweePartyId: this.dazongFirstqiye.taxDraweePartyId, //受票方ID
        loadingAddressName: this.dazongFirstqiye.loadingAddressName,
        unloadingAddressName: this.dazongFirstqiye.unloadingAddressName,
        wbMode: "2", //建单模式传0  补单传1 建单 2
        tripFlag: this.dazongFirstqiye.tripFlag,
        consignor: this.dazongFirstqiye.consignor[0],
        wbItem: this.dazongFirstqiye.wbItem
      };
      console.log(json);
      dazongBuildWaybill(json)
        .then(res => {
          //3066
          if (res.data.reCode === "0") {
            //建单成功~，页面跳转回【我的运单—运输中】页面
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            let taxWaybillId = res.data.result.taxWaybillId;
            let obj = {
              driverName: this.driverName,
              mobileNo: this.mobileNo,
              cartBadgeNo: this.cartBadgeNo
            };
            let updateOpions = {
              type: "weyBillSecond",
              updatMsg: obj
            };
            this.$store.commit("updateWayBillStatus", updateOpions);
            this.$router.push({
              path: "/wayBillSuccess",
              query: {
                taxWaybillId: taxWaybillId,
                mobileNo: this.weyBillSecond.mobileNo,
                driverName: this.weyBillSecond.driverName,
                cartBadgeNo: this.weyBillSecond.cartBadgeNo,
                dazongState: "1"
              }
            });
          } else {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
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
    }
  }
};
</script>
<style lang="less">
@import "../../assets/styles/common.less";
.big-compre-car-team {
  .star-icon-style {
    width: 20px;
    height: 20px;
  }
  .star-icon-style1 {
    width: 8px;
    height: 8px;
  }
  #button {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 10;
    .weui-btn {
      width: 90%;
      height: 48px;
      background-color: #15499a;
      margin: 10px auto;
    }
  }
  .car-msg-cxt {
    padding: 13px;
    .car-title-cxt {
      .wh(100%;40px);
      color: @text-color-common;
      font-size: 17px;
      @media screen and (max-width: 320px) {
        font-size: 14px;
      }
      line-height: 40px;
      .car-choose-btn {
        .wh(120px;36px);
        text-align: center;
        line-height: 36px;
        color: @text-color-white;
        font-size: 16px;
        background-color: #1581cf;
        border-radius: 20px;
        display: inline-block;
      }
    }
    .title-star-style {
      color: #ffba00;
    }
  }
  .weui-cell,
  .vux-cell-box {
    font-size: 16px;
  }
  .car-ipt-cxt {
    width: 93%;
    margin-left: 3.5%;
    height: auto;
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    .weui-cell__hd,
    .vux-label {
      color: #797979;
      font-size: 16px;
    }
    .vux-cell-align-left {
      font-size: 16px;
      color: #9f9f9f;
    }
    .weui-cell:before {
      left: 0px;
    }
    .weui-textarea,
    .weui-input {
      padding-top: 2px;
    }
    input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder {
      color: #9f9f9f;
    }
    textarea:disabled {
      background: #fff;
    }
    .weui-input,
    .cell-left-style {
      color: #202020;
    }
  }
  .vux-popup-header {
    background-color: #15499a;
    color: #fff;
    .vux-popup-header-left {
      color: #fff;
    }
    .vux-popup-header-title {
      color: #fff;
    }
    .vux-popup-header-right {
      color: #fff;
    }
  }
  .car-msg-choose {
    width: 100%;
    min-height: 56px;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    .car-choose-btn {
      width: 30%;
      text-align: center;
      height: 2rem;
      line-height: 2rem;
      border-radius: 0.3125rem;
      color: #797979;
      background: #f6f6f6;
      margin: 0.625rem 0.3rem;
    }
    .choose-btn-active {
      background-color: #1581cf;
      color: #fff;
    }
  }
  .self-ipt {
    // float: left;
    // font-size: 13px;
    // color: #1581CF;
    // margin-right: 16px;
    // text-decoration: underline;
    font-size: 16px;
    color: #797979;
    display: block;
    height: 36px;
    padding-left: 6px;
    background: #fff;
    padding-bottom: 10px;
    input {
      font-size: inherit;
      color: #797979;
      width: 65%;
      height: 32px;
      line-height: 32px;
      border: 1px solid #d9d9d9;
      margin-left: 2.4%;
      text-indent: 5px;
      outline: none;
      background: #f6f6f6;
    }
  }
  .tips {
    font-size: 14px;
    color: #ff3333;
    text-indent: 1em;
  }
}
</style>
