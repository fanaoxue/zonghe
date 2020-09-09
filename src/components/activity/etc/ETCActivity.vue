<template>
  <div class="ETCActivity-container">
    <c-header isShowTitle class="header">
      <x-header :left-options="{ backText: '' ,preventGoBack: true, showBack: true}" @on-click-back="goHome()">
        ETC活动
        <div slot="right" @click="goToETCInvitationRecord"><i class="iconfont iconjilu"></i></div>
      </x-header>
    </c-header>
    <div v-show="showPage">
      <div class="header-container">
        <div class="money">
          ￥<span>{{ rewardAmount }}</span>
        </div>
        <div class="text">
          <span v-show="etcOpenNum === '0'"
            >您当前还未邀请好友，快去邀请拿现金奖！</span
          >
          <span v-show="etcOpenNum !== '0'"
            >您已邀请<span class="yellow">{{ etcOpenNum }}位</span
            >好友开通ETC成功！</span
          >
        </div>
        <div class="button">
          <x-button type="primary" @click.native="seeDetails"
            >查看详情>></x-button
          >
        </div>
      </div>
      <div class="content-container">
        <div class="item">
          <div class="banner-box">
            <img class="banner" src="../../../assets/imgs/activity/etc/banner@2x.png" alt="" />
          </div>
        </div>
        <div class="item">
          <div class="title">
            <i class="iconfont iconsanjiao-you"></i>合伙人权益：
          </div>
          <ul>
            <li>
              <div class="num">1</div>
              丰厚收益：每邀请一个好友办理开通ETC即可获得30-50元现金奖励，奖励上不封顶；
            </li>
            <li>
              <div class="num">2</div>
              持续赋能：司机办理ETC后，关联司机ETC记录，整合社会运力，持续获得路歌赋能；
            </li>
            <li>
              <div class="num">3</div>
              司机办理优势：免费办理，免费OBU设备；全国通行最低95折；全程安装及使用指导。
            </li>
          </ul>
        </div>
        <div class="item">
          <div class="title">
            <i class="iconfont iconsanjiao-you"></i>合伙人奖励规则：
          </div>
          <ul>
            <li>
              <div class="num">1</div>
              点击页面下方“我的二维码”生成专属二维码分享给好友，好友扫描后进行办理可获得奖励；
            </li>
            <li>
              <div class="num">2</div>
              点击页面下方“分享给好友”，好友通过分享链接办理后可获得奖励。
            </li>
          </ul>
        </div>
        <div class="item tip">
          注：本活动最终解释权归路歌所有
        </div>
      </div>
      <div class="footer-container">
        <x-button class="button-my" type="primary" @click.native="seeMyQRcode"
          >我的二维码</x-button
        >
        <x-button class="button-share" type="primary" @click.native="share"
          >分享给好友</x-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { goToShare, setNativeHead, AppFinish } from "../../../utils/app";
import { getETCInfo } from "../../../api/apiETC.js";
import { activityMaidian } from "../../../api/maidian.js";
export default {
  name: "ETCActivity",
  data() {
    return {
      showPage: false, //默认页面不展示
      rewardAmount: "0",
      etcOpenNum: "0",
      etcLinkUrl: ""
    };
  },
  mounted() {
    let json = { isShow: "0" };
    setNativeHead(json);
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    setTimeout(() => {
      this._setLog("40");
    }, 300);
    this.getETCInfo();
    this.showPage = true;
  },
  methods: {
    _setLog(type) {
      let json = {
        type: type,
        behaviorType: "3",
        orgId: "-1"
      };
      activityMaidian(json).then(() => {});
    },
    getETCInfo() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      getETCInfo()
        .then(res => {
          if (res.data.reCode === "0") {
            let result = res.data.result;
            this.rewardAmount = result.rewardAmount;
            this.etcOpenNum = result.etcOpenNum;
            this.etcLinkUrl = result.etcLinkUrl;
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    seeDetails() {
      this.$router.push({
        path: "/ETCRecommendedReward"
      });
    },
    seeMyQRcode() {
      this._setLog("41");
      this.$router.push({
        path: "/ETCQRcode",
        query: {
          etcLinkUrl: this.etcLinkUrl
        }
      });
    },
    share() {
      let json = {
        targetUrl: this.etcLinkUrl + "&type=43&t=" + new Date().getTime(),
        title: "您有一张免费ETC卡待领取，免费开通，高速95折",
        timelineTitle: "您有一张免费ETC卡待领取，免费开通，高速95折",
        text: "免费开通，高速95折",
        titleIcon:
          "https://business-ol.log56.com/m-klbcfg/klbs/20191115/5ce75b61-72ee-46f1-b69b-fc15e5e5de1f.png",
        sourcetType: "1"
      };
      goToShare(json);
    },
    goToETCInvitationRecord(){
      this.$router.push({path:'/ETCInvitationRecord'})
    },
    goHome(){
      AppFinish(-1)
    }
  }
};
</script>
<style lang="less">
.ETCActivity-container {
  background: #000;
  min-height: 100vh;
  padding-bottom: 140px;
  .header{
    position: fixed;
    z-index: 999;
    width: 100%;
    top: 0;
    left: 0;
  }
  .iconjilu{
    color: #fff;
    font-size: 18px;
  }
  .header-container {
    padding-top: 45px;
    background: url("../../../assets/imgs/activity/etc/bg_img@2x.png") no-repeat
      center center;
    background-size: cover;
    height: 130px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .money {
      font-size: 18px;
      line-height: 1.2;
      // font-family: PingFang;
      font-weight: bold;
      color: rgba(255, 186, 0, 1);
      span {
        font-size: 30px;
      }
    }
    .text {
      font-size: 14px;
      // font-family: PingFang;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 32px;
      .yellow {
        color: rgba(255, 186, 0, 1);
      }
    }
    .button {
      button {
        width: 110px;
        height: 28px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 28px;
        font-size: 14px;
        font-family: PingFang;
        font-weight: 500;
        color: rgba(21, 73, 154, 1);
        line-height: 28px;
      }
    }
  }
  .content-container {
    background: #000;
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    .item {
      padding-top: 10px;
      .banner-box{
        padding: 10px 20px;
        .banner{
          width: 100%;
        }
      }
      .title {
        font-size: 16px;
        font-family: PingFang;
        font-weight: bold;
        color: #FFBA00;
        margin-top: 10px;
        margin-bottom: 10px;
        // img {
        //   width: 7px;
        //   height: 12px;
        //   margin-right: 5px;
        // }
        .iconsanjiao-you{
          color: #FFBA00;
          font-weight: normal;
          font-size: 17px;
        }
      }
      ul {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: c;
        list-style: none;
        padding: 0 18px;
        font-size: 14px;
        font-family: PingFang;
        font-weight: 500;
        color: #fff;
        li {
          position: relative;
          margin: 5px 0;
          .num {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 1px solid #fff;
            border-radius: 50%;
            line-height: 16px;
            text-align: center;
            color: #fff;
            position: absolute;
            left: -20px;
            top: 2px;
          }
        }
      }
    }
    .tip{
      font-size:14px;
      font-weight:500;
      color:rgba(251,252,252,1);
      text-align: center;
    }
  }
  .footer-container {
    background: #000;
    position: fixed;
    z-index: 999;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    button {
      width: 100%;
      height: 40px;
      background: rgba(50, 114, 214, 1);
      border-radius: 40px;
      font-size: 15px;
      // font-family: PingFang;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 30px;
      margin-bottom: 20px;
    }
    .button-share {
      background: rgba(255, 186, 0, 1);
    }
  }
}
</style>
