<template>
  <div class="settlement-activity-container">
    <div v-show="showPage == true" class="container">
      <div class="title-container">
        <img src="@/assets/imgs/activity/wenzi@2x.png" alt />
      </div>
      <div class="content-container">
        <div class="content-box">
          <div class="title"></div>
          <div class="content">
            <div class="item">
              <div class="circle">
                <img src="@/assets/imgs/activity/yunli_icon@2x.png" alt />
              </div>
              <div class="text">稳定运力</div>
            </div>
            <div class="item">
              <div class="circle">
                <img src="@/assets/imgs/activity/biaozhun_icon@2x.png" alt />
              </div>
              <div class="text">
                运费
                <br />结算标准
              </div>
            </div>
            <div class="item">
              <div class="circle">
                <img src="@/assets/imgs/activity/chegnben_icon@2x.png" alt />
              </div>
              <div class="text">
                降低
                <br />采购成本
              </div>
            </div>
          </div>
        </div>
        <div class="footer-box">
          <div class="lianzi">
            <img src="@/assets/imgs/activity/lianzi_img@2x.png" alt />
            <img src="@/assets/imgs/activity/lianzi_img@2x.png" alt />
          </div>
          <div class="content">
            <div class="item">
              <div class="title">
                <div class="line"></div>供应链金融运单标准 
              </div>
              <ul class="detail">
                <li>
                  <div>运费账期</div>
                  <div class="blue">
                    <span>{{collectTwoDriAccPerCfg}}</span>天
                  </div>
                </li>
                <li>
                  <div>预付油卡</div>
                  <div class="blue">路歌支付</div>
                </li>
                <li>
                  <div>到付金额</div>
                  <div class="blue">路歌支付</div>
                </li>
                <li v-if="collectTwoRecDepositCfg === '8'">
                  <div>回单押金<br/><span class="mini_text" v-if="orgCfg710 === '44'">≤运费{{ orgCfg726 * 100}}%</span></div>
                  <div class="blue">{{ orgCfg710 === '44'?'路歌支付':'企业支付' }}</div>
                </li>
              </ul>
            </div>
            <div class="item">
              <div class="title">
                <div class="line"></div>供应链金融要求 
              </div>
              <div class="detail">司机上传回单，企业及时（48h内）与货主确认后审核回单，确认使用供应链金融支付。</div>
            </div>
            <div class="item">
              <div class="title">
                <div class="line"></div>供应链金融使用说明 
              </div>
              <div class="detail">
                1、审核回单后，即代表司机完成运输，平台<span>{{collectTwoDriAccPerCfg}}</span>天后自动付款给司机运费。
                <br /> 
                2、审核回单后，平台为诚信优质司机，提供提前收取运费服务，司机急需用钱，可在<span>{{collectTwoDriAccPerCfg}}</span>天内提前支取，司机需支付少量结算服务费。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "settlementActivity",
  data() {
    return {
      showPage: false, //默认页面不展示
      collectTwoDriAccPerCfg: this.$route.query.collectTwoDriAccPerCfg, // 到付金2司机账期
      collectTwoRecDepositCfg: this.$route.query.collectTwoRecDepositCfg, // 到付金2-回单押金
      orgCfg726: this.$route.query.orgCfg726, // 回单押金最高配比
      orgCfg710: this.$route.query.orgCfg710, // 到付金2支付运费结构 43：到付款（默认）44：到付款+回单押金
    };
  },
  mounted() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    this.showPage = true;
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.settlement-activity-container {
  width: 100%;
  height: 100%;
  @media screen and (max-width: 320px) {
    font-size: 10px;
    line-height: 140%;
  }
  .container {
    width: 100vw;
    height: 100vh;
    // width: 100%;
    // height: 100%;
    // position: fixed;
    background-image: url('~@/assets/imgs/activity/bg@2x.png');
    background-repeat: no-repeat;
    overflow: hidden;
    background-size: 100% 100%;
    // background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: none;
    .title-container {
      min-height: 90px;
      height: 160px;
      width: 100%;
      // flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        height: 75px;
        width: 190px;
        @media screen and (max-width: 320px) {
          height: 37px;
          width: 95px;
        }
      }
    }
    .content-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      .footer-box {
        flex: 1;
      }
    }
    .content-box {
      background-image: url('~@/assets/imgs/activity/youshibg_bg@2x.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      height: 189px;
      @media screen and (max-width: 320px) {
        height: 150px;
        font-size: 12px;
      }
      .title {
        background-image: url('~@/assets/imgs/activity/title_bg@2x.png');
        background-repeat: no-repeat;
        overflow: hidden;
        background-size: 100% 100%;
        height: 46px;
        width: 231px;
        position: relative;
        top: -10px;
        margin: 0 auto;
      }
      .content {
        padding: 0 20px;
        display: flex;
        justify-content: space-around;
        .item {
          display: flex;
          flex-direction: column;
          @media screen and (max-width: 320px) {
            font-size: 12px;
          }
          .circle {
            width: 54px;
            height: 54px;
            background: rgba(66, 99, 231, 0.1);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 26px;
            }
          }
          .text {
            margin-top: 5px;
            font-size: 14px;
            font-family: Source Han Sans SC;
            font-weight: 400;
            color: rgba(55, 103, 231, 1);
            text-align: center;
          }
        }
      }
    }
    .footer-box {
      background-image: url('~@/assets/imgs/activity/jiesuan_bg@2x.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      height: 315px;
      @media screen and (max-width: 320px) {
        height: 250px;
      }
      .lianzi {
        position: relative;
        top: -15px;
        display: flex;
        justify-content: space-between;
        padding: 0 60px;
        img {
          height: 32px;
          width: 7px;
        }
      }
      .content {
        padding: 0 24px;
        .item {
          font-size: 13px;
          font-family: Source Han Sans SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          .title {
            font-weight: bold;
            color: rgba(55, 103, 231, 1);
            .line {
              display: inline-block;
              width: 4px;
              height: 12px;
              background: rgba(255, 176, 27, 1);
              border-radius: 4px;
              margin-right: 5px;
            }
          }
          ul {
            display: flex;
            justify-content: space-around;
            align-items: stretch;
            list-style: none;
            text-align: center;
            line-height: 1.2;
            li {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .blue {
              font-size: 16px;
              font-weight: bold;
              color: rgba(55, 103, 231, 1);
            }
            .mini_text {
              font-size: 12px;
            }
          }
          .detail {
            margin-left: 13px;
          }
        }
      }
    }
  }
}
</style>
