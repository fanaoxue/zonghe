<template>
  <div class="discern-success">
    <c-header :isShowTitle="true">
      <x-header
        :left-options="{ backText: '', preventGoBack: true }"
        @on-click-back="goHome()"
        >证件识别</x-header
      >
    </c-header>
    <div class="content-container">
      <div class="title-box" v-if="state === '1'">
        <img
          class="title-img-tijiaoshenhe"
          src="../../assets/imgs/icons/quwanshan_icon@2x.png"
          alt
        />
        <div class="title">去完善</div>
        <div class="text">{{ msg }}</div>
      </div>
      <div class="title-box" v-if="state === '2'">
        <img
          class="title-img-tijiaoshenhe"
          src="../../assets/imgs/icons/tijiaoshenhe_icon@2x.png"
          alt
        />
        <div class="title">待审核</div>
        <div class="text">{{ msg }}</div>
      </div>
      <div class="title-box" v-if="state === '3'">
        <img
          class="title-img-shibiewancheng"
          src="../../assets/imgs/icons/shibiewancheng_icon@2x.png"
          alt
        />
        <div class="title">已识别！</div>
        <div class="text">{{ msg }}</div>
      </div>
      <div class="title-box" v-if="state === '4'">
        <img
          class="title-img-tijiaoshenhe"
          src="../../assets/imgs/icons/tijiaoshenhe_icon@2x.png"
          alt
        />
        <div class="title">审核未通过</div>
        <div class="text">{{ msg }}</div>
      </div>
      <div
        class="description"
        v-if="
          bindState == '0' &&
            hybWalletCfg == '8' &&
            (state === '2' || state === '3')
        "
      >
        您已帮助司机开通了好运宝钱包。为了方便司机提取运费，请帮助司机绑定银行卡。
      </div>
      <div class="button-container">
        <div
          v-if="
            bindState == '0' &&
              hybWalletCfg == '8' &&
              (state === '2' || state === '3')
          "
        >
          <x-button class="qubangding" @click.native="_getNewBankCard"
            >去绑定</x-button
          >
          <div class="wancheng" @click="goHome">完成</div>
        </div>
        <div v-else>
          <x-button class="qubangding" @click.native="goHome">完成</x-button>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="showBankCard"
        title="银行卡信息"
        cancelText="重新绑定"
        confirmText="确定使用"
        @on-cancel="onCancel"
        @on-confirm="onConfirm"
      >
        <div class="card-box">
          <div>{{ bankName }}</div>
          <div>{{ bankCardNo | formatBank }}</div>
          <div
            style="width:100%;display: flex;justify-content: space-between;align-items: center;"
          >
            <span>持卡人：{{ realName }}</span>
            <img
              style="width:26px;height:16px"
              src="../../assets/imgs/icons/yinlian_icon@2x.png"
              alt
            />
          </div>
        </div>
        <div
          style="font-size:15px;text-align: left;line-height:30px;margin-top:20px;"
        >
          该司机最近使用该卡在路歌平台上收取运费，是否使用此卡来绑定？
        </div>
      </confirm>
    </div>
  </div>
</template>

