<template>
  <div class="way-bill-success">
    <c-header :isShowTitle="newVersionBoolean">
      <!-- <van-nav-bar @click-left="onClickLeft" :title="headTitle" left-arrow :fixed="true" /> -->
      <x-header :left-options="{ backText: '' ,preventGoBack:true}" @on-click-back="goback()">
        建单成功
        <div
          v-show="!dazongState && wbBusinessType != 2"
          slot="right"
          class="right-title"
          @click="buildAgain"
        >再建一单</div>
      </x-header>
    </c-header>
    <div class="img-container">
      <img src="../../assets/imgs/wbs/jiandancheng_icon@2x.png" alt width="65" height="80" />
      <p class="success_tip">新建运单成功！</p>
    </div>
    <div class="baozhangContent" v-show="orgCfg713 === '8' && orgCfg714 != '54' && orgCfg715">
      <div class="card">
        <img src="../../assets/imgs/goodsDamage/huosunbaozh_icon@2x.png" alt class="left" />
        <p class="right">
          司机接单后，本趟运输即可获得货损保障服务，
          <span class="yellow">保障额度{{this.orgCfg715}}元</span>。发生货损后，请提醒司机与保障专员联系！
        </p>
      </div>
    </div>
    <div v-if="newVersionBoolean">
      <div class="content-container">
        <div v-show="!dazongState&&templateShow && wbBusinessType != 2">
          <x-button
            class="chakan"
            @click.native="setTemplate"
            :disabled="!templateStateDisabled"
            :text="setContent"
          ></x-button>
        </div>
        <div>
          <x-button class="chakan" @click.native="checkWayBill">查看运单</x-button>
          <x-button class="chakan" @click.native="goonConfirm" v-show="wbBusinessType == 2">继续确认</x-button>
        </div>
      </div>
      <div class="bottom-container" v-if="pageState">
        <div class="bg-box" @click="_buildWaybillAgain">
          <div class="placeholder"></div>
          <div class="text">
            <div>司机证件识别未完善,</div>
            <div>请协助司机完成证件识别~</div>
          </div>
          <div class="circle">
            <div>去完善</div>
            <div>>></div>
          </div>
        </div>
      </div>
    </div>
    <div class="oldList" v-if="!newVersionBoolean">
      <div>
        <x-button class="chakan" @click.native="checkWayBill">查看运单</x-button>
      </div>
      <div v-show="!dazongState&&templateShow">
        <x-button
          class="chakan"
          @click.native="setTemplate"
          :disabled="!templateStateDisabled"
          :text="setContent"
        ></x-button>
      </div>
      <div v-show="!dazongState">
        <x-button class="chakan" @click.native="buildAgain">再建一单</x-button>
      </div>
    </div>

    <!-- 弹框-->
    <van-popup
      v-model="popupState"
      round
      :close-on-popstate="true"
      :close-on-click-overlay="false"
      :safe-area-inset-bottom="true"
      :style="{ width: '75%', height: '140px',textAlign:'center' }"
    >
      <img
        src="../../assets/imgs/goodsDamage/baozhangicon@2x.png"
        alt
        class="baozhangicon"
        width="80px"
        style="margin-top: 20px;"
      />
      <div>本趟运输已获得货损保障权益！</div>
    </van-popup>
  </div>
</template>

