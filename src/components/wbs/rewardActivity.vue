<!-- reward-activity -->
<template>
  <div class="reward-activity">
    <c-header>
      <x-header :left-options="{backText: ''}">开通好运宝收款</x-header>
    </c-header>
    <div v-show="showPage" class="container">
      <div class="img-box">
        <span class="text">好运宝收款</span>
        <span class="line"></span>
      </div>
      <div class="input-box">
        <group
          label-width="4.8em"
          label-align="left"
          label-margin-right="1em"
          title="请输入司机手机号码检测该司机是否开通了好运宝收款~"
          title-color="#FFBA00"
        >
          <x-input
            class="vux-1px-b title"
            title="司机手机:"
            v-model.trim="mobileNo"
            placeholder="请输入司机的手机号码"
            type="tel"
          ></x-input>
        </group>
        <div class="button-box">
          <x-button type="primary" @click.native="clickConfirm">下一步</x-button>
        </div>
      </div>
      <div class="click-list">
        <!-- <div class="my-reward" @click="seeRecommendedReward">
          <div class="left-box">
            <img class="left-img" src="../../assets/imgs/icons/jiangli_icon@2x.png" alt />
            <span>我的奖励</span>
          </div>
          <img class="right-img" src="../../assets/imgs/icons/fanhui_icon@2x.png" alt />
        </div> -->
        <div class="my-reward" @click="seeAlipayCode">
          <div class="left-box">
            <img class="left-img" src="../../assets/imgs/icons/erweima_icon@2x.png" alt />
            <span>支付宝推荐二维码</span>
          </div>
          <img class="right-img" src="../../assets/imgs/icons/fanhui_icon@2x.png" alt />
        </div>
      </div>

      <!-- <div class="my-reward" @click="seeRecommendedReward">
        <div class="my-reward-box">
          <img src="../../assets/imgs/huikuan_icon@2x.png" alt />我的奖励
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { phoneGetName } from "../../api/api";
export default {
  name: "rewardActivity",
  data() {
    return {
      showPage: false, //默认页面不展示
      mobileNo: "",
      driverName: "",
      driverName: "",
      payBankName: "",
      payBankNo: "",
      alipayNo: "",
      idCard: ""
    };
  },
  components: {},
  computed: {},
  mounted() {
    this.showPage = true;
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    seeRecommendedReward() {
      this.$router.push({
        name: "recommendedReward"
      });
    },
    seeAlipayCode() {
      this.$router.push({
        name: "alipayQRcode"
      });
    },
    clickConfirm() {
      if (this.mobileNo.length === 0) {
        this.$vux.toast.text("请输入手机号！", "middle");
        return false;
      }
      if (this.mobileNo.length !== 11) {
        this.$vux.toast.text("手机号错误！", "middle");
        return false;
      }
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        mobileNo: this.mobileNo
      };
      phoneGetName(json).then(res => {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        if (res.data.reCode !== "0") {
          this.$vux.toast.text(res.data.reInfo, "middle");
        } else {
          let result = res.data.result;
          this.driverName = result.driverName;
          this.alipayNo = result.alipayNo;
          // this.mobileNo = result.mobileNo;
          this.payBankName = result.payBankName;
          this.payBankNo = result.payBankNo;
          this.idCard = result.idCard;
          if (this.driverName && this.alipayNo && this.mobileNo) {
            this.$vux1.confirm.show({
              title: "提示",
              content: "该司机已开通了好运宝收款，换一个试试吧~",
              confirmText: "确认",
              showCancelButton: false,
              onConfirm: () => {}
            });
          } else {
            this.$router.push({
              name: "webReciveMsg3",
              query: {
                mobileNo: this.mobileNo
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style lang='less'>
.reward-activity {
  width: 100%;
  // min-height: 100%;
  // max-height: 100%;
  height: 100%;
  position: absolute;
  background: #efefef;
  .container {
    height: 100%;
    width: 100%;
  }
  .weui-cells__title {
    padding-left: 0;
    padding-right: 0;
  }
  .weui-cells::before {
    border: none;
  }
  .weui-cells::after {
    border: none;
  }
  .weui-btn_primary {
    background-color: #15499a !important;
    margin: 10px auto;
    width: 90% !important;
  }

  .img-box {
    background: url(../../assets/imgs/huodongbg@2x.png) no-repeat;
    background-size: 100% 100%;
    height: 180px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .text {
      font-size: 17px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 18px;
      opacity: 0.8;
      display: inline-block;
      margin-top: 55px;
      margin-left: 5vw;
    }
    .line {
      margin-left: 5vw;
      margin-top: 10px;
      width: 18px;
      height: 2px;
      background: #55abfb;
      border-radius: 2px;
    }
  }
  .input-box {
    width: 90%;
    height: 226px;
    background: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 10px 20px;
    margin: 0 auto;
    position: relative;
    top: -69px;
    z-index: 99;
    box-shadow: 0px 0px 20px 0px rgba(2, 30, 74, 0.04);
  }
  .title {
    font-size: 16px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  // .my-reward {
  //   margin-top: 28px;
  //   text-align: center;
  //   font-size: 16px;
  //   font-family: PingFang-SC-Medium;
  //   font-weight: 500;
  //   color: #15499a;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   .my-reward-box {
  //     border-bottom: 1px solid #15499a;
  //   }
  //   img {
  //     width: 12px;
  //     margin-right: 5px;
  //   }
  // }
  .click-list {
    position: relative;
    top: -49px;
    .my-reward {
      width: 90%;
      height: 65px;
      box-sizing: border-box;
      padding: 0 15px 0 32px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 20px 0px rgba(2, 30, 74, 0.04);
      border-radius: 32px;
      margin: 0 auto;
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .left-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex: 1;
        .left-img {
          width: 30px;
          margin-right: 10px;
        }
      }
      .right-img {
        width: 9px;
        height: 16px;
      }
    }
  }

  .button-box {
    margin: 0 auto;
    margin-top: 40px;
    width: 290px;
    // width: 300px;
    height: 45px;
  }
}
</style>