<script>
import { setNativeHead, AppFinish, jumpIndex } from "@/utils/app.js";
import { getCompanyConfig } from "@/api/api.js";
import {
  getNewBankCard,
  bindBankCard,
  getIsBindBankcard
} from "../../api/apiHybWallet.js";
export default {
  name: "discern-success",
  data() {
    return {
      showBankCard: false,
      bankName: "",
      bankCardNo: "",
      result: this.$route.query.result,
      cartBadgeNo: "",
      realName: "",
      mobileNo: "",
      msg: "",
      // 1、去完善;
      // 2、待审核;
      // 3、已识别;
      // 4、审核未通过；
      state: "1",
      idCard: "",
      hybWalletCfg: "",
      bindState: "1", //0：未绑 1：已绑定
      from: this.$route.query.from ? this.$route.query.from : "2" // 0:运输列表 1：个人中心 2:建单 3：其他
    };
  },
  beforeRouteEnter (to, from, next) {
    let json = { isShow: "0" };
    setNativeHead(json);
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "Recognize") {
      // 控制安卓返回
      this.goHome();
      return
    }
    if (to.name === "bindingBankCard") {
      let json = { isShow: "1" };
      setNativeHead(json);
    }
    next();
  },
  created() {
    try {
      const result = JSON.parse(this.result);
      this.cartBadgeNo = result.cartBadgeNo;
      this.realName = result.realName;
      this.mobileNo = result.mobileNo;
      this.msg = result.msg;
      this.state = result.state;
      this.idCard = result.idCard;
      this.dcaWsUserId = result.dcaWsUserId;
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    if (this.state === "2" || this.state === "3") {
      this._getCompanyConfig();
    }
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    onConfirm() {
      let json = {
        dcaWsUserId: this.dcaWsUserId,
        bankCardNo: this.bankCardNo,
        bankName: this.bankName,
        realName: this.realName,
        from: this.from
      };
      bindBankCard(json).then(res => {
        if (res.data.reCode == "0") {
          this.$vux1.confirm.show({
            showCancelButton: false,
            title: `消息提示`,
            content: `<p style='color:#454545;'>绑定成功，司机可使用此卡在好运宝钱包中提取运费!</p>`,
            confirmText: "确定",
            onConfirm: () => {
              this.goHome();
            }
          });
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
        this.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    },
    onCancel() {
      this.goBind();
    },
    _getIsBindBankcard() {
      if (!this.dcaWsUserId) {
        return;
      }
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        dcaWsUserId: this.dcaWsUserId
      };
      getIsBindBankcard(json).then(res => {
        if (res.data.reCode == "0") {
          let result = res.data.result;
          this.bindState = result.bindState;
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
        this.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    },
    goBind() {
      this.$router.push({
        name: "bindingBankCard",
        query: {
          dcaWsUserId: this.dcaWsUserId,
          realName: this.realName,
          hybWalletCfg: this.hybWalletCfg,
          from: this.from
        }
      });
    },
    goHome() {
      if (this.from == "1") {
        AppFinish(-1);
      } else if (this.from == "0") {
        try {
          MtaH5.clickStat("waybill_success_lookwaybill");
        } catch (error) {
          JSON.stringify(error);
        }
        AppFinish(-1);
      } else {
        try {
          MtaH5.clickStat("waybill_success_lookwaybill");
        } catch (error) {
          JSON.stringify(error);
        }
        // 跳转刷新客户端
        let json = {
          selectedIndex: "0",
          subIndex: "0",
          waybillTopIndex: "0"
        };
        jumpIndex(json);
        // if (this.$sysType === 1) {
        //   // android写法
        //   AndroidWaybillJs.jumpIndex(JSON.stringify(json));
        // } else if (this.$sysType === 2) {
        //   // ios写法
        //   window.webkit.messageHandlers.jumpIndex.postMessage(
        //     JSON.stringify(json)
        //   );
        // } else {
        //   AppFinish(-1);
        // }
      }
    },
    _getNewBankCard() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        realName: this.realName,
        payeeIdCard: this.idCard
      };
      getNewBankCard(json).then(res => {
        if (res.data.reCode == "0") {
          let result = res.data.result;
          if (Object.keys(result).length != 0) {
            this.bankName = result.bankName;
            this.bankCardNo = result.bankCardNo;
            this.showBankCard = true;
          } else {
            this.goBind();
          }
        } else {
          this.goBind();
        }
        this.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    },
    _getCompanyConfig() {
      getCompanyConfig()
        .then(res => {
          if (res.data.reCode === "0") {
            this.hybWalletCfg = res.data.result.hybWalletCfg; // 好运宝钱包配置 8：开通9：关闭
            this._getIsBindBankcard();
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
.discern-success {
  .content-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 60px 30px;
    .title-box {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .title-img-tijiaoshenhe {
        width: 52px;
        height: 52px;
      }
      .title-img-shibiewancheng {
        width: 63px;
        height: 51px;
      }
      .title {
        font-size: 17px;
        font-weight: 500;
        font-family: PingFang SC;
        color: rgba(32, 32, 32, 1);
        margin-top: 15px;
        margin-bottom: 10px;
      }
      .text {
        font-size: 17px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(32, 32, 32, 1);
      }
    }
    .description {
      margin-top: 33px;
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(32, 32, 32, 1);
    }
    .button-container {
      margin-top: 80px;
      width: 100%;
      text-align: center;
      .qubangding {
        background: rgba(21, 73, 154, 1);
        color: #fff;
        // border-radius: 10px;
      }
      .wancheng {
        margin-top: 10px;
        display: inline-block;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        text-decoration: underline;
        color: rgba(21, 73, 154, 1);
      }
    }
  }
}
.weui-dialog {
  width: 90%;
  max-width: none;
  .weui-dialog__bd {
    padding: 20px;
    .card-box {
      // margin: 10px;
      box-sizing: border-box;
      padding: 10px;
      width: 100%;
      height: 112px;
      background: url("../../assets/imgs/yinlianbg_img@2x.png") center no-repeat;
      background-size: 100%;
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      flex-direction: column;
      color: #fff;
    }
  }
}
</style>