<script>
import { Popup } from "vant";
import { UPLOAD_APP_FUN } from "@/utils/version.js";
import {
  AppFinish,
  AppHowtoBack,
  buildBillAgain,
  startRecgnizeWithParam,
  setNativeHead,
  AppUpdateWaybillData,
} from "../../utils/app.js";
import Const from "../../utils/const.js";
import { getCompanyConfig, buildWaybillAgain } from "../../api/api.js";
import { newBuildTemplate } from "../../api/newBuildTemplate.js";
import { getCertificationInformation } from "../../api/apiHybWallet.js";
import { getPupupTime } from "../../api/goodsDamage.js";
export default {
  components: {
    vanPopup: Popup,
  },
  name: "way-bill-success",
  data() {
    return {
      taxWaybillId: this.$route.query.taxWaybillId,
      templateStateDisabled: true,
      templateShow: true,
      setContent: "设为常用模板",
      dazongState: this.$route.query.dazongState == "1", //如果是大综进来的，就变为true
      mobileNo: this.$route.query.mobileNo,
      driverName: this.$route.query.driverName,
      cartBadgeNo: this.$route.query.cartBadgeNo,
      wbBusinessType: this.$route.query.wbBusinessType,
      xid: "",
      pageState: false,
      result: {},
      version: "",
      newVersionBoolean: true,
      popupState: false, // 货损弹框
      popupNum: "", // 弹窗次数
      orgCfg713: "", //货损保障配置
      orgCfg714: "", //货损保障购买方式配置
      orgCfg715: "", // 保障额度
      orgCfg718: "", // 外协业务类型
    };
  },
  computed: {
    weyBillFirst() {
      return this.$store.state.wayBill.weyBillFirst;
    },
  },
  watch: {
    popupState(val) {
      if (val) {
        setTimeout(() => {
          this.popupState = false;
        }, 2000);
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    let json = { isShow: "0" };
    setNativeHead(json);
    next();
  },
  beforeRouteLeave(to, from, next) {
    let json = { isShow: "1" };
    setNativeHead(json);
    next();
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    try {
      MtaH5.clickStat("xinjianyundanlo", { waybillstep4: "true" });
    } catch (error) {
      JSON.stringify(error);
    }
    this._getCompanyConfig().then(() => {
      if (this.orgCfg713 === "8" && this.orgCfg714 != "54") {
        this._getPupupTime().then((res) => {
          if (res.result.popupNum > 3) {
            this.popupState = false;
          } else {
            this.popupState = true;
          }
          // 刷新运单数据
          this._AppUpdateWaybillData();
          this.recgnize();
        });
      } else {
        // 刷新运单数据
        this._AppUpdateWaybillData();
        this.recgnize();
      }
    });
  },
  mounted() {
    AppHowtoBack("1");
    window.localStorage.removeItem("sendGoodsInfo");
  },
  methods: {
    // 获取所有配置
    _getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let result = res.data.result;
              this.orgCfg713 = result.orgCfg713;
              this.orgCfg714 = result.orgCfg714;
              this.orgCfg715 = result.orgCfg715;
              this.orgCfg718 = result.orgCfg718;
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
    _getPupupTime() {
      return new Promise((resolve, reject) => {
        getPupupTime({ type: 1 })
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              resolve(res.data);
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch((err) => {
            reject();
            this.$vux.toast.text(err.message, "middle");
            this.$store.commit("updateLoadingStatus", { isLoading: false });
          });
      });
    },
    _AppUpdateWaybillData() {
      let json = {
        taxWaybillId: this.taxWaybillId, //运单号
        type: "5",
        content: {},
      };
      AppUpdateWaybillData(json);
    },
    //再建一单
    buildAgain() {
      try {
        MtaH5.clickStat("waybill_success_buildagain");
      } catch (error) {
        JSON.stringify(error);
      }
      // AppFinish(-4);
      //待客户端出关闭webview的方法
      //拟定参数taxWaybillId
      // let json = {
      //     taxWaybillId: this.taxWaybillId
      // };
      //调用方法
      buildBillAgain(this.taxWaybillId);
    },
    goback() {
      let json = {
        selectedIndex: "0",
        subIndex: "0",
        waybillTopIndex: "0",
        refreshList: ["0"],
      };
      if (this.$sysType === 1) {
        // android写法
        AndroidWaybillJs.jumpIndex(JSON.stringify(json));
      } else if (this.$sysType === 2) {
        // ios写法
        window.webkit.messageHandlers.jumpIndex.postMessage(
          JSON.stringify(json)
        );
      } else {
        if (this.wbBusinessType != 2) {
          AppFinish(-4);
        } else {
          this.goonConfirm();
        }
      }
    },
    //查看运单
    checkWayBill() {
      try {
        MtaH5.clickStat("waybill_success_lookwaybill");
      } catch (error) {
        JSON.stringify(error);
      }
      let json = {
        selectedIndex: "0",
        subIndex: this.orgCfg718 === "49" ? "1" : "0",
        waybillTopIndex: "0",
        refreshList: ["0"],
      };
      if (this.$sysType === 1) {
        // android写法
        AndroidWaybillJs.jumpIndex(JSON.stringify(json));
      } else if (this.$sysType === 2) {
        // ios写法
        window.webkit.messageHandlers.jumpIndex.postMessage(
          JSON.stringify(json)
        );
      } else {
        AppFinish(-4);
      }
    },
    // 继续确认
    goonConfirm() {
      this.$router.push({
        path: "/deliveryGoodsRecord",
        query: {
          active: 1,
        },
      });
    },
    //设为常用模板
    setTemplate() {
      //点击按钮调用模板接口
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        isAll: "0",
        startProvinceId: this.weyBillFirst.startProvinceCode,
        startCityId: this.weyBillFirst.startCityCode,
        startCountyId: this.weyBillFirst.startCountyCode,
        endProvinceId: this.weyBillFirst.endProvinceCode,
        endCityId: this.weyBillFirst.endCityCode,
        endCountyId: this.weyBillFirst.endCountyCode,
        goodsName: this.weyBillFirst.goodsName, //货物名称
        goodsAmountType: this.weyBillFirst.goodsAmountType.key, //货物数量类型
        goodsAmount: this.weyBillFirst.goodsAmount, //货物数量
        unitPrice: this.weyBillFirst.unitPrice, //单价
        source: "2", //来源
      };
      newBuildTemplate(json)
        .then((res) => {
          // 3050
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.$vux.toast.text("常用模板设置成功", "middle");
            setTimeout(() => {
              this.templateStateDisabled = false;
              this.setContent = "已设置";
            }, 500);
          } else if (res.data.reCode === "2") {
            this.templateShow = false; //按钮隐藏
            this.$vux.alert.show({
              title: "提示",
              buttonText: "知道了",
              content: res.data.reInfo,
            });
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch((err) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    recgnize() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        mobileNo: this.mobileNo,
        driverName: this.driverName,
        cartBadgeNo: this.cartBadgeNo,
      };
      getCertificationInformation(json).then((res) => {
        if (res.data.reCode == "0") {
          let result = res.data.result;
          this.result = result;
          this.pageState =
            result.idCardReverse.state != "0" || result.recState == "1";
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
        this.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    },
    _buildWaybillAgain() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        taxWaybillId: this.taxWaybillId,
      };
      buildWaybillAgain(json)
        .then((res) => {
          //3048
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            if (!UPLOAD_APP_FUN) {
              // 没app上传就调用老的认证
              let result = res.data.result;
              this.xid = result.xid;
              let json = Object.assign(this.result, {
                mobileNo: this.mobileNo,
                driverName: this.driverName,
                cartBadgeNo: this.cartBadgeNo,
                taxWaybillId: this.taxWaybillId,
                xid: this.xid,
                from: "2",
              });
              startRecgnizeWithParam(json);
            } else {
              this.$router.push({
                path: "/Recognize",
                query: {
                  mobileNo: this.mobileNo,
                  driverName: this.driverName,
                  cartBadgeNo: this.cartBadgeNo,
                  taxWaybillId: this.taxWaybillId,
                  from: "2",
                  hiddenNativeNav: true,
                },
              });
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch((err) => {
          this.$vux.toast.text(err, "middle");
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
    },
  },
};
</script>

<style lang="less">
.way-bill-success {
  background: #efefef;
  /deep/ .van-popup--center.van-popup--round {
    border-radius: 5px;
    .baozhangicon {
      width: 80px;
      height: 60px;
      margin-top: 20px;
    }
  }
  .right-title {
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
  }
  .success_tip {
    text-align: center;
    font-weight: bold;
    color: #202020;
  }
  .weui-btn_default {
    background-color: #fff;
    color: #15499a;
    // width: 55%;
    padding: 0;
    border: 1px solid #15499a;
  }
  .chakan {
    background-color: #fff;
    color: #15499a;
    border: 1px solid #15499a;
  }
  .weui-btn_disabled {
    color: #bfbfbf !important;
    // border: 1px solid #BFBFBF;
    border: none;
  }
  .img-container {
    background: #fff;
    text-align: center;
    margin: 0 auto;
    padding: 2rem;
    img {
      margin: 2rem auto 0;
    }
  }
  .baozhangContent {
    background: #fff;
    padding: 0 5%;
    padding-bottom: 30px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .card {
      width: 100%;
      padding: 10px;
      display: flex;
      display: -webkit-box;
      display: -webkit-flex;
      background: rgba(245, 251, 255, 1);
      box-shadow: 0px 5px 15px 0px rgba(6, 39, 116, 0.08);
      border-radius: 10px;
      .left {
        width: 50px;
        height: 60px;
        margin-right: 10px;
        flex: 1;
      }
      .right {
        flex: 5;
        font-weight: 500;
        font-size: 14px;
        span {
          font-weight: bold;
          color: #feb904;
        }
      }
    }
  }
  .content-container {
    background: #fff;
    padding: 0 5%;
    padding-bottom: 30px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > div {
      // flex: 1;
      width: 100%;
      margin: 0 5px;
    }
  }
  .bottom-container {
    background: #fff;
    margin-top: 10px;
    padding-top: 30px;
    .bg-box {
      background: url("../../assets/imgs/bg_img@2x.png") center no-repeat;
      background-size: cover;
      // height: 12vh;
      height: 75px;
      width: 95vw;
      margin: 0 auto;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .placeholder {
        width: 24vw;
      }

      .text {
        flex: 1;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }
      .circle {
        background: linear-gradient(
          0deg,
          rgba(255, 203, 64, 1),
          rgba(254, 222, 136, 1)
        );
        box-shadow: 0px 0px 25px 0px rgba(48, 83, 215, 1);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(65, 102, 239, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-right: 3vw;
        line-height: 100%;
      }
      @media screen and (max-width: 360px) {
        .text {
          font-size: 14px;
        }
        .circle {
          width: 50px;
          height: 50px;
          font-size: 14px;
        }
      }
    }
  }
  .oldList {
    background: #fff;
    & > div {
      padding: 10px;
      width: 50%;
      margin: 0 auto;
    }
  }
}
</style>
